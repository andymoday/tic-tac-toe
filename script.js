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

let displayControllerModule = (function() {
    //array of the html button elements
    const buttons = Array.from(document.getElementsByClassName('square'));
    let playerOne = Player('Player One', 'X')
    let playerTwo = Player('Player Two', 'O')
    let player = playerOne;
    setMode: function setMode(button) {
        mode = button;
    } 
    playGame: function playGame() {
        for (let i = 0; i < 9; i++) {
            gameBoardModule.setGameArray(i,'');
        }
        render();
        playerOne.name = prompt('Please enter player one name');
        if (mode === '1P') {
            playerTwo.name = 'Computer'
        } else {
            playerTwo.name = prompt('Please enter player two name'); 
        }
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                playMove(button.id)    
            })       
        }) 
    }
    playMove: function playMove(buttonID) {   
        if (mode === '1P') {
            player = playerOne;
          }  //comment out for multiplayer
        let gameArray = gameBoardModule.getGameArray()         
        if (gameArray[buttonID -1] === '') {
            gameBoardModule.setGameArray([buttonID -1],player.getMark());
            render();        
            gameArray = gameBoardModule.getGameArray() 
            console.log(gameArray[0],gameArray[1],gameArray[2],
                gameArray[3], gameArray[4],gameArray[5],gameArray[6],gameArray[7],gameArray[8],
                getResult(gameArray))
            if (getResult(gameArray) !== 'incomplete'){
                endGame(getResult(gameArray));
            } else {
                if (mode === '1P') {
                    computerPlay()
                } else {
                    player = switchPlayer();
                }
            }
        }
    } 
    endGame: function endGame(result) {
        if (result === 'tie') {
            alert('Tie!!');
            reset();
        } else {
            let winner;
            if (result === 'X win') {
                winner = playerOne.getName();
            } else {
                winner = playerTwo.getName();
            }
            alert(winner + ' is the winner!');
            reset();
        }
    }
    switchPlayer: function switchPlayer() {
        return (player === playerOne) ? playerTwo : playerOne;

    }
    reset: function reset(level) {    
        for (let i = 0; i < 9; i++) {
            gameBoardModule.setGameArray(i,'');
        }
        render();
        player = playerOne;
        playMove();
    } 
    render: function render() {
        gameBoardModule.getGameArray().forEach(function (element,i) {
            buttons[i].textContent = element;
        });
    } 
    computerPlay: function computerPlay() {
        player = playerTwo
        let gameArray = gameBoardModule.getGameArray()         
        let compChoice;
        //if ((gameArray.includes('')) === false) {
        //    endGame('tie')
        //}
        //while (gameArray[compChoice] !== '') {
        //    compChoice = Math.floor(Math.random()*Math.floor(8)); 
        //}
        compChoice = computeChoice(gameArray);
        gameBoardModule.setGameArray([compChoice],player.getMark());
        render();        
        gameArray = gameBoardModule.getGameArray() 
        if (getResult(gameArray) !== 'incomplete'){
            endGame(getResult(gameArray));
        }
        player = switchPlayer();               
        
    }
    computeChoice: function computeChoice(array){
        let curGamArr = array.slice();
        let marker = 'O';
        function move(marker,arr) {
            let availableMoves = 0;
            let winlist = [];
            let loselist = [];
            let unsolved = [];
            const countOccurrences = (array, val) => array.reduce((a, v) => (v === val ? a + 1 : a), 0);
            if (countOccurrences(arr,'') === 1) {
                //console.log('no moves left')
                return arr.indexOf('');
            }
            //for current board
            //try each move in turn
            //INTO LOOP
            for (let i = 0; i < 9; i++) {
                let testArray = arr.slice();
                //if a position is unavailable, ignore
                if (testArray[i] === '') {
                    availableMoves +=1;
                    testArray[i] = marker;
            //if a move wins, add to a list and return random integer from list of wins
                //console.log(testArray)    
                if (getResult(testArray) === 'O win') {
                        //console.log('AA')
                        (marker === 'O')? winlist.push(i):loselist.push(i)
                    } else if (getResult(testArray) === 'X win') {
                        //console.log('BB')
                        (marker === 'O')? loselist.push(i):winlist.push(i);
                    } else {
                        //console.log('CC')
                        unsolved.push(i);
                    }
                }
            //if a move loses discard unless they all lose, then pick random integer from list of losing options
            //if a move is undetermined, recall the function on the board containing that move, and play the 
            //opponents moves one at a time. switch the logic of wins/losses
            //when only one place to go, report that position back up 
            }
            //console.log(winlist, loselist,loselist.length)
            //OUT OF LOOP
            if (winlist.length > 0) {
                //console.log('gettinghere1')
                return winlist[Math.floor(Math.random()*Math.floor(winlist.length))];
            }
            if (loselist.length === availableMoves) {
                //console.log('gettinghere2')
                return loselist[Math.floor(Math.random()*Math.floor(loselist.length))];
            }
            else {
                //console.log('gettinghere3')
                let otherList = []
                for (let i = 0; i< unsolved.length; i++) {
                    tArr = arr.slice();
                    tArr[unsolved[i]] = marker;
                    //console.log(unsolved[i],tArr)
                    otherList.push(move((marker === 'O')? 'X':'O',tArr))
                }
                return otherList[Math.floor(Math.random()*Math.floor(otherList.length))];
            }
        }
    
        return move(marker,curGamArr)//needs to be integer
    }
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



    return {playGame,
            reset,
            setMode
            }
})();

let mode;
let modeButtons = document.querySelectorAll('button.mode');
modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
    displayControllerModule.setMode(button.id)
    displayControllerModule.playGame();
    })
});

//=================FORM OPEN AND CLOSE=============================

function openForm() {
    document.getElementById("myModeForm").style.display = "block";
    }
function closeForm() {
    document.getElementById("myModeForm").style.display = "none";
    } 
