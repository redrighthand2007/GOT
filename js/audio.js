// --- Sound: music, effects, mute ---
// Music and the sword sound run through Web Audio so fades work everywhere
// (iPhones ignore <audio>.volume). Opened straight from disk (file://) the
// browser blocks that routing, so it falls back to fading .volume instead.
const Sound = (() => {
    const MUSIC_LEVEL = 0.4;   // normal music volume
    const FIGHT_LEVEL = 0.15;  // music while the swords clash
    const SWORD_LEVEL = 0.7;
    const MUTE_KEY = 'got-muted';

    // Optional clips for the battle result, e.g. 'assets/audio/victory.mp3'.
    // Left empty, a war horn and drums are played instead.
    const STING_FILES = { victory: '', defeat: '' };

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const canRoute = Boolean(AudioCtx) && location.protocol !== 'file:';
    const soundIcon = document.getElementById('sound-icon');

    let ctx = null, master = null, musicGain = null, sfxGain = null;
    let started = false;        // set once JOIN THE WORLD WAR starts the music
    let level = MUSIC_LEVEL;    // where the music should sit right now
    let muted = readMuted();
    let fadeFrame = 0;

    function readMuted() {
        try { return localStorage.getItem(MUTE_KEY) === '1'; } catch (e) { return false; }
    }
    function saveMuted() {
        try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch (e) { /* private mode */ }
    }

    // Browsers only allow sound after a tap, so this runs from tap handlers
    function ensureContext() {
        if (!AudioCtx) return null;
        if (!ctx) {
            ctx = new AudioCtx();
            master = ctx.createGain();
            master.gain.value = muted ? 0 : 1;
            master.connect(ctx.destination);
            if (canRoute) {
                try {
                    musicGain = ctx.createGain();
                    musicGain.gain.value = 0;
                    ctx.createMediaElementSource(bgMusic).connect(musicGain).connect(master);
                    sfxGain = ctx.createGain();
                    sfxGain.gain.value = SWORD_LEVEL;
                    ctx.createMediaElementSource(sfxSword).connect(sfxGain).connect(master);
                    bgMusic.volume = 1;
                    sfxSword.volume = 1;
                } catch (e) {
                    musicGain = sfxGain = null;
                }
            }
            applyMute();
        }
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
    }

    function rampGain(param, to, seconds) {
        const now = ctx.currentTime;
        param.cancelScheduledValues(now);
        param.setValueAtTime(param.value, now);
        param.linearRampToValueAtTime(to, now + seconds);
    }

    function fadeMusic(to, seconds) {
        if (musicGain) {
            rampGain(musicGain.gain, to, seconds);
            return;
        }
        cancelAnimationFrame(fadeFrame);
        const from = bgMusic.volume;
        const begin = performance.now();
        const step = (now) => {
            const p = Math.min(1, (now - begin) / (seconds * 1000));
            bgMusic.volume = from + (to - from) * p;
            if (p < 1) fadeFrame = requestAnimationFrame(step);
        };
        fadeFrame = requestAnimationFrame(step);
    }

    function updateIcon() {
        if (!soundIcon) return;
        soundIcon.innerHTML = muted ? '&#128263;' : '&#128266;';
        soundIcon.title = muted ? 'Unmute' : 'Mute';
    }

    // Fades everything out/in through the master gain; without Web Audio
    // routing, the elements are muted directly
    function applyMute() {
        updateIcon();
        if (master) rampGain(master.gain, muted ? 0 : 1, 0.3);
        bgMusic.muted = muted && !musicGain;
        sfxSword.muted = muted && !sfxGain;
    }

    function startMusic() {
        ensureContext();
        if (!musicGain && bgMusic.paused) bgMusic.volume = 0;
        started = true;
        bgMusic.play()
            .then(() => fadeMusic(level, 2))
            .catch(() => { started = false; });
    }

    function setLevel(to, seconds) {
        level = to;
        if (started) fadeMusic(to, seconds);
    }

    // Pause in background tabs, fade back in on return
    document.addEventListener('visibilitychange', () => {
        if (!started) return;
        if (document.hidden) {
            if (musicGain) {
                fadeMusic(0, 0.4);
                setTimeout(() => { if (document.hidden) bgMusic.pause(); }, 450);
            } else {
                bgMusic.pause();
            }
        } else {
            ensureContext();
            if (!musicGain) bgMusic.volume = 0;
            bgMusic.play().then(() => fadeMusic(level, 1.2)).catch(() => {});
        }
    });

    function playSword() {
        ensureContext();
        if (!sfxGain) sfxSword.volume = SWORD_LEVEL;
        sfxSword.currentTime = 0;
        sfxSword.play().catch(() => {});
    }

    // War horn: two slightly detuned saw waves through a low-pass filter
    // that opens as the note swells, like a great horn being blown
    function horn(t, freq, endFreq, dur, vol) {
        const out = ctx.createGain();
        out.gain.setValueAtTime(0.0001, t);
        out.gain.exponentialRampToValueAtTime(vol, t + 0.25);
        out.gain.setValueAtTime(vol, t + dur - 0.4);
        out.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, t);
        filter.frequency.exponentialRampToValueAtTime(900, t + 0.3);
        filter.frequency.exponentialRampToValueAtTime(450, t + dur);
        filter.connect(out).connect(master);
        [0, 7].forEach(cents => {
            const osc = ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.detune.value = cents;
            osc.frequency.setValueAtTime(freq, t);
            osc.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
            osc.connect(filter);
            osc.start(t);
            osc.stop(t + dur + 0.05);
        });
    }

    // War drum: a sine "boom" that drops in pitch
    function drum(t, vol) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.5);
        gain.gain.setValueAtTime(vol, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
        osc.connect(gain).connect(master);
        osc.start(t);
        osc.stop(t + 0.75);
    }

    function playSting(file, synth) {
        if (!ensureContext()) return;
        if (file && !muted) {
            const clip = new Audio(file);
            clip.volume = 0.8;
            clip.play().catch(synth);
            return;
        }
        synth();
    }

    // Victory: drums, then two rising horn calls (D -> A)
    function victory() {
        playSting(STING_FILES.victory, () => {
            const t = ctx.currentTime + 0.05;
            drum(t, 0.9);
            drum(t + 0.25, 0.7);
            horn(t + 0.3, 146.8, 146.8, 1.1, 0.16);
            horn(t + 1.3, 220, 220, 1.8, 0.18);
        });
    }

    // Defeat: a deep boom and one long horn sinking from A to D
    function defeat() {
        playSting(STING_FILES.defeat, () => {
            const t = ctx.currentTime + 0.05;
            drum(t, 1);
            horn(t + 0.1, 110, 73.4, 2.4, 0.16);
            drum(t + 1.3, 0.6);
        });
    }

    function toggleMute() {
        muted = !muted;
        saveMuted();
        applyMute();
    }

    applyMute(); // show the remembered mute state before any sound plays

    return {
        startMusic,
        fightStart: () => setLevel(FIGHT_LEVEL, 0.6),
        fightEnd: () => setLevel(MUSIC_LEVEL, 1.2),
        playSword,
        victory,
        defeat,
        toggleMute,
    };
})();
