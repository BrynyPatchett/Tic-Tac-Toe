

const board = (function () {
    const board = [];
    const row = 3;
    const col = 3;

    for (let i = 0; i < row; i++) {
        board[i] = [];
        for (let j = 0; j < row; j++) {
            board[i].push(gridSpot());
        }
    }

    const getBoard = function () {
        return board;
    }

    const makeMove = function (row, col, player) {
        console.log(`making move at ${row} : ${col}`);

        if (board[row][col].getSpotOwner() !== "") {
            console.log("Invalid Turn");
            return false;
        }
        board[row][col].setSpotOwner(player.getPlayerName());
        board[row][col].setSpotSymbol(player.getPlayerSymbol());

        return true;

    }

    const clearBoard = function () {
        for (let i = 0; i < row; i++) {
            board[i] = [];
            for (let j = 0; j < row; j++) {
                board[i].push(gridSpot());
            }
        }
    }


    const getRowTiles = function (row) {
        return board[row];
    }
    const getColTiles = function (col) {
        return [board[0][col], board[1][col], board[2][col]];
    }
    const getDiagonalTopTiles = function (col) {
        return [board[0][0], board[1][1], board[2][2]];
    }
    const getDiagonalBottomTiles = function (col) {
        return [board[2][0], board[1][1], board[0][2]];
    }


    const printBoard = function () {
        console.table(board.map((row) => row.map((cell) => cell.getSpotSymbol())));
    }
    return { getBoard, makeMove, printBoard, clearBoard, getRowTiles, getColTiles, getDiagonalTopTiles, getDiagonalBottomTiles };
})();

function gridSpot(owner = "", symbol = " ") {

    const getSpotOwner = function () {
        return owner;
    };
    const getSpotSymbol = function () {
        return symbol;
    };
    const setSpotOwner = function (player) {
        owner = player;
    };
    const setSpotSymbol = function (playerSymbol) {
        symbol = playerSymbol;
    };

    return { getSpotOwner, getSpotSymbol, setSpotOwner, setSpotSymbol };
}


const Player = function (name, symbol) {

    const getPlayerName = () => {
        return name;
    }
    const getPlayerSymbol = () => {
        return symbol;
    }
    return { getPlayerName, getPlayerSymbol };
}



const gameController = ((playerOne = Player("PlayerOne", "X"), playerTwo = Player("PlayerTwo", "O")) => {

    const players = [playerOne, playerTwo];

    const gameBoard = board;
    let playerIndex = 0;
    let currentPlayer = players[playerIndex];
    let winner = "";
    let tie = false;
    let roundCount = 0;


    const resetGame = function () {
        gameBoard.clearBoard();
    }

    const isWinner = function () {
        return winner;
    }
    const isTie = function () {
        return tie;
    }
    const getCurrentPlayer = function () {
        return currentPlayer;
    }

    const gameStatus = function () {
        console.log(`${currentPlayer.getPlayerName()}'s turn.`);
        gameBoard.printBoard();
    }

    const playRound = function (row, col) {
        console.log(`Playing Round on ${currentPlayer.getPlayerName()}'s turn`);
        if (board.makeMove(row, col, currentPlayer) === true) {
            gameStatus();
            let won = false;
            roundCount++;
            /*Check win condition */
            if (checkWinCondition(row, col)) {
                console.log(`Congratulations ${currentPlayer.getPlayerName()}, You Won!`);
                winner = currentPlayer;
            }
            if (roundCount > 8) {
                tie = true;
            }
            changeCurrentPlayer();
            return true;
        }
        return false;
    }

    const checkBoardEntries = function (tiles, player) {
        for (i = 0; i < tiles.length; i++) {
            if (tiles[i].getSpotSymbol() != player.getPlayerSymbol()) {
                return false;
            }
        }
        return true;

    }

    const checkWinCondition = function (row, col) {
        if (checkBoardEntries(gameBoard.getRowTiles(row), currentPlayer)) {
            return true;
        }
        if (checkBoardEntries(gameBoard.getDiagonalBottomTiles(), currentPlayer)) {
            return true;
        }
        if (checkBoardEntries(gameBoard.getDiagonalTopTiles(), currentPlayer)) {
            return true;
        }
        if (checkBoardEntries(gameBoard.getColTiles(col), currentPlayer)) {
            return true;
        }
        return false;
    }

    const changeCurrentPlayer = function () {
        currentPlayer = players[(++playerIndex) % 2];
    }

    gameStatus();
    return { resetGame, playRound, gameStatus, isWinner, isTie, getCurrentPlayer };


});


const DisplayController = (() => {
    let playerOne;
    let game;
    const gridSpots = document.querySelectorAll('.gridSpot');
    const modal = document.querySelector('.modal');
    const startButton = document.querySelector('.newGameButton');
    const playerOneNameInput = document.querySelector('#playerOneNameInput');
    const playerOneSymbolInput = document.querySelector('#playerOneSymbolInput');
    const playerTwoNameInput = document.querySelector('#playerTwoNameInput');
    const playerTwoSymbolInput = document.querySelector('#playerTwoSymbolInput');
    const gameStarter = document.querySelector('form');
    const endGameModal = document.querySelector('#endGame');
    const playAgainButton = endGameModal.querySelector('button');
    const endMessage = endGameModal.querySelector('#endMessage');





    let playerOneName = "Player One";
    let playerTwoName = "Player Two";
    let playerOneSymbol = "X";
    let playerTwoSymbol = "O";



    let playing = false;

    const clearGameBoard = function () {
        gridSpots.forEach(gridSpot => {
            gridSpot.textContent = "";
        })
    }

    const updateModalTextFields = function () {
        playerOneNameInput.value = playerOneName;
        playerOneSymbolInput.value =playerOneSymbol
        playerTwoNameInput.value = playerTwoName
        playerTwoSymbolInput.value = playerTwoSymbol
    }


    const newGameMenu = function () {
        updateModalTextFields();
        modal["style"]["display"] = "flex";
    }

    const startNewGame = function () {
        //clear board if not the first time playing
        clearGameBoard();


        playerOneName = playerOneNameInput.value;
        playerOneSymbol = playerOneSymbolInput.value;
        playerTwoName = playerTwoNameInput.value;
        playerTwoSymbol = playerTwoSymbolInput.value;

        if(playerOneSymbol == playerTwoSymbol){
            alert("Please use different Symbols for each player");
            return;
        }

        playerOne = Player(playerOneName, playerOneSymbol);
        playerTwo = Player(playerTwoName, playerTwoSymbol);

        modal["style"]["display"] = "none";

        game = gameController(playerOne, playerTwo);
        game.resetGame();
        playing = true;
    }

    const displayEndGameMessage = function (message){
        endMessage.textContent = message;
        endGameModal["style"]["display"] = "flex";
    }

    //link grid etc.
    const initGameDisplay = (function () {


        playAgainButton.addEventListener("click", (e) =>{
            endGameModal["style"]["display"] = "none";
            newGameMenu();
        })

        gameStarter.addEventListener("submit", (e) => {
            e.preventDefault();
            startNewGame();
        })

        startButton.addEventListener("click", (e) => {
            newGameMenu();
        });



        gridSpots.forEach(element => {
            element.addEventListener("click", (e) => {
                console.log(`You clicked me Row: ${e.target.dataset.row} , Col: ${e.target.dataset.col}`);
                if (playing) {
                    makeMove(e.target.dataset.row, e.target.dataset.col, e.target);
                }
            });
        });
    })();



    const makeMove = function (row, col, element) {

        let currentPlayer = game.getCurrentPlayer();
        if (game.playRound(row, col)) {
            //Update Display for good move
            element.textContent = currentPlayer.getPlayerSymbol();

            //then check win condition
            if (game.isWinner() !== "") {
                playing = false;
                displayEndGameMessage(`Congratulations ${currentPlayer.getPlayerName()}, you Won!`);
                return;
            }
            if (game.isTie()) {
                playing = false;
                displayEndGameMessage(`Game is a tie!`);
                return;
            }
        }
    }

    newGameMenu();
    return ({ startNewGame, makeMove });



})();

