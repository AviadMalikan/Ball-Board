'use strict'

const WALL = 'WALL';
const FLOOR = 'FLOOR';
const BALL = 'BALL';
const GAMER = 'GAMER';
const GLUE = 'GLUE';
const BOMB = 'BOMB'

const GAMER_IMG = '<img src="img/gamer.png" />';
const GAMER_GLUED_IMG = '<img src="img/gamer-purple.png" />';
const BALL_IMG = '<img src="img/ball.png" />';
const GLUE_IMG = '<img src="img/candy.png"/>';
const BOMB_IMG = '<img src="img/bomb.png"/>'
const GAMER_DIE_IMG = '<img src="img/gamer-die.png"/>' 

var gIsGameOn
var gBoard;
var gGamerPos;
var gBallOnTheBoard
var gBallCollect
var gIsGlued
var gIsWin
var gBallInterval
var gBombInterval
var gGlueInterval


function initGame() {
	gIsGameOn = true
	gGamerPos = { i: 1, j: 1 };
	gBoard = buildBoard();
	renderBoard(gBoard);

	gBallOnTheBoard = 2
	gBallCollect = 0
	gIsGlued = false
	gIsWin = true

	gBallInterval = setInterval(addBall, 2500)
	gGlueInterval = setInterval(addGlue, 5000)
	gBombInterval = setInterval(addBomb, 10000)
	renderCleanHTML()
}

function renderCleanHTML() {

	var elWinText = document.querySelector('.button-div')
	elWinText.classList.add('hide')

	var elScore = document.querySelector('h2')
	elScore.innerText = 'Eat all the ball!'
}

function gameOver() {
	gIsGameOn = false
	clearInterval(gBallInterval)
	clearInterval(gGlueInterval)
	clearInterval(gBombInterval)

	var winOrLoseMsg = (gIsWin) ? 'WIN! 😃' : 'LOOSE! 😖'

	var elWinText = document.querySelector('.button-div')
	elWinText.classList.remove('hide')
	var elSpan = document.querySelector('.button-div span')
	elSpan.innerHTML = winOrLoseMsg
}

// Move the player to a specific location
function moveTo(i, j) {
	var targetCell = gBoard[i][j];
	if (gIsGlued || !gIsGameOn) return
	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0)
		|| (jAbsDiff === 1 && iAbsDiff === 0)
		|| iAbsDiff === gBoard.length - 1
		|| jAbsDiff === gBoard[0].length - 1) {
		switch (targetCell.gameElement) {
			case BALL:
				gBallCollect++
				playPointSound()
				gBallOnTheBoard--
				var elScore = document.querySelector('h2')
				elScore.innerText = 'Your Score is: ' + gBallCollect

				console.log('Collecting!');
				if (gBallOnTheBoard === 0) gameOver()
				break
			case GLUE:
				gIsGlued = true
				setTimeout(() => {
					gIsGlued = false
					renderCell({ i: i, j: j }, GAMER_IMG)
				}, 3000)
				break
			case BOMB:
				playLoseSound()
				var elTable = document.querySelector('table')
				elTable.classList.add('lose')
				gIsWin = false
				markBombNegs({ i: i, j: j })
				gameOver()
				break
		}
		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');
		// MOVING to selected position
		// Model:
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		var gamerImg = gIsGlued ? GAMER_GLUED_IMG : GAMER_IMG
		renderCell(gGamerPos, gamerImg);
	}
}

// Move the player by keyboard arrows
function handleKey(event) {
	var i = gGamerPos.i;
	var j = gGamerPos.j;

	switch (event.key) {
		case 'ArrowLeft':
			if (j === 0) moveTo(i, gBoard[0].length - 1)
			else moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			if (j === gBoard[0].length - 1) moveTo(i, 0)
			else moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			if (i === 0) moveTo(gBoard.length - 1, j)
			else moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			if (i === gBoard.length - 1) moveTo(0, j)
			else moveTo(i + 1, j);
			break;
	}
}

function addBall() {
	var cell = addElement(BALL, BALL_IMG)
	gBallOnTheBoard++
}

function addGlue() {
	var cell = addElement(GLUE, GLUE_IMG)
	setTimeout(() => removeElement(cell), 3000)
}

function addBomb() {
	var cell = addElement(BOMB, BOMB_IMG)
	setTimeout(() => removeElement(cell), 5000)
}


