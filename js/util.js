'use strict'

function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function getEmptyCell() {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.type === FLOOR && currCell.gameElement === null) {
                var pos = { i: i, j: j }
                emptyCells.push(pos)
            }
        }
    }
    // console.log('emptyCells: ', emptyCells)
    var randomIdx = getRandomInt(0, emptyCells.length - 1)
    return emptyCells[randomIdx]
}

function playPointSound() {
    var audio = new Audio('sound/point.mp3');
    audio.play();
}
function playLoseSound() {
    var audio = new Audio('sound/lose.mp3');
    audio.play();
}

function getRandomInt(min, max) { // Inclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}