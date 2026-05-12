// 1. Keep track of the scores
let userScore = 0;
let compScore = 0;

// 2. Grab all the HTML elements we need to control
const options = document.querySelectorAll(".option");
const msg = document.querySelector("#msg");
const userValPara = document.querySelector("#userval");
const cmpValPara = document.querySelector("#cmpval");
const playButton = document.querySelector("#playbutton");

let userChoice = ""; // This will hold the player's selection

// 3. Let the player pick their house (Clicking an image)
options.forEach((option) => {
  option.addEventListener("click", () => {
    // Clear the border from all options first
    options.forEach(opt => opt.style.border = "none");
    
    // Add a gold border to the one they just clicked
    option.style.border = "4px solid #ffcc00"; 
    option.style.borderRadius = "50%"; // Keeps the border round
    
    // Save their choice (stark, dragon, or lann)
    userChoice = option.getAttribute("id");
    
    // Update the message so they know what to do next
    msg.innerText = `YOU CHOSE ${userChoice.toUpperCase()}. NOW CLICK FIGHT!`;
    msg.style.color = "whitesmoke";
  });
});

// 4. Generate the Enemy's Choice
const genCompChoice = () => {
  const compOptions = ["stark", "dragon", "lann"];
  const randIdx = Math.floor(Math.random() * 3);
  return compOptions[randIdx];
};

// 5. What happens on a draw
const drawGame = () => {
  msg.innerText = "IT'S A TIE! BATTLE AGAIN.";
  msg.style.color = "yellow";
};

// 6. Announce the Winner and update the scoreboard
const showWinner = (userWin, userChoice, compChoice) => {
  if (userWin) {
    userScore++;
    userValPara.innerText = userScore;
    msg.innerText = `VICTORY! YOUR ${userChoice.toUpperCase()} BEATS ${compChoice.toUpperCase()}`;
    msg.style.color = "#00ff00"; // Neon Green
  } else {
    compScore++;
    cmpValPara.innerText = compScore;
    msg.innerText = `DEFEAT! ENEMY'S ${compChoice.toUpperCase()} BEATS YOUR ${userChoice.toUpperCase()}`;
    msg.style.color = "red";
  }
};

// 7. The Battle Logic (Triggered by the FIGHT button)
playButton.addEventListener("click", () => {
  // Prevent fighting if they haven't picked a house yet
  if (userChoice === "") {
    msg.innerText = "YOU MUST CHOOSE A HOUSE FIRST!";
    msg.style.color = "red";
    return; // Stops the code here
  }

  // Generate Enemy move
  const compChoice = genCompChoice();

  if (userChoice === compChoice) {
    drawGame();
  } else {
    let userWin = true;
    
    // Game of Thrones Logic:
    // Stark beats Lannister
    // Dragon beats Stark
    // Lannister beats Dragon
    
    if (userChoice === "stark") {
      userWin = compChoice === "dragon" ? false : true;
    } else if (userChoice === "dragon") {
      userWin = compChoice === "lann" ? false : true;
    } else { 
      // User chose "lann"
      userWin = compChoice === "stark" ? false : true;
    }
    
    showWinner(userWin, userChoice, compChoice);
  }
});
