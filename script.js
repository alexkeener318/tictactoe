const gameSpots = document.getElementsByClassName("block");
const start = document.querySelector("button");
start.addEventListener("click", startGame);
let gameStarted = false;
let reset = false;


// Controls the gameboard
const gameboard = (() => {
    let moves = ["","","","","","","","",""];
    let round = 0;

    const updateBoard = () => {
        for(let i = 0; i < 9; i++){
            gameSpots[i].textContent = moves[i];
        }
    }

    const hasWin = player => {
        // 3 in a row across
       for(let i = 0; i < 7; i+=3){
            const one = i;
            const two = i+1;
            const three = i+2;
            if(player.contains(one) && player.contains(two) &&player.contains(three)){
                console.log("Win across: " + one + " " + two + " " + three + "Ok done");
                return true;
            }
       }
       // 3 in a row down
       for(let i = 0; i < 3; i++){
            const one = i;
            const two = i+3;
            const three = i+6;
            if(player.contains(one) && player.contains(two) &&player.contains(three)){
                console.log("Win down: " + one + " " + two + " " + three + "Ok done");
                return true;
            }
        }    
        // Diagonal edge cases
        if(player.contains("0") && player.contains("4") && player.contains("8")){
            return true;
        }
        if(player.contains("2") && player.contains("4") &&player.contains("6")){
            return true;
        }
        return false;
    }

    const checkStaleMate = () => {
        if(round === 8 && !hasWin(playerOne) && !hasWin(playerTwo)){
            return true;
        } 
        return false;
    }

    return {moves, round, updateBoard, hasWin, checkStaleMate};
})();

// Defines each player
const player = newSymbol => {
    let moves = [];
    const symbol = newSymbol;

    const addMove = move => {
        moves.push(parseInt(move));
    }

    const contains = num => {
        for(let i = 0; i < moves.length; i++){
            if(moves[i] === num){
                return true;
            }
        }
        return false;
    }
    const ohno = () => {
        moves = [];
    }

    const resetMoves = () => {
        console.log(this);
        ohno();
        return this.moves;
    }

    return {moves,symbol, addMove, contains, resetMoves};
}

// Initializes each player
const playerOne = player("X");
const playerTwo = player("O");

// Begins the game
function startGame() {
    if (gameStarted){
        if(reset){
            resetGame();
        }
        return
    }
        
    console.log("Starting Game...");
    start.textContent = "Player X's turn";
    start.classList.add("ingame");
    for(let i = 0; i < 9; i++){
        gameSpots[i].addEventListener("click", playRound.bind(this,gameSpots[i]), false);
    }
    gameStarted = true;
}

// Controls what happens during each round
function playRound(block) {
    console.log("Playing round");
    const coord = block.getAttribute("id");

    // Makes sure each block can only be changed once
    if(gameboard.moves[coord] !== "")
        return;   

    // Determines whose turn it is, and adds appropriate symbol
    if(gameboard.round % 2){
        gameboard.moves[parseInt(coord)] = playerTwo.symbol;
        playerTwo.addMove(coord);
        start.textContent = "Player X's turn";
    }else{ 
        playerOne.addMove(coord);
        gameboard.moves[parseInt(coord)] = playerOne.symbol;
        start.textContent = "Player O's turn";
    }
    
    // Updates gameboard
    gameboard.updateBoard();
    gameboard.round++;
    updateBlock(block);
    
    // Determines if someone has won
    const winOne = gameboard.hasWin(playerOne);
    const winTwo = gameboard.hasWin(playerTwo);
    const noWinner = gameboard.checkStaleMate();
    if(winOne){
        winner(playerOne);
    }
    else if(winTwo){
        winner(playerTwo);
    }
    else if(noWinner){
        staleMate();
    }
}

function updateBlock(block) {
    block.classList.add("ingame");
}

function winner(player){
    start.textContent = "Congrats! Player " + player.symbol + " won!!!!";
    for(let i = 0; i < 9; i++){
        gameSpots[i].classList.add("ingame");
        gameboard.moves[i] = " ";
    }
    setTimeout(restart, 3000);
}

function staleMate() {
    start.textContent = "No one won this time :(((";
    setTimeout(restart, 3000);
    for(let i = 0; i < 9; i++){
        gameSpots[i].classList.add("ingame");
        gameboard.moves[i] = " ";
    }
}

function restart() {
    start.classList.remove("ingame");
    start.textContent = "Restart";
    reset = true;
}

function resetGame(){
    for(let i = 0; i < 9; i++){
        gameboard.moves[i] = "";
        gameSpots[i].classList.remove("ingame");
    }
    playerOne.resetMoves();
    playerTwo.resetMoves();
    gameboard.round = 0;

    gameboard.updateBoard();
}