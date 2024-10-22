let score = 0;
let currentNumber = 1;
let interval;
let speed = 1000;
const speedIncrement = 0.9;
const incrementThreshold = 10;
const maxSpeed = 100;

const numberDisplay = document.getElementById('number-display');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('best-score');
const startButton = document.getElementById('start-button');
const dzik = document.getElementById('dzik');
const gameOverMessage = document.createElement('div');
let lastClickedNumber = null;
let bestScore = 0;
let clickTimeout;
let startTime;
let reactionTimeDisplay = document.getElementById('reaction-time');
let bestReactionTimeDisplay = document.getElementById('best-reaction-time');
let averageReactionTimeDisplay = document.getElementById('mid-reaction-time');

let bestReactionTime = Infinity;
let totalReactionTime = 0;
let reactionCount = 0;

function updateNumber() {
    numberDisplay.innerText = `Liczba: ${currentNumber}`;
    startTime = Date.now();
    
    if (currentNumber % 7 === 0 || String(currentNumber).includes('7')) {
        clearTimeout(clickTimeout);
        clickTimeout = setTimeout(() => {
            if (lastClickedNumber !== currentNumber) {
                gameOver();
            }
        }, speed);
    }

    currentNumber++;
    
    if ((currentNumber - 1) % incrementThreshold === 0) {
        speed = Math.max(speed * speedIncrement, maxSpeed);
        clearInterval(interval);
        interval = setInterval(updateNumber, speed);
    }
}

function startGame() {
    currentNumber = 1;
    score = 0;
    speed = 1000;
    lastClickedNumber = null;
    scoreDisplay.innerText = `Wynik: ${score}`;
    startButton.disabled = true;
    startButton.style.backgroundColor = "gray";
    interval = setInterval(updateNumber, speed);
    gameOverMessage.innerText = '';

    bestReactionTime = Infinity;
    totalReactionTime = 0;
    reactionCount = 0;
    bestReactionTimeDisplay.innerText = "Najlepszy czas reakcji: ";
    averageReactionTimeDisplay.innerText = "Średni czas reakcji: ";
}

function gameOver() {
    clearInterval(interval);
    clearTimeout(clickTimeout);
    startButton.disabled = false;
    gameOverMessage.style.color = "red";
    gameOverMessage.style.fontSize = "30px";
    gameOverMessage.innerText = 'Game Over! Kliknij przycisk, aby rozpocząć od nowa.';
    document.getElementById('game').appendChild(gameOverMessage);
    startButton.style.backgroundColor = "green";
    
    if (score > bestScore) {
        bestScore = score;
        bestScoreDisplay.innerText = `Najlepszy wynik: ${bestScore}`;
    }
    
    lastClickedNumber = null;
}

dzik.addEventListener('click', () => {
    const reactionTime = Date.now() - startTime;

    if (currentNumber > 1 && (currentNumber - 1) % 7 === 0 || String(currentNumber - 1).includes('7')) {
        if (lastClickedNumber === currentNumber) {
            gameOver();
        } else {
            score++;
            scoreDisplay.innerText = `Wynik: ${score}`;
            lastClickedNumber = currentNumber;

            clearTimeout(clickTimeout);
            reactionTimeDisplay.innerHTML = `Ostatni czas reakcji: ${reactionTime} ms`;

            if (reactionTime < bestReactionTime) {
                bestReactionTime = reactionTime;
                bestReactionTimeDisplay.innerHTML = `Najlepszy czas reakcji: ${bestReactionTime} ms`;
            }

            totalReactionTime += reactionTime;
            reactionCount++;
            const averageReactionTime = totalReactionTime / reactionCount;
            averageReactionTimeDisplay.innerHTML = `Średni czas reakcji: ${averageReactionTime.toFixed(2)} ms`;
        }
    } else {
        gameOver();
    }
});

startButton.addEventListener('click', startGame);
