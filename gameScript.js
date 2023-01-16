// coordinates of the game, used for determining winner
const coords = [["a", 0], ["b", 0], ["c", 0], ["a", 1], ["b", 1], ["c", 1], ["a", 2], ["b", 2], ["c", 2]];

// for indexing X and O with 1 and 0
const players = ["O", "X"]

// for converting button IDs to button number
let buttonIds = ["b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8"]

// who's turn it is. 1 for X, 0 for O
let turn = 1

// who went first in the game
let startTurn = 1

// win tracker
let xWins = 0
let oWins = 0
let catsGames = 0

// each index is the player that has that button number
let gameBoard = [null, null, null, null, null, null, null, null, null]

// counts the number of an item in a list
function countItem(lst, item) {
    let total = 0;
    if (Array.isArray(item)) {
        for (let i of lst) {
            let index = 0;
            let itemIsEqual = true;
            for (let subI of i) {
                if (subI !== item[index]) {
                    itemIsEqual = false;
                }
                index ++;
            }
            if (itemIsEqual) {
                total ++;
            }
        }
    }
    for (let i of lst) {
        if (i === item) {
            total ++;
        }
    }
    return total;
}

// resets the game
function clearBoard() {
    for (let button of buttonIds) {
        document.getElementById(button).textContent = "";
        document.getElementById(button).style.backgroundColor = "#ffffff";
    }
    gameBoard = [null, null, null, null, null, null, null, null, null];
    document.getElementById("xWins").innerHTML = String(xWins);
    document.getElementById("oWins").innerHTML = String(oWins);
    document.getElementById("cWins").innerHTML = String(catsGames);

    document.getElementById("updates").textContent = players[turn] + "'s turn";
}

// check for a win or cats-game
function getGameStatus() {

    // 1 for x, 0 for o, -1 for cats-game
    let winner = null;
    let winningCoords = [null, null, null];

    // coordinates of spaces seperated
    let xSpaces = [];
    let oSpaces = [];

    // button numbers
    let xSpacesNums = [];
    let oSpacesNums = [];

    // populate x and y spaces with column letters and row numbers
    let index = 0;
    for (let i of gameBoard) {
        if (i === null) {
        }
        else if (i === 1) {
            xSpaces.push(coords[index][0]);
            xSpaces.push(coords[index][1]);
            xSpacesNums.push(index);
        }  else {
            oSpaces.push(coords[index][0]);
            oSpaces.push(coords[index][1]);
            oSpacesNums.push(index);
        }
        index ++;
    }

    // count the number of each x and y coordinate in both lists
    xSpaces.sort();
    oSpaces.sort();
    let player = 0;
    for (let side of [oSpaces, xSpaces]) {
        // check for row/column wins
        for (let coordinate of side) {
            if (countItem(side, coordinate) === 3) {

                // check if its a col
                switch (coordinate) {
                    case "a":
                        winningCoords = [buttonIds[0], buttonIds[3], buttonIds[6]];
                        break;
                    case "b":
                        winningCoords = [buttonIds[1], buttonIds[4], buttonIds[7]];
                        break;
                    case "c":
                        winningCoords = [buttonIds[2], buttonIds[5], buttonIds[8]];
                        break;
                    case 0:
                        winningCoords = [buttonIds[0], buttonIds[1], buttonIds[2]];
                        break;
                    case 1:
                        winningCoords = [buttonIds[3], buttonIds[4], buttonIds[5]];
                        document.getElementsByClassName("header").innerHTML = "inside 2"
                        break;
                    case 2:
                        winningCoords = [buttonIds[6], buttonIds[7], buttonIds[8]];
                        break;
                    default:
                        winningCoords = [null, null, null];
                        break;
                }

                // if there is 3 of any one coordinate, declare a winner
                winner = player;
                break;
            }
        }
        player ++;
    }

    // check for diagonal wins
    let xCornerWin1 = xSpacesNums.includes(0) && xSpacesNums.includes(4) && xSpacesNums.includes(8);
    let xCornerWin2 = xSpacesNums.includes(6) && xSpacesNums.includes(4) && xSpacesNums.includes(2);
    let oCornerWin1 = oSpacesNums.includes(0) && oSpacesNums.includes(4) && oSpacesNums.includes(8);
    let oCornerWin2 = oSpacesNums.includes(6) && oSpacesNums.includes(4) && oSpacesNums.includes(2);

    if (xCornerWin1) {
        winningCoords = [buttonIds[0], buttonIds[4], buttonIds[8]];
        winner = 1;
    } else if (xCornerWin2) {
        winningCoords = [buttonIds[6], buttonIds[4], buttonIds[2]];
        winner = 1;
    } else if (oCornerWin1) {
        winningCoords = [buttonIds[0], buttonIds[4], buttonIds[8]];
        winner = 0;
    } else if (oCornerWin2) {
        winningCoords = [buttonIds[6], buttonIds[4], buttonIds[2]];
        winner = 0;
    }

    // check for cats-game
    if (winner === null) {
        let nullCount = 0;
        for (let i of gameBoard) {
            if (i === null) {
                nullCount ++;
            }
        }
        if (nullCount === 0) {
            winner = -1;
        }
    }

    return [winner, winningCoords];
}

// function for button click
function onClick(buttonNum) {

    // check if spot is taken up
    if (gameBoard[buttonNum] !== null) {
        return;
    }

    // update board visual
    document.getElementById(buttonIds[buttonNum]).innerHTML = players[turn];

    // update board internal
    gameBoard[buttonNum] = turn;

    // check for winner
    let win = getGameStatus();

    if (win[0] !== null) {

        // switch the turns
        startTurn = (startTurn*-1) + 1;
        turn = startTurn;

        // show winner
        if (win[0] >= 0) {
            document.getElementById("updates").innerText = players[win[0]] + " wins!";
        } else {
            document.getElementById("updates").textContent = "Cat's Game!";
        }

        // color in winning squares
        if (win[0] >= 0) {
            for (let winSquare of win[1]) {
                document.getElementById(winSquare).style.backgroundColor = "#5c9820";
            }
        } else {
            for (let winSquare of buttonIds) {
                document.getElementById(winSquare).style.backgroundColor = "#5c9820";
            }
        }

        // clear board
        setTimeout(clearBoard, 1500);

        // update
        if (win[0] === 1) {
            xWins ++;
        } else if (win[0] === 0) {
            oWins ++;
        } else {
            catsGames ++;
        }

    } else {

        // switch the turn
        turn = (turn * -1) + 1;
        document.getElementById("updates").textContent = players[turn] + "'s turn";
    }
}
