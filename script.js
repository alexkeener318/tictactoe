const gameSpots = document.getElementsByClassName("block");
const start = document.querySelector("button");
start.addEventListener("click", startGame);


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
       for(let i = 0; i < 7; i+=2){
            const one = i;
            const two = i+1;
            const three = i+2;
            if(player.contains(one) && player.contains(two) &&player.contains(three)){
                return true;
            }
       }
       // 3 in a row down
       for(let i = 0; i < 3; i++){
            const one = i;
            const two = i+3;
            const three = i+6;
            if(player.contains(one) && player.contains(two) &&player.contains(three)){
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
        if(round === 9 && !hasWin(playerOne) && !hasWin(playerTwo)){
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

    return {moves,symbol, addMove, contains};
}

// Initializes each player
const playerOne = player("X");
const playerTwo = player("O");

// Begins the game
function startGame() {
    console.log("Starting Game...");
    for(let i = 0; i < 9; i++){
        gameSpots[i].addEventListener("click", playRound.bind(this,gameSpots[i]), false);
    }
}

// Controls what happens during each round
function playRound(block) {
    console.log("Playing round");
    const coord = block.getAttribute("id");

    // Makes sure each block can only be changed once
    for(let i = 0; i < 9; i++){
        if(gameboard.moves[i] !== "")
            return;
    }     

    // Determines whose turn it is, and adds appropriate symbol
    if(gameboard.round % 2){
        console.log("Adding move to player 2");
        gameboard.moves[parseInt(coord)] = playerTwo.symbol;
        playerTwo.addMove(coord);
    }else{ 
        console.log("Adding move to player 1");
        playerOne.addMove(coord);
        gameboard.moves[parseInt(coord)] = playerOne.symbol;
    }
    
    // Updates gameboard
    gameboard.updateBoard();
    gameboard.round++;
    updateBlock(block);
    
    // Determines if someone has won
    const winOne = gameboard.hasWin(playerOne);
    const winTwo = gameboard.hasWin(playerTwo);
    gameboard.checkStaleMate();
    if(winOne || winTwo){
        console.log("OMG SOMEONE WON WOW");
        return true;
    }
    return false;
}

function updateBlock(block) {
    block.classList.add("ingame");
}
