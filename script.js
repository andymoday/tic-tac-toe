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
let playerOne = Player('Player One', 'X')
let playerTwo = Player('Player Two', 'O')


let displayControllerModule = (function() {
    //array of the html button elements
    const buttons = Array.from(document.getElementsByClassName('square'));
    let player = playerOne
    let lastMove = ''
    playMove: function playMove(buttonID) {   
        player = playerOne;
        let gameArray = gameBoardModule.getGameArray()         
        if (gameArray[buttonID -1] === '') {
            gameBoardModule.setGameArray([buttonID -1],player.getMark());
            lastMove = buttonID -1;
            render();        
            gameArray = gameBoardModule.getGameArray() 
            if (getResult(gameArray) !== 'incomplete'){
                endGame(getResult(gameArray));
            } else {
            computerPlay()
            }
        }
    }  
     
    switchPlayer: function switchPlayer() {
        return (player === playerOne) ? playerTwo : playerOne;

    }
    render: function render() {
        gameBoardModule.getGameArray().forEach(function (element,i) {
            buttons[i].textContent = element;
        });
    }
    playGame: function playGame() {
        reset();
        playerOne.name = prompt('Please enter player one name');
        playerTwo.name = prompt('Please enter player two name'); 
        player=playerOne;
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                playMove(button.id)    
            })       
        }) 
    }
    endGame: function endGame(result) {
        if (result === 'tie') {
            alert('Tie!!');
            reset();
        } else {
            let winner = ''
            if (result === 'X win') {
                winner = playerOne.getName();
            } else {
                winner = playerTwo.getName();
            }
            alert(winner + ' is the winner!');
            reset();
        }
    }
    reset: function reset() {    
        player = playerOne;
        for (let i = 0; i < 9; i++) {
            gameBoardModule.setGameArray(i,'');
        }
        render();
    }
    computerPlay: function computerPlay() {
        player = playerTwo
        let gameArray = gameBoardModule.getGameArray()         
        let compChoice;
        if ((gameArray.includes('')) === false) {
            endGame('tie')
        }
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
        let score;
        let marker = 'O';
        function move(marker,array) {
            let testArr = array.slice();
            for (let i = 0; i < 9; i++) {
                if (array[i] === '') {
                    testArr[i] = marker;
                    if (getResult(testArr)==='O win'){
                        score = (marker === 'O')? 1: -1;
                    } else if (getResult(testArr)==='X win') {
                        score = (marker === 'O')? -1: 1;
                    } else {
                        score = 0;
                    }
                    if (score = 1) {
                        return i
                    }
                    if (score <1) {
                        return move((marker === 'X')? marker = 'O':marker ='X',testArr);
                    }
                } else {
                    score = -1
                }
            }
        }
        return move(marker,curGamArr)
    }
    getResult: function getResult(gameArray) {
        if ((gameArray.includes('')) === false) {
            return 'tie';
        }
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
        } else {
            return 'incomplete';
        }
    }



    return {playGame,
            reset
            }
})();

let startButton = document.getElementById('start');
startButton.addEventListener('click', () => {
    displayControllerModule.reset();
    displayControllerModule.playGame();
});

