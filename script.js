// Canvas and context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_HEIGHT = 80;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 8;
const PADDLE_SPEED = 5;
const BALL_SPEED = 4;
const PADDLE_MARGIN = 15;

// Game objects
const player = {
    x: PADDLE_MARGIN,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
    score: 0
};

const computer = {
    x: canvas.width - PADDLE_MARGIN - PADDLE_WIDTH,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
    score: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: BALL_SIZE,
    height: BALL_SIZE,
    dx: BALL_SPEED,
    dy: BALL_SPEED
};

// Input handling
const keys = {};
let mouseY = canvas.height / 2;

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Update player paddle position
function updatePlayer() {
    // Mouse control
    if (mouseY - PADDLE_HEIGHT / 2 >= 0 && mouseY + PADDLE_HEIGHT / 2 <= canvas.height) {
        player.y = mouseY - PADDLE_HEIGHT / 2;
    }

    // Arrow key control
    if (keys['ArrowUp'] && player.y > 0) {
        player.y -= PADDLE_SPEED;
    }
    if (keys['ArrowDown'] && player.y < canvas.height - PADDLE_HEIGHT) {
        player.y += PADDLE_SPEED;
    }
}

// Update computer paddle (AI)
function updateComputer() {
    const computerCenter = computer.y + PADDLE_HEIGHT / 2;
    const ballCenter = ball.y;
    const difficulty = 2; // Adjust for AI difficulty (higher = harder)

    if (computerCenter < ballCenter - 35) {
        if (computer.y < canvas.height - PADDLE_HEIGHT) {
            computer.y += PADDLE_SPEED * difficulty;
        }
    } else if (computerCenter > ballCenter + 35) {
        if (computer.y > 0) {
            computer.y -= PADDLE_SPEED * difficulty;
        }
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top and bottom wall collision
    if (ball.y <= 0 || ball.y + BALL_SIZE >= canvas.height) {
        ball.dy = -ball.dy;
        ball.y = Math.max(0, Math.min(canvas.height - BALL_SIZE, ball.y));
    }

    // Paddle collision - Player
    if (
        ball.x - BALL_SIZE / 2 <= player.x + PADDLE_WIDTH &&
        ball.y >= player.y &&
        ball.y <= player.y + PADDLE_HEIGHT
    ) {
        ball.dx = -ball.dx;
        ball.x = player.x + PADDLE_WIDTH + BALL_SIZE / 2;

        // Add spin based on where ball hits paddle
        const hitPos = (ball.y - player.y) / PADDLE_HEIGHT;
        ball.dy = (hitPos - 0.5) * 6;
    }

    // Paddle collision - Computer
    if (
        ball.x + BALL_SIZE / 2 >= computer.x &&
        ball.y >= computer.y &&
        ball.y <= computer.y + PADDLE_HEIGHT
    ) {
        ball.dx = -ball.dx;
        ball.x = computer.x - BALL_SIZE / 2;

        // Add spin based on where ball hits paddle
        const hitPos = (ball.y - computer.y) / PADDLE_HEIGHT;
        ball.dy = (hitPos - 0.5) * 6;
    }

    // Score points
    if (ball.x < 0) {
        computer.score++;
        resetBall();
    } else if (ball.x > canvas.width) {
        player.score++;
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
}

// Draw functions
function drawPaddle(paddle) {
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ff88';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.shadowBlur = 0;
}

function drawBall() {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawCenterLine() {
    ctx.strokeStyle = '#444';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    drawCenterLine();

    // Draw paddles
    drawPaddle(player);
    drawPaddle(computer);

    // Draw ball
    drawBall();
}

// Update score display
function updateScore() {
    document.getElementById('playerScore').textContent = player.score;
    document.getElementById('computerScore').textContent = computer.score;
}

// Game loop
function gameLoop() {
    updatePlayer();
    updateComputer();
    updateBall();
    drawGame();
    updateScore();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
