/*
 ==============
 GAME BOARD MODULE
 ==============
*/

let gameBoard = (() => {
    let boardArray = [["_", "_", "_"], ["_", "_", "_"], ["_", "_", "_"]];

    let setCase = (action, player) => {
        let marker = player.getMarker();
        let i = (action / 3) >> 0;
        let j = action % 3;
        if (boardArray[i][j] === "_") {
            boardArray[i][j] = marker;
        }
    }

    let reset = () => {
        boardArray = [["_", "_", "_"], ["_", "_", "_"], ["_", "_", "_"]];
    }

    let sync = () => {
        let allCells = Array.from(document.querySelectorAll('.cell'));
        allCells.forEach((cell) => {
            let k = allCells.indexOf(cell);
            let i = (k / 3) >> 0;
            let j = k % 3;
            cell.innerHTML = `<p>${(boardArray[i][j] === "_") ? " " : boardArray[i][j]}</p>`;
        })
    }
    let checkWin = (player) => {
        let marker = player.getMarker();
        let markerCombo = [marker, marker, marker];
        let playerWins = false;
        let allCombos = [];
        for (let i = 0; i < 3; i++) {
            allCombos.push([boardArray[i][0], boardArray[i][1], boardArray[i][2]]);
        }
        for (let j = 0; j < 3; j++) {
            allCombos.push([boardArray[0][j], boardArray[1][j], boardArray[2][j]]);
        }
        allCombos.push([boardArray[0][0], boardArray[1][1], boardArray[2][2]]);
        allCombos.push([boardArray[2][0], boardArray[1][1], boardArray[0][2]]);
        allCombos.forEach((combo) => {
            if (JSON.stringify(combo) === JSON.stringify(markerCombo)) {
                playerWins = true;
            }
        })
        return playerWins;
    }

    let isDraw = () => {
        let draw = true;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (boardArray[i][j] === "_") {
                    draw = false;
                    break;
                }
            }
        }
        return draw;
    }
    return {setCase, checkWin, sync, reset, isDraw};
})
();

let messagesBoard = (() => {
    let board = document.querySelector('.messages span');
    let set = (text) => {
        board.innerHTML = text;
    }
    return {set}
})();

let scoreboard = (() => {
    let player1 = null;
    let player2 = null;
    let player1name = document.querySelector('.player-1');
    let player2name = document.querySelector('.player-2');
    let score1 = document.querySelector('.score-1');
    let score2 = document.querySelector('.score-2');
    let setPlayers = (playerA, playerB) => {
        player1 = playerA;
        player2 = playerB;
        player1name.innerHTML = player1.getName();
        player2name.innerHTML = player2.getName();
    }

    let sync = () => {
        score1.innerHTML = player1.getScore();
        score2.innerHTML = player2.getScore();
    }
    return {setPlayers, sync};
})();

let Player = (name) => {
    let marker = "";
    let score = 0;
    let getScore = () => {
        return score;
    }
    let addScore = () => {
        score++;
    }
    let setMarker = (markerXO) => {
        marker = markerXO;
    }
    let getMarker = () => {
        return marker;
    }
    let getName = () => {
        return name;
    }
    return {setMarker, getMarker, getName, getScore, addScore};
}

let gameplay = (() => {
    let player1 = Player("Player 1");
    player1.setMarker("X");
    let player2 = Player("Player 2");
    player2.setMarker("O");
    let currentPlayer = player1;
    let allCells = document.querySelectorAll('.cell');
    let launch = () => {
    allCells.forEach((cell) => {
        cell.addEventListener("click", (e) => {
            console.log(e.target);
            let k = e.target.id;
            gameBoard.setCase(k, currentPlayer);
            gameBoard.sync();
            if (gameBoard.checkWin(currentPlayer)) {
                currentPlayer.addScore();
                messagesBoard.set(`${currentPlayer.getName()} has won!`);
                setTimeout(() => {
                    gameBoard.reset();
                    gameBoard.sync();
                    scoreboard.sync();
                    changeCurrentPlayer();
                    messagesBoard.set(`${currentPlayer.getName()}'s turn`);
                }, 1500);

            } else if (gameBoard.isDraw()) {
                messagesBoard.set(`It's a draw!`);
                setTimeout(() => {
                    gameBoard.reset();
                    gameBoard.sync();
                    changeCurrentPlayer();
                    messagesBoard.set(`${currentPlayer.getName()}'s turn`);
                }, 1500);
            } else {
                gameBoard.sync();
                changeCurrentPlayer();
                messagesBoard.set(`${currentPlayer.getName()}'s turn`);
            }
        })
    })}
    let start = () => {
        gameBoard.sync();
        scoreboard.setPlayers(player1, player2);
        setTimeout(() => {messagesBoard.set(`${currentPlayer.getName()}'s turn`);         launch();
        }, 1500);

    }
    let changeCurrentPlayer = () => {
        currentPlayer = (currentPlayer.getName() === player2.getName()) ? player1 : player2;
    }
    return {start};
})();

gameplay.start();
