

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


    const getRowTiles = function(row){
        return board[row];
    }
    const getColTiles = function(col){
        return [board[0][col],board[1][col],board[2][col]];
    }
    const getDiagonalTopTiles = function(col){
        return [board[0][0],board[1][1],board[2][2]];
    }
    const getDiagonalBottomTiles = function(col){
        return [board[2][0],board[1][1],board[0][2]];
    }
    

    const printBoard = function () {
        console.table(board.map((row) => row.map((cell) => cell.getSpotSymbol())));
    }
    return { getBoard, makeMove, printBoard, clearBoard,getRowTiles,getColTiles,getDiagonalTopTiles,getDiagonalBottomTiles};
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



let playerOne = Player("Bryny","X");
let playerTwo = Player("Charlotte","O");

const gameController = ((playerOne = Player("PlayerOne", "X"), playerTwo = Player("PlayerTwo", "O")) => {

    const players = [playerOne, playerTwo];

    const gameBoard = board;
    let playerIndex = 0;
    let currentPlayer = players[playerIndex];


    const resetGame = function () {
        gameBoard.clearBoard();
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
            /*Check win condition */
           if(checkWinCondition(row,col)){
            console.log(`Congratulations ${currentPlayer.getPlayerName()}, You Won!`);
           }
            changeCurrentPlayer();
        }

    }

    const checkBoardEntries = function(tiles,player){
        for(i = 0; i < tiles.length; i++){
            if(tiles[i].getSpotSymbol() != player.getPlayerSymbol()){
                return false;
            }
        }
        return true;

    }

    const checkWinCondition = function(row,col){
        if(checkBoardEntries(gameBoard.getRowTiles(row),currentPlayer)){
            return true;
        }
        if(checkBoardEntries(gameBoard.getDiagonalBottomTiles(),currentPlayer)){
            return true;
        }
        if(checkBoardEntries(gameBoard.getDiagonalTopTiles(),currentPlayer)){
            return true;
        }
        if(checkBoardEntries(gameBoard.getColTiles(col),currentPlayer)){
            return true;
        }
        return false;
    }

    const changeCurrentPlayer = function () {
        currentPlayer = players[(++playerIndex) % 2];
    }

    gameStatus();
    return { resetGame, playRound, gameStatus };


})(playerOne, playerTwo);



// gameController.playRound(1,1);
// gameController.gameStatus();
// gameController.playRound(1,1);
