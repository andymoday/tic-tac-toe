//hosts the gameboard information at all times
const gameBoardModule = (function(){
    let gameArray = ['','','','','','','','',''];
    getGameArray: function getGameArray(){
        return gameArray;
    }
    setGameArray: function setGameArray(i,mark){
        gameArray[i] = mark;
        return gameArray;
    }  
    return {getGameArray, 
            setGameArray, 
            }
})();
//Factory function for players, with getter and setter
const Player = (name, mark) => {
    let playerName = name;
    let playerMark = mark;
    const getName  = () => playerName;
    const getMark = () => playerMark;
    return {getName,
            getMark,
            set name(newName) {
                playerName = newName;
            }
    }
}
//all other game events controlled here

let displayControllerModule = (function() {
    //array of the html button elements
    const buttons = Array.from(document.getElementsByClassName('square'));
    let winnerForm = document.getElementById("myWinnerForm");
    let winnerMSG = document.getElementById("winner-message");
    let playerOne = Player('Player One', 'X')
    let playerTwo = Player('Player Two', 'O')
    let player = playerOne;
    let mode;
    //fired by mode buttons. Sets one player or two player, prompts for player names, starts game
    setMode: function setMode(button) {
        //clears previous gameboard if halfway through when mode button is clicked
        reset();
        mode = button;
        let P1 = prompt('Please enter player one name');
        playerOne.name = P1
        document.getElementById('player-one-name').textContent = P1
        if (mode === '1P') {
            document.getElementById('player-two-name').textContent = 'Computer'
            playerTwo.name = 'Computer'
        } else {
            let P2 = prompt('Please enter player two name');
            playerTwo.name = P2
            document.getElementById('player-two-name').textContent = P2
        }
        playGame();
    } 
    playGame: function playGame() { 
        //catch for any event listeners that haven't switched off
        buttons.forEach(button => {
            button.removeEventListener('click', mouseEventHandler)
          })  
        buttons.forEach(button => {
            button.addEventListener('click', mouseEventHandler)
        })
    }    
    mouseEventHandler: function mouseEventHandler({target})  { 
        //curent state of the board
        let gameArray = gameBoardModule.getGameArray()
        if (target.className === 'square') {        
            if (gameArray[target.id -1] === '') {
                gameBoardModule.setGameArray([target.id -1],player.getMark());
                render();    
                //fetch updated game board    
                gameArray = gameBoardModule.getGameArray() 
                let result = getResult(gameArray)
                //checks for winning combinations
                if (result !== 'incomplete'){
                    endGame(result);
                    return;
                } else {
                    //if no winning combos, instigate next turn
                    if (mode === '1P') {
                        computerPlay()
                    } else {
                        player = switchPlayer();
                        playGame()
                    }
                }
                //if player clicks on a square that has already been taken, fire a repeat move
            } else {
                playGame()}
        }
    }    
    endGame: function endGame(result) {
        winnerForm.style.display = "block";
        if (result === 'tie') {
            winnerMSG.textContent =  'Tie!'
        } else {
            let winner;
            if (result === 'X win') {
                winner = playerOne.getName();
            } else {
                winner = playerTwo.getName();
            }
            winnerMSG.textContent =  winner + ' is the winner!'     
        }
        return
    }
    //fired to switch the player name between turns
    switchPlayer: function switchPlayer() {
        return (player === playerOne) ? playerTwo : playerOne;
    }
    //fired on close form and on mode button click
    reset: function reset() {   
        for (let i = 0; i < 9; i++) {
            gameBoardModule.setGameArray(i,'');
        }
        player = playerOne;
        render();
    } 
    render: function render() {
        gameBoardModule.getGameArray().forEach(function (element,i) {
            buttons[i].textContent = element;
        });
    } 
    //computer version of mouseEventHandler
    computerPlay: function computerPlay() {
        player = playerTwo
        let gameArray = gameBoardModule.getGameArray()         
        let compChoice;
        compChoice = computeChoice(gameArray);
        gameBoardModule.setGameArray([compChoice],player.getMark());
        render();        
        gameArray = gameBoardModule.getGameArray() 
        if (getResult(gameArray) !== 'incomplete'){
            endGame(getResult(gameArray));
            return
        }
        player = switchPlayer();
        playGame();                  
    }
    //selects which move the computer will play
    computeChoice: function computeChoice(array){
        //avoid mutations
        let curGamArr = array.slice();
        //computers play token
        let marker = 'O';
        function move(marker,arr) {
            //each function call to move() is for a round of the play, switching opponents recursively
            let availableMoves = 0;
            let winlist = [];
            let loselist = [];
            let unsolved = [];
            const countOccurrences = (array, val) => array.reduce((a, v) => (v === val ? a + 1 : a), 0);
            if (countOccurrences(arr,'') === 1) {
                //no moves left, so return the only move available
                return arr.indexOf('');
            }
            //for current board and this round
            //try each move in turn
            //INTO LOOP
            for (let i = 0; i < 9; i++) {
                //avoid mutations
                let testArray = arr.slice();
                //if a position is unavailable, ignore
                if (testArray[i] === '') {
                    //catalogue number of available moves 
                    availableMoves +=1;
                    //add computers play marker to the array in position i
                    testArray[i] = marker;
                //if a move wins, add to a list and return random integer from list of wins  
                if (getResult(testArray) === 'O win') {
                        (marker === 'O')? winlist.push(i):loselist.push(i)
                    //if a move loses discard unless they all lose, then pick random integer from list of losing options
                    } else if (getResult(testArray) === 'X win') {
                        (marker === 'O')? loselist.push(i):winlist.push(i);
                    //if a move is undetermined, recall the function on the board containing that move, and play the 
                    } else {
                        unsolved.push(i);
                    }
                    //each layer furthe into the game, the opponent switches, so we switch the logic of wins/losses
                    //when only one place to go, report that position back up 
                }
            }
            //OUT OF LOOP
            //if there is a winning move, choose it randomly and pass it up
            if (winlist.length > 0) {
                return winlist[Math.floor(Math.random()*Math.floor(winlist.length))];
            }
            //else look for a losing move
            if (loselist.length === availableMoves) {
                return loselist[Math.floor(Math.random()*Math.floor(loselist.length))];
            }
            //otherwise look recursively at the unsolved moves
            else {
                let otherList = []
                for (let i = 0; i< unsolved.length; i++) {
                    //avoid mutations
                    let tArr = arr.slice();
                    //this is putting on of the unsolved squares as the computer's play this round
                    tArr[unsolved[i]] = marker;
                    //making list of possible moves by recursively testing on each possible array(changing player marker for recursion)
                    otherList.push(move((marker === 'O')? 'X':'O',tArr))
                }
                return otherList[Math.floor(Math.random()*Math.floor(otherList.length))];
            }
        }
    
        return move(marker,curGamArr)//needs to be integer
    }
    //checks for win/lose combinations
    getResult: function getResult(gameArray) {
        if ((gameArray[0] !== '' && gameArray[0] === 'X' && (gameArray[0] === gameArray[1] && gameArray[1] === gameArray[2])) ||
            (gameArray[3] !== '' && gameArray[3] === 'X' && (gameArray[3] === gameArray[4] && gameArray[4] === gameArray[5])) ||
            (gameArray[6] !== '' && gameArray[6] === 'X' && (gameArray[6] === gameArray[7] && gameArray[7] === gameArray[8])) ||
            (gameArray[0] !== '' && gameArray[0] === 'X' && (gameArray[0] === gameArray[3] && gameArray[3] === gameArray[6])) ||
            (gameArray[1] !== '' && gameArray[1] === 'X' && (gameArray[1] === gameArray[4] && gameArray[4] === gameArray[7])) ||
            (gameArray[2] !== '' && gameArray[2] === 'X' && (gameArray[2] === gameArray[5] && gameArray[5] === gameArray[8])) ||
            (gameArray[0] !== '' && gameArray[0] === 'X' && (gameArray[0] === gameArray[4] && gameArray[4] === gameArray[8])) ||
            (gameArray[2] !== '' && gameArray[2] === 'X' && (gameArray[2] === gameArray[4] && gameArray[4] === gameArray[6])) ) {
            return 'X win';
        }
        else if ((gameArray[0] !== '' && gameArray[0] === 'O' && (gameArray[0] === gameArray[1] && gameArray[1] === gameArray[2])) ||
            (gameArray[3] !== '' && gameArray[3] === 'O' && (gameArray[3] === gameArray[4] && gameArray[4] === gameArray[5])) ||
            (gameArray[6] !== '' && gameArray[6] === 'O' && (gameArray[6] === gameArray[7] && gameArray[7] === gameArray[8])) ||
            (gameArray[0] !== '' && gameArray[0] === 'O' && (gameArray[0] === gameArray[3] && gameArray[3] === gameArray[6])) ||
            (gameArray[1] !== '' && gameArray[1] === 'O' && (gameArray[1] === gameArray[4] && gameArray[4] === gameArray[7])) ||
            (gameArray[2] !== '' && gameArray[2] === 'O' && (gameArray[2] === gameArray[5] && gameArray[5] === gameArray[8])) ||
            (gameArray[0] !== '' && gameArray[0] === 'O' && (gameArray[0] === gameArray[4] && gameArray[4] === gameArray[8])) ||
            (gameArray[2] !== '' && gameArray[2] === 'O' && (gameArray[2] === gameArray[4] && gameArray[4] === gameArray[6])) ) {
            return 'O win';
        } else if ((gameArray.includes('')) === false) {
            return 'tie';
        } else {
            return 'incomplete';
        }
    }
    closeWinnerForm: function closeWinnerForm() {
        winnerForm.style.display = "none";
        playGame();
        reset();
        } 

    return {setMode,
            closeWinnerForm
            }
})();





