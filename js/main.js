

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



// let playerOne = Player("Bryny","X");
// let playerTwo = Player("Charlotte","O");

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

    const isWinner = function() {
        return winner;
    }
    const isTie = function() {
        return tie;
    }
    const getCurrentPlayer = function() {
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
           if(checkWinCondition(row,col)){
            console.log(`Congratulations ${currentPlayer.getPlayerName()}, You Won!`);
            winner = currentPlayer;
           }
           if(roundCount > 8){
            tie = true;
           }
            changeCurrentPlayer();
            return true;
        }
        return false;
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
    return { resetGame, playRound, gameStatus,isWinner,isTie,getCurrentPlayer};


});


const DisplayController = (() => {
    let playerOne;
    let game;
    const gridSpots = document.querySelectorAll('.gridSpot');
    const container = document.querySelector('.container');
    const modal = document.querySelector('.modal');
    const beginGame = document.querySelector('#beginGame');
    const playerOneName = document.querySelector('#playerOneNameInput');
    const playerOneSymbol = document.querySelector('#playerOneSymbolInput');
    const playerTwoName = document.querySelector('#playerTwoNameInput');
    const playerTwoSymbol = document.querySelector('#playerTwoSymbolInput');




    beginGame.addEventListener("click",(e) => {
        startNewGame();
    })


    let playing = false;



    const newGameMenu = function(){
        modal["style"]["display"]= "flex";
        // console.log("Player One Name: " + playerOneName.value + " Player One Symbol: " +  playerOneSymbol.textContent  + " Player Two Name: " + playerTwoName.textContent +  " Player Two Name: " + playerTwoSymbol.textContent );

        //  startNewGame();
    }

    const startNewGame = function() {
        modal["style"]["display"]= "none";
        console.log("Player One Name: " + playerOneName.value + " Player One Symbol: " +  playerOneSymbol.value  + " Player Two Name: " + playerTwoName.value +  " Player Two Name: " + playerTwoSymbol.value );
        
        playerOne = Player(playerName,playerSymbol);
        game = gameController(playerOne,Player("Player Two", "O"));
        game.resetGame();
        playing = true;


    }

    //link grid etc.
    const initGameDisplay = function(){
        let startButton = document.querySelector('.newGameButton');
        startButton.addEventListener("click",(e)=>{
            newGameMenu();
        });

        gridSpots.forEach(element => {
            element.addEventListener("click",(e)=>{
                console.log(`You clicked me Row: ${e.target.dataset.row} , Col: ${e.target.dataset.col}`);
                if(playing){
                    makeMove(e.target.dataset.row,e.target.dataset.col,e.target);
                }
            });
        });
    }
     initGameDisplay();



    const makeMove = function(row,col,element){

        let currentPlayer = game.getCurrentPlayer();
        if(game.playRound(row,col)){
            //Update Display for good move
            element.textContent = currentPlayer.getPlayerSymbol();

            //then check win condition
            if(game.isWinner() !== ""){
                playing = false;
                alert(currentPlayer.getPlayerName() + " WINS THE GAME!");
                startNewGame();
            }
            if(game.isTie()){
                playing = false;
                alert("TIE!!!!!!!");
                startNewGame();
            }
        }else{
            //Update Display for incorret move
            alert("BAD MOVE IDIOT");
        }
    }

    newGameMenu();
    return({startNewGame,makeMove});



})();



// gameController.playRound(1,1);
// gameController.gameStatus();
// gameController.playRound(1,1);
