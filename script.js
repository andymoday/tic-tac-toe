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
    let mode;
    setMode: function setMode(button) {
        reset();
        mode = button;
        //let nameSelectForm = document.getElementById("myNameForm")
        //nameSelectForm.style.display = 'block'
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
    //setPlayer: function setPlayer() {
    //    let P1 = document.getElementById('player-one').value;
    //    let P2 = document.getElementById('player-one').value;
    //    playerOne.name = P1
    //    if (mode === '1P') {
    //        playerTwo.name = 'Computer'
    //    } else {
    //        playerTwo.name = P2
    //    }           
    //    document.getElementById('player-one').value = ''
    //    document.getElementById('player-two').value = ''  
    //    document.getElementById('player-one-name').value = P1
    //    document.getElementById('player-two-name').value = P2
    //    console.log(document.getElementById('player-one-name').value,
    //                document.getElementById('player-two-name').value,
    //                playerOne.name,
    //                playerTwo.name )        
    //    return false;//It's important to return false; to prevent default behaviour at the end of your submit handler, as otherwise the form will post and reload the page.
    //}
    playGame: function playGame() { 
        buttons.forEach(button => {
            button.removeEventListener('click', mouseEventHandler)
          })  
        buttons.forEach(button => {
            button.addEventListener('click', mouseEventHandler)
        })
    }    
    mouseEventHandler: function mouseEventHandler({target})  { // Step 2
        if (target.className === 'square') { // Step 3
            console.log(target.id)
            if (mode === '1P') {
                player = playerOne;
            } else {
                player = player
            } //comment out for multiplayer
            let gameArray = gameBoardModule.getGameArray()         
            if (gameArray[target.id -1] === '') {
                gameBoardModule.setGameArray([target.id -1],player.getMark());
                //target.stopImmediatePropagation();
                render();        
                gameArray = gameBoardModule.getGameArray() 
                console.log(gameArray[0],gameArray[1],gameArray[2],
                    gameArray[3], gameArray[4],gameArray[5],gameArray[6],gameArray[7],gameArray[8],
                    getResult(gameArray))
                let result = getResult(gameArray)
                if (result !== 'incomplete'){
                    //stopImmediatePropagation();
                    buttons.forEach(button => {
                        button.removeEventListener('click', mouseEventHandler)
                      })
                    endGame(result);
                    return;
                } else {
                    if (mode === '1P') {
                        //target.stopImmediatePropagation()
                        buttons.forEach(button => {
                            button.removeEventListener('click', mouseEventHandler)
                          })
                        computerPlay()
                    } else {
                        player = switchPlayer();
                        //target.stopImmediatePropagation()
                        buttons.forEach(button => {
                            button.removeEventListener('click', mouseEventHandler)
                          })
                        playGame()

                    }
                }
            } else {
                //target.stopImmediatePropagation()
                buttons.forEach(button => {
                    button.removeEventListener('click', mouseEventHandler)
                  })
                playGame()}
        }
    }    
    endGame: function endGame(result) {
        let winnerForm = document.getElementById("myWinnerForm");
        let winnerMSG = document.getElementById("winner-message");
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
    switchPlayer: function switchPlayer() {
        return (player === playerOne) ? playerTwo : playerOne;

    }
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
            buttons.forEach(button => {
                button.removeEventListener('click', mouseEventHandler)
              })
            endGame(getResult(gameArray));
            return
        }
        player = switchPlayer();
        buttons.forEach(button => {
            button.removeEventListener('click', mouseEventHandler)
          })  
        playGame();               
        
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
    closeWinnerForm: function closeWinnerForm() {
        document.getElementById("myWinnerForm").style.display = "none";
        playGame();
        reset();
        } 
    //closePlayerForm: function closePlayerForm() {
    //    document.getElementById("myNameForm").style.display = "none";
    //    } 


    return {setMode,
            closeWinnerForm
            }
})();





