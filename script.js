let gameBoardModule = (function(){
    let gameArray = ['X','O','X','O','X','O','X','O','X'];
    let gameBoard = document.getElementById('gameboard');
    let squares = []
    render: function render() {
        gameArray.forEach(function (element,i) {
            squares[i] = document.createElement('div');
            squares[i].setAttribute('class', 'square');
            squares[i].textContent = gameArray[i]
            gameBoard.appendChild(squares[i]);
        });
    }
    return {render}
})();
//
//let displayControllerModule = (function {
//    
//})();
//
//function Player(xxx) {
//    this.xxx = yyy;
//}
//
//
//Player.prototype.xxx = function() {
//    return(this.xxx);
//}