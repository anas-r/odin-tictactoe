const gameBoard = (() => {
  let cases = [
    ["_", "_", "_"],
    ["_", "_", "_"],
    ["_", "_", "_"],
  ];
  // playerMarker denotes either 'x' or 'o'
  const setCase = (caseNumber, player) => {
    const i = (caseNumber / 3) >> 0;
    const j = caseNumber % 3;
    const actualCaseWrapper = document.querySelector(`#case-${caseNumber}`);
    const actualCase = document.querySelector(`#case-${caseNumber} span`);
    const playerMarker = player.getMarker();
    cases[i][j] = playerMarker;
    actualCase.textContent = playerMarker;
    actualCaseWrapper.classList.add("case-played");
  };
  const isWinner = (player) => {
    const marker = player.getMarker();
    const winningArray = [marker, marker, marker];
    const allCombinations = [];
    // all rows
    for (let i = 0; i < 3; i++) {
      allCombinations.push(cases[i]);
    }
    // all columns
    for (let j = 0; j < 3; j++) {
      allCombinations.push([cases[0][j], cases[1][j], cases[2][j]]);
    }
    // both diagonals
    allCombinations.push([cases[0][0], cases[1][1], cases[2][2]]);
    allCombinations.push([cases[2][0], cases[1][1], cases[0][2]]);
    for (let i = 0; i < 8; i++) {
      if (JSON.stringify(winningArray) === JSON.stringify(allCombinations[i])) {
        return true;
      }
    }
    return false;
  };
  const isDraw = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (cases[i][j] === "_") {
          return false;
        }
      }
    }
    return true;
  };
  const reset = () => {
    cases = [
      ["_", "_", "_"],
      ["_", "_", "_"],
      ["_", "_", "_"],
    ];
    document.querySelectorAll(".board-case").forEach((oneCase) => {
      oneCase.classList.remove("case-played");
    });
    document.querySelectorAll(".board-case span").forEach((oneCase) => {
      oneCase.textContent = "";
    });
  };
  return { setCase, isWinner, isDraw, reset };
})();

const displayController = (() => {
  let namePlayer = document.querySelector("#player-1 span");
  let scorePlayer = document.querySelector("#score-1 span");
  let scoreComputer = document.querySelector("#score-2 span");
  const addScorePlayer = () => {
    scorePlayer.textContent = parseInt(scorePlayer.textContent) + 1;
  };
  const addScoreComputer = () => {
    scoreComputer.textContent = parseInt(scoreComputer.textContent) + 1;
  };
  const setNamePlayer = (newName) => {
    namePlayer.textContent = newName;
  };
  return { addScorePlayer, addScoreComputer, setNamePlayer };
})();

const gameFlowBoard = (() => {
  const flowBoard = document.querySelector(".controls span");
  const setFlowBoard = (message) => {
    flowBoard.textContent = message;
  };
  return { setFlowBoard };
})();

const playerVsComputer = (playerName) => {
  const computer = Player("Computer");
  computer.setRandomMarker();
  const player = Player(playerName);
  player.setMarker(computer);
  displayController.setNamePlayer(playerName);
  let currPlayer = (Math.random() * 2) >> 0 ? player : computer;
  let playedMoves = [];
  let computerMove = null;
  gameFlowBoard.setFlowBoard(`${currPlayer.getName()}'s turn!`);
  const casesButtons = [];

  const getCurrPlayer = () => {
    return currPlayer;
  };
  const setCurrPlayer = (player) => {
    currPlayer = player;
  };
  const changePlayer = () => {
    if (currPlayer.getName() === "Computer") {
      setCurrPlayer(player);
    } else {
      setCurrPlayer(computer);
    }
  };
  const reset = () => {
    gameBoard.reset();
    changePlayer();
    gameFlowBoard.setFlowBoard(`${currPlayer.getName()}'s turn!`);
    playedMoves = [];
  };

  const computerPlays = () => {
    computerMove = null;
    do {
      computerMove = (Math.random() * 9) >> 0;
      console.log(computerMove);
    } while (playedMoves.includes(computerMove));
    gameBoard.setCase(computerMove, currPlayer);
    playedMoves.push(computerMove);
    changePlayer();
    gameFlowBoard.setFlowBoard(`${currPlayer.getName()}'s turn!`);
  };
  for (let i = 0; i < 9; i++) {
    casesButtons.push(document.querySelector(`#case-${i}`));
    casesButtons[i].addEventListener("click", () => {
      if (!casesButtons[i].classList.contains("case-played")) {
        /*
          A MOVE
        */
        gameBoard.setCase(i, currPlayer);
        playedMoves.push(i);
        /*
          WINNER SCENARIO
        */
        if (gameBoard.isWinner(currPlayer)) {
          gameFlowBoard.setFlowBoard(`Game Over. ${currPlayer.getName()} won!`);
          if (currPlayer.getName() === "Computer") {
            displayController.addScoreComputer();
          } else {
            displayController.addScorePlayer();
          }
          casesButtons.forEach((button) => {
            button.classList.add("case-played");
          });
          setTimeout(() => {
            reset();
          }, 2500);
          /*
          DRAW
        */
        } else if (gameBoard.isDraw()) {
          casesButtons.forEach((button) => {
            button.classList.add("case-played");
          });
          gameFlowBoard.setFlowBoard(`It's a draw!`);
          setTimeout(() => {
            reset();
          }, 2500);
          /* 
          LEGAL MOVE
        */
        } else {
          changePlayer();
          gameFlowBoard.setFlowBoard(`${currPlayer.getName()}'s turn!`);
          setTimeout(() => {
            computerPlays();
          }, 1500);
        }
      }
    });
  }
  return { getCurrPlayer, setCurrPlayer, changePlayer };
};

const Player = (name) => {
  let marker = null;
  const setRandomMarker = () => {
    marker = (Math.random() * 2) >> 0 === 0 ? "O" : "X";
  };
  const setMarker = (player) => {
    marker = player.getMarker() === "X" ? "O" : "X";
  };
  const getMarker = () => {
    return marker;
  };
  const getName = () => {
    return name;
  };
  return { setRandomMarker, setMarker, getMarker, getName };
};

const newGame = playerVsComputer("Anas");
