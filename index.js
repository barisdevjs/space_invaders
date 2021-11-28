const gameBoard = document.querySelector('.board');
const score = document.getElementById('score')
const width = 15;
const bulletSound = new Audio('./shoot.wav')
const alienKilledSound = new Audio('./invaderkilled.wav')
const playerKilledSound = new Audio('./explosion.wav')
let aliensRemoved = []
let currentShooterIndex = 277;
let direction = 1;
let invadersId // by default null
let goingRight = true
let results = 0
let moveinvadersTimer = 350



for (let index = 0; index < 300; index++) {     // 20 * 15 for grid layout
    const square = document.createElement('div');
    gameBoard.appendChild(square);
}

const squares = [...document.querySelectorAll('.board div')];
console.log(squares);

const alienInvaders = [
    5, 6, 7, 8, 9,
    20, 21, 22, 23, 24,
    35, 36, 37, 38, 39
]

function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
      if(!aliensRemoved.includes(i)) {
        squares[alienInvaders[i]].classList.add('invader')
      }
    }
  }
draw()

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
      squares[alienInvaders[i]].classList.remove('invader')
    }
  }


squares[currentShooterIndex].classList.add('shooter');

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter');
    switch (e.keyCode) {
        case 37:
            if (currentShooterIndex % width !== 0) {
                currentShooterIndex -= 1;
            }
            break;
        case 39:
            if (currentShooterIndex % width < width - 1) {
                currentShooterIndex += 1;
            }
            break;
    }
    squares[currentShooterIndex].classList.add('shooter');
}

document.addEventListener('keydown', moveShooter);


function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
    remove();

    if (rightEdge && goingRight) {
        
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1
            direction = -1
            goingRight = false
        }
    }

    if (leftEdge && !goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1
            direction = 1
            goingRight = true
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
      }
        
    draw() 


    // write game over function
    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
        playerKilledSound.play()
        score.innerHTML = 'GAME OVER'

        clearInterval(invadersId)
        clearInterval(bulletId)
    }
 
    for (let i = 0; i < alienInvaders.length; i++) {
        if(alienInvaders[i] > (squares.length)) {
          score.innerHTML = 'GAME OVER'
          clearInterval(invadersId)
        }
      }

    if (aliensRemoved.length === alienInvaders.length) {
        score.innerHTML = 'You WIN'
        clearInterval(invadersId)
    }
}

invadersId = setInterval(moveInvaders, moveinvadersTimer);

function shoot(e) {
    let bulletId
    let currentBulletIndex = currentShooterIndex
    function moveBullets() {
    squares[currentBulletIndex].classList.remove('bullet')
    currentBulletIndex -= width
    squares[currentBulletIndex].classList.add('bullet')
    
    if ( score.innerHTML === 'GAME OVER' || score.innerHTML === 'You WIN') {
        setTimeout(() => {clearInterval(bulletId)}, 5000)
        return
    }
   

    if (squares[currentBulletIndex].classList.contains('invader')) {
        squares[currentBulletIndex].classList.remove('bullet')
        squares[currentBulletIndex].classList.remove('invader')
        squares[currentBulletIndex].classList.add('boom')
        alienKilledSound.play()

        setTimeout(() => squares[currentBulletIndex].classList.remove('boom'), 200)
        clearInterval(bulletId)

        const alienRemoved = alienInvaders.indexOf(currentBulletIndex)
        aliensRemoved.push(alienRemoved)
        results++
        score.innerHTML = results
    }
}
    switch (e.key) {
        case 'ArrowUp':
            bulletId = setInterval(moveBullets, 200)
            bulletSound.play()
    }
}

document.addEventListener('keydown', shoot)


const speedElement  = document.querySelector('.spd')
let tempSpeed = moveinvadersTimer
speedElement.innerHTML = `${((tempSpeed / 100 )).toFixed(1) } / sec`
document.querySelector('.plus').addEventListener('click', () => {
  tempSpeed += 100  
  moveinvadersTimer -= 100
  clearInterval(invadersId)
  invadersId = setInterval(moveInvaders, moveinvadersTimer)
  speedElement.innerHTML = ((tempSpeed / 100 )).toFixed(1) + ' / sec'
})

document.querySelector('.minus').addEventListener('click', () => {
    moveinvadersTimer += 100
    tempSpeed -= 100
    clearInterval(invadersId)
    invadersId = setInterval(moveInvaders, moveinvadersTimer)
    speedElement.innerHTML = ((tempSpeed / 100 )).toFixed(1) + ' / sec'
  })
