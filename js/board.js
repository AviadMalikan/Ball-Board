'use strict'


// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

function buildBoard() {
    // Create the Matrix
    var board = createMat(10, 12)

    // Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = { type: FLOOR, gameElement: null };
            if (i === 0 || i === board.length - 1
                || j === 0 || j === board[0].length - 1) {
                cell.type = WALL;
            }
            board[i][j] = cell;
        }
    }
    board[0][5].type = FLOOR
    board[9][5].type = FLOOR
    board[5][0].type = FLOOR
    board[5][11].type = FLOOR

    // Place the gamer & balls at selected position
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
    board[3][8].gameElement = BALL;
    board[7][4].gameElement = BALL;

    // console.log(board);
    return board;
}

// Render the board to an HTML table
function renderBoard(board) {
    var strHTML = '';

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            var cellClass = getClassName({ i: i, j: j })
            cellClass += (currCell.type === FLOOR) ? ' floor' : ' wall';

            strHTML += '\t<td class="cell ' + cellClass +
                '"  onclick="moveTo(' + i + ',' + j + ')" >\n';
            switch (currCell.gameElement) {
                case GAMER:
                    strHTML += GAMER_IMG;
                    break
                case BALL:
                    strHTML += BALL_IMG;
                    break
            }
            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }
    // console.log('strHTML is:');
    // console.log(strHTML);
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}


function addElement(element, elementIMG) {
    var emptyCell = getEmptyCell()
    // console.log('emptyCell: ', emptyCell)
    gBoard[emptyCell.i][emptyCell.j].gameElement = element
    renderCell(emptyCell, elementIMG)
    return emptyCell
}

function removeElement(emptyCell) {
    if (gBoard[emptyCell.i][emptyCell.j].gameElement !== GAMER) {
        gBoard[emptyCell.i][emptyCell.j].gameElement = null
        renderCell(emptyCell, '')
    }
}

function markBombNegs(location) {
    for (var i = location.i - 1; i <= location.i + 1; i++) {
        if (i < 1 || i >= gBoard.length-1) continue
        for (var j = location.j - 1; j <= location.j + 1; j++) {
            if (j < 1 || j > gBoard.length) continue
            var cellSelector = '.' + getClassName({ i: i, j: j })
            var elCell = document.querySelector(cellSelector);
            elCell.classList.add('loose')
        }
    }
}
