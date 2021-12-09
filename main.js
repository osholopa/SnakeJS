//////////////// Audio & Audio Context ///////////////
const AudioContext = window.AudioContext || window.webkitAudioContext
const audioCtx = new AudioContext()
const audioElement = document.querySelector('audio')
const track = audioCtx.createMediaElementSource(audioElement)
const gainNode = audioCtx.createGain();
gainNode.gain.value = 0.5
track.connect(audioCtx.destination)


//////////////// Canvas & Render Context ///////////////
const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

//////////////// Variables ///////////////
let touchStartY
let touchStartX
let lastTouchDirection
const frameTime = 90
const gridWidthInCells = 50
const cellSize = canvas.width / gridWidthInCells

// Game Objects
const game = {
  score: 0,
}

const snake = {
  parts: [{ x: 10, y: 10 }],
  direction: 'RIGHT',
  grow: function () {
    this.parts.push({
      x: snake.parts[snake.parts.length - 1].x,
      y: snake.parts[snake.parts.length - 1].y,
    })
  },
}

const apple = {
  x: 19,
  y: 10,
  alive: true,
}

const keysDown = {}

//////////////// Eventlisteners ///////////////
window.addEventListener('load', startGame)

window.addEventListener('keydown', (e) => {
  if (audioCtx.state === 'suspended') {
		audioCtx.resume();
	}

  const pressedKey = e.key
  for (let key in keysDown) {
    keysDown[key] = false
  }
  keysDown[pressedKey] = true
})

window.addEventListener('keyup', (e) => {
  const key = e.key
  keysDown[key] = false
})



window.addEventListener('touchstart', (e) => {
  if (audioCtx.state === 'suspended') {
		audioCtx.resume();
	}
  
  touchStartY = e.touches[0].clientY
  touchStartX = e.touches[0].clientX
})

window.addEventListener('touchmove', (e) => {
  const touchEndY = e.touches[0].clientY
  const touchEndX = e.touches[0].clientX

  if (['RIGHT', 'LEFT'].includes(snake.direction)) {
    if (touchStartY < touchEndY) {
      lastTouchDirection = 'DOWN'
    } else {
      lastTouchDirection = 'UP'
    }
  } else {
    if (touchStartX < touchEndX) {
      lastTouchDirection = 'RIGHT'
    } else {
      lastTouchDirection = 'LEFT'
    }
  }
})

window.addEventListener('touchend', () => {
  if(lastTouchDirection !== snake.direction) snake.direction = lastTouchDirection
})



////////////// Functions ///////////////////

function newApple() {
  apple.x = Math.floor(Math.random() * gridWidthInCells)
  apple.y = Math.floor(Math.random() * gridWidthInCells)
  apple.alive = true
}

function drawSnake(snake) {
  ctx.fillStyle = 'black'
  snake.parts.forEach((part) => {
    const xInPixels = part.x * cellSize
    const yInPixels = part.y * cellSize
    ctx.fillRect(xInPixels, yInPixels, cellSize, cellSize)
  })
}
function drawApple(apple) {
  if (apple.alive === true) {
    const xInPixels = apple.x * cellSize
    const yInPixels = apple.y * cellSize
    ctx.fillStyle = 'red'
    ctx.fillRect(xInPixels, yInPixels, cellSize, cellSize)
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
  let head = snake.parts[0]
  if (head.x * cellSize + cellSize > canvas.width) {
    head.x = 0
  }
  if (head.y * cellSize + cellSize > canvas.height) {
    head.y = 0
  }
  if (head.x * cellSize < 0) {
    head.x = gridWidthInCells
  }
  if (head.y * cellSize < 0) {
    head.y = gridWidthInCells
  }
}

function moveSnake() {
  keepSnakeOnCanvas()
  const tail = snake.parts[snake.parts.length - 1]
  const head = snake.parts[0]
  switch (snake.direction) {
    case 'RIGHT':
      
      tail.x = head.x + 1
      tail.y = head.y
      break
    case 'DOWN':
      tail.y = head.y + 1
      tail.x = head.x
      break
    case 'LEFT':
      tail.x = head.x - 1
      tail.y = head.y
      break
    case 'UP':
      tail.y = head.y - 1
      tail.x = head.x
      break
  }
  snake.parts.unshift(snake.parts.pop())
}

function eatApple() {
  if (snake.parts[0].x === apple.x && snake.parts[0].y === apple.y) {
    apple.alive = false
    snake.grow()
    if(audioCtx.state === 'running') audioElement.play()
    newApple()
    game.score += 100
  }
}

function renderScore() {
  document.getElementById('score').innerHTML = 'Score: ' + game.score
}

function loseGame() {
  const head = snake.parts[0]
  if (snake.parts.length >= 3) {
    for (i = 1; i < snake.parts.length; i++) {
      let part = snake.parts[i]
      if (head.x === part.x && head.y === part.y) {
        alert(`Game Over! Your score is  + ${game.score}.`)
        reset()
      }
    }
  }
}

function reset() {
  snake.parts = [{ x: 10, y: 10 }]
  snake.direction = 'RIGHT'
  location.reload()
}

function updateGame() {
  inputHandler()
  moveSnake()
  eatApple()
  renderScore()
  loseGame()
}

function drawFrame() {
  canvas.width = canvas.width // clear canvas FTW?!
  drawSnake(snake)
  drawApple(apple)
}

function startGame() {
  setInterval(() => {
    updateGame()
    drawFrame()
  }, frameTime)
}
