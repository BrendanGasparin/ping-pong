/*
	pingpong.js
	JavaScript ping pong game.
	Author: Brendan Gasparin
	Adapted from a free tutorial at:
	udemy.com/course/code-your-first-game/
*/

const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_GAP = 10;
const BALL_RADIUS = 10;
const WIN_CONDITION = 3;
const PLAYER2_SPEED = 5;

let canvas;
let canvasContext;
let ballX = 400;
let ballY = 300;
let ballXSpeed = 5;
let ballYSpeed = 5;
let player1Y = 250;
let player2Y = 250;
let p1Score = 0;
let p2Score = 0;
let gameOver = true;

// calculate mouse position
function calculateMousePos(evt) {
	let rect = canvas.getBoundingClientRect();
	let root = document.documentElement;
	let mouseX = evt.clientX - rect.left - root.scrollLeft;
	let mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

// execute when document is loaded
window.onload = function() {
	canvas = document.querySelector('#game-canvas');
	canvasContext = canvas.getContext('2d');

	let fps = 30;
	setInterval(function() {
		draw();
		move();
	}, 1000 / fps);	// call draw function every 1000/60ms

	canvas.addEventListener('mousedown', mouseClick);

	canvas.addEventListener('mousemove',
		function(evt) {
			var mousePos = calculateMousePos(evt);
			player1Y = mousePos.y - (PADDLE_HEIGHT / 2);
		});
}

function draw() {
	// fill canvas with black
	drawRect(0, 0, canvas.width, canvas.height, 'black');

	canvasContext.textAlign = 'center';
	canvasContext.font = '60px "Press Start 2P"';

	if (gameOver) {
		canvasContext.fillStyle = 'white';
		canvasContext.fillText('Ping Pong', canvas.width / 2, 140, 100);

		canvasContext.font = '20px "Press Start 2P"';
		if (p1Score >= WIN_CONDITION) {
			canvasContext.fillText('Player 1 Wins!', canvas.width / 2, 250);
		}
		else if (p2Score >= WIN_CONDITION) {
			canvasContext.fillText('Player 2 Wins!', canvas.width / 2, 250);
		}

		canvasContext.fillStyle = 'white';
		canvasContext.font = '20px "Press Start 2P"';
		canvasContext.fillText("Click to Play", canvas.width / 2, 500);
		return;
	}

	drawNet();

	// draw ball
	drawCircle(ballX, ballY, BALL_RADIUS, 'white');

	// draw left paddle
	drawRect(PADDLE_GAP, player1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

	// draw right paddle
	drawRect(canvas.width - PADDLE_THICKNESS - PADDLE_GAP, player2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

	// draw scores
	canvasContext.fillText(p1Score, canvas.width / 4, 100);
	canvasContext.fillText(p2Score, canvas.width * 0.75, 100);
}

function move() {
	if (gameOver) {
		return;
	}

	ballX = ballX + ballXSpeed;
	ballY = ballY + ballYSpeed;

	p2Move();

	// if ball goes off left side of play field
	if (ballX < 0 - BALL_RADIUS) {
		p2Score++;
		resetBall();
	}
	// if ball goes off right side of play field
	else if (ballX > canvas.width + BALL_RADIUS) {
		p1Score++;
		resetBall();
	}

	// if ball is hitting the left paddle
	if (ballX < PADDLE_GAP + PADDLE_THICKNESS + BALL_RADIUS && ballX > PADDLE_GAP - BALL_RADIUS) {
		if (ballY > player1Y && ballY < player1Y + PADDLE_HEIGHT) {
			ballXSpeed = -ballXSpeed;

			// base Y speed off where on the paddle the player contacts the ball
			let deltaY = ballY - (player1Y + PADDLE_HEIGHT / 2);
			ballYSpeed = deltaY * 0.35;
		}
	}

	// if ball is hitting the right paddle
	if (ballX < canvas.width - PADDLE_GAP + BALL_RADIUS && ballX > canvas.width - PADDLE_THICKNESS - PADDLE_GAP - BALL_RADIUS) {
		if (ballY > player2Y && ballY < player2Y + PADDLE_HEIGHT) {
			ballXSpeed = -ballXSpeed;
		}
	}

	// rebound ball if it hits the top or bottom of the playfield
	if (ballY < BALL_RADIUS) {
		ballYSpeed = -ballYSpeed;
	}
	if (ballY > canvas.height - BALL_RADIUS) {
		ballYSpeed = -ballYSpeed;
	}
}

function drawNet() {
	for (let i = 10; i < canvas.height; i += 40) {
		drawRect(canvas.width / 2 - 1, i, 2, 20, 'white');
	}
}

function drawRect(leftX, topY, width, height, colour) {
	canvasContext.fillStyle = colour;
	canvasContext.fillRect(leftX, topY, width, height, colour);
}

function drawCircle(centreX, centreY, radius, colour) {
	canvasContext.fillStyle = colour;
	canvasContext.beginPath();
	canvasContext.arc(centreX, centreY, radius, 0, Math.PI * 2, true);
	canvasContext.fill();
}

function resetBall() {
	if (p1Score >= WIN_CONDITION || p2Score >= WIN_CONDITION) {
		gameOver = true;
	}
	else {
		ballXSpeed = -ballXSpeed;
		ballX = canvas.width / 2;
		ballY = canvas.height / 2;
	}
}

function p2Move() {
	if (player2Y + PADDLE_HEIGHT / 2 < ballY - PADDLE_HEIGHT / 3) {
		player2Y += PLAYER2_SPEED;
	} else if (player2Y + PADDLE_HEIGHT / 2 > ballY + PADDLE_HEIGHT / 3) {
		player2Y -= PLAYER2_SPEED;
	}
}

function mouseClick() {
	if (gameOver) {
		p1Score = 0;
		p2Score = 0;
		gameOver = false;
	}
}