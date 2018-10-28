alert("Use the arrow keys to move");

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let frameTime = 100;
const gridWidthInCells = 50;
const cellSize = canvas.width / gridWidthInCells;
////////////////Oliot, Eventlistenerit, Const-määrittelyt///////////////
let game = {
    score: 0
}

const apple = {
    x: 19,
    y: 10,
    alive: true
}

function newApple() {
    apple.x = Math.floor(Math.random() * gridWidthInCells)
    apple.y = Math.floor(Math.random() * gridWidthInCells)
    apple.alive = true;
}

const keysDown = {}

window.addEventListener("load", startGame);

window.addEventListener("keydown", e => {
    const key = e.key;
    keysDown[key] = true;
});

window.addEventListener("keyup", e => {
    const key = e.key;
    keysDown[key] = false;
});

const snake = {
    parts: [{ x: 10, y: 10 }],
    direction: 'RIGHT',
    grow: function () {
        this.parts.push({ x: snake.parts[snake.parts.length - 1].x, y: snake.parts[snake.parts.length - 1].y })
        console.log(this.parts.length)
    }
}

//////////////Funktiot///////////////////
function drawSnake(snake) {
    ctx.fillStyle = 'black'
    snake.parts.forEach(part => {
        const xInPixels = part.x * cellSize;
        const yInPixels = part.y * cellSize;
        ctx.fillRect(xInPixels, yInPixels, cellSize, cellSize);
    })
}
function drawApple(apple) {
    if (apple.alive === true) {
        const xInPixels = apple.x * cellSize;
        const yInPixels = apple.y * cellSize;
        ctx.fillStyle = 'red';
        ctx.fillRect(xInPixels, yInPixels, cellSize, cellSize);
    }
}

function inputHandler() {
    if (snake.direction === 'UP' || snake.direction === 'DOWN') {
        if (keysDown.ArrowLeft) {
            snake.direction = 'LEFT'
        }
        if (keysDown.ArrowRight) {
            snake.direction = 'RIGHT'
        }
    }
    if (snake.direction === 'LEFT' || snake.direction === 'RIGHT') {
        if (keysDown.ArrowUp) {
            snake.direction = 'UP'
        }
        if (keysDown.ArrowDown) {
            snake.direction = 'DOWN'
        }
    }
}

function keepSnakeOnCanvas() {
    let head = snake.parts[0];
    if (head.x * cellSize + cellSize > canvas.width) {
        head.x = 0;
    }
    if (head.y * cellSize + cellSize > canvas.height) {
        head.y = 0;
    }
    if (head.x * cellSize < 0) {
        head.x = gridWidthInCells;
    }
    if (head.y * cellSize < 0) {
        head.y = gridWidthInCells;
    }
}
function moveSnake() {
    keepSnakeOnCanvas();
    const tail = snake.parts[snake.parts.length - 1];
    const head = snake.parts[0];
    switch (snake.direction) {
        case 'RIGHT':
            //määritellään hännän x olevan yhtä kuin pään x + 1, jolloin arrayn vika olio napataan käärmeen 1. osaksi
            tail.x = head.x + 1;
            tail.y = head.y;
            break;
        case 'DOWN':
            //määritellään hännän y olevan yhtä kuin..
            tail.y = head.y + 1;
            tail.x = head.x;
            break;
        case 'LEFT':
            //määritellään hännän x olevan yhtä kuin..
            tail.x = head.x - 1;
            tail.y = head.y;
            break;
        case 'UP':
            //määritellään hännän y olevan yhtä kuin..
            tail.y = head.y - 1;
            tail.x = head.x;
            break;
    }
    snake.parts.unshift(snake.parts.pop());
}

function eatApple() {
    if (snake.parts[0].x === apple.x && snake.parts[0].y === apple.y) {
        apple.alive = false;
        snake.grow();
        newApple();
        game.score++;
    }
}

function renderScore() {
    document.getElementById("score").innerHTML = "Score: " + game.score;
}

function loseGame() {
    const head = snake.parts[0];
    for (i = 1; i < snake.parts[snake.parts.length]; i++) {
        let part = snake.parts[i];
        if (head.x === part.x && head.y === part.y) {
            alert("You lose!");
        }
    }
}

function updateGame() {
    inputHandler();
    moveSnake();
    eatApple();
    renderScore();
    loseGame();
}

function drawFrame() {
    canvas.width = canvas.width; // clear canvas FTW?!
    drawSnake(snake);
    drawApple(apple);
}

function startGame() {
    setInterval(() => {
        updateGame();
        drawFrame();
    }, frameTime)
}