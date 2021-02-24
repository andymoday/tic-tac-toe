const gameBoardModule = (function(){
    let gameArray = ['','','','','','','','',''];
    getGameArray: function getGameArray(){
        return gameArray;
    }
    setGameArray: function setGameArray(i,mark){
        gameArray[i] = mark;
        return gameArray;
    }
    let squares = []
    render: function render() {
        gameArray.forEach(function (element,i) {
            squares[i] = document.getElementById(i+1);
            squares[i].textContent = element;
        });
    }
    switchPlayer: function switchPlayer(player) {
        player = (player === playerOne) ? playerTwo : playerOne;
        return playMove(player)
    }
    const buttons = Array.from(document.getElementsByClassName('square'));
    playMove: function playMove(player) {
            buttons.forEach((button) => {
                button.addEventListener('click', () => {
                    if (gameArray[button.id -1] !== '') {
                        return 'error'
                    } else {
                        console.log(player.getName())
                        setGameArray([button.id -1],player.getMark())
                        render(); 
                        switchPlayer(player);
                        console.log('done1')  
                        return 'done'; 
                    }
                })   
            }) 
    } 
    
    return {getGameArray, 
            setGameArray, 
            render,
            playMove,
            switchPlayer}
})();


let displayControllerModule = (function() {
            
    //on completion of move gameBoardModule.render()
})();

const Player = (name, mark) => {
    const getName  = () => name;
    const getMark = () => mark;
    return {getName,
            getMark}
}
const playerOne = Player('Player One', 'X')
const playerTwo = Player('Player Two', 'O')
