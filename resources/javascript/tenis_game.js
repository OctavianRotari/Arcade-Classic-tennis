var canvas;
var canvasContext;
var ballX = 50;
var ballSpeedX = 10;
var ballY = 50;
var ballSpeedY = 5;
var canvasWidth;
var canvasHeight;
var paddle1Y = 250;
var paddle2Y = 70;
var player1Score = 0;
var player2Score = 0;
var showWinScreen = false;

const WINNING_SCORE = 3;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
const BALL_RADIUS = 10;
const BALL_DIAMETER = BALL_RADIUS * 2;

function calculateMousePosition(evt){
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.left - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

function handleMouseClick(){
	if(showWinScreen){
		player1Score = 0;
		player2Score = 0;
		showWinScreen = false;
	}
}

window.onload = function(){
	canvas = document.getElementById('gameCanvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
	canvasContext = canvas.getContext('2d');
	var framePerSecond = 60;
	setInterval(function(){
		moveEverything();
		drawEverything();
	}, 1000/framePerSecond);
	canvas.addEventListener('mousemove',
							function(evt){
								var mousePos = calculateMousePosition(evt);
								paddle1Y = mousePos.y - (PADDLE_HEIGHT/2)
							});
							canvas.addEventListener('mousedown',handleMouseClick)
}

function ballReset(){
	if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
		showWinScreen = true;
	} else {
		ballX = canvasWidth/2;
		ballY = canvasHeight/2;
	}
}

function computerMovment(){
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2)
	if(paddle2YCenter < ballY - 20){
		paddle2Y += 15;
	} else if(paddle2YCenter > ballY + 20){
		paddle2Y -= 15;
	}
}

function moveEverything(){
	if(showWinScreen){
		return;
	}
	computerMovment();
	ballX += ballSpeedX;
	ballY += ballSpeedY;
	if(ballX > canvasWidth - BALL_DIAMETER && ballY >= paddle2Y && ballY <= (paddle2Y + 100)){
		ballSpeedX = - ballSpeedX;
		var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
		ballSpeedY = deltaY * 0.35;
	} else if(ballX > canvasWidth - BALL_DIAMETER){
		player1Score++;//-must be before ball reset
		ballReset();
	} else if ( ballX < 10 + BALL_RADIUS && ballY >= paddle1Y && ballY <= (paddle1Y + 100)){
		ballSpeedX = - ballSpeedX;
		var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
		ballSpeedY = deltaY * 0.35;
	} else if (ballX < 0 + BALL_RADIUS){
		player2Score++; //-must be before ball reset
		ballReset();
	}
	if(ballY > canvasHeight - BALL_DIAMETER ){
		ballSpeedY = - ballSpeedY;
	} else if ( ballY < 0 + BALL_RADIUS){
		ballSpeedY = - ballSpeedY;
	}
}

function drawNet(){
	for(var i=0;i<canvasHeight;i+=40){
		colorRect(canvasWidth/2-1,i,2,20,'white');
	}
}

function drawEverything(){
	colorRect(0,0,canvasWidth,canvasHeight,'black');
	colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
	colorRect(canvasWidth-PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
	if(showWinScreen){
		canvasContext.font = ('20px Verdana');
		canvasContext.fillStyle = 'white';
		if(player1Score >= WINNING_SCORE){
			canvasContext.fillText('Player 1 won the game: ' + player1Score, 250, canvasHeight/2);
		} else if( player2Score >= WINNING_SCORE){
			canvasContext.fillText('Player 2 won the game: ' + player2Score , 250, canvasHeight/2);
		}
		canvasContext.fillText('Click to continue', 250, canvasHeight/2 + 50);
		return;
	}
	drawNet();
	colorCircle(ballX, ballY, BALL_RADIUS, 'white' );

	canvasContext.fillText(player1Score,100,100);
	canvasContext.fillText(player2Score ,canvasWidth-100,100);
}

function colorCircle(centerX, centerY, radius, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY,width,height);
}
