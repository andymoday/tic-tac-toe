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
    playMove: function playMove(buttonID) {   
        let gameArray = gameBoardModule.getGameArray()         
        if (gameArray[buttonID -1] === '') {
            gameBoardModule.setGameArray([buttonID -1],player.getMark());
            render();        
            gameArray = gameBoardModule.getGameArray() 
            if ((gameArray[0] !== '' && (gameArray[0] === gameArray[1] && gameArray[1] === gameArray[2])) ||
                (gameArray[3] !== '' && (gameArray[3] === gameArray[4] && gameArray[4] === gameArray[5])) ||
                (gameArray[6] !== '' && (gameArray[6] === gameArray[7] && gameArray[7] === gameArray[8])) ||
                (gameArray[0] !== '' && (gameArray[0] === gameArray[3] && gameArray[3] === gameArray[6])) ||
                (gameArray[1] !== '' && (gameArray[1] === gameArray[4] && gameArray[4] === gameArray[7])) ||
                (gameArray[2] !== '' && (gameArray[2] === gameArray[5] && gameArray[5] === gameArray[8])) ||
                (gameArray[0] !== '' && (gameArray[0] === gameArray[4] && gameArray[4] === gameArray[8])) ||
                (gameArray[2] !== '' && (gameArray[2] === gameArray[4] && gameArray[4] === gameArray[6])) ) {
                    endGame(player);
            } 
            if ((gameArray.includes('')) === false) {
                endGame('tie')
            }
            player = switchPlayer();
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
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                playMove(button.id)    
            })       
        }) 
    }
    endGame: function endGame(player) {
        if (player === 'tie') {
            alert('Tie!!');
            reset();
        } else {
            let winner = player.getName();
            alert(winner + ' is the winner!');
            reset();
        }
    }
    reset: function reset() {    
        for (let i = 0; i < 9; i++) {
            gameBoardModule.setGameArray(i,'');
        }
        render();
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

