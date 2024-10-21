let score = 0;
let currentNumber = 1;
let interval;
let speed = 1000; // początkowy czas w milisekundach
const speedIncrement = 0.7; // zmniejsza czas o 30%
const incrementThreshold = 20; // co 20 liczb
const maxSpeed = 100; // minimalny czas na zmiany liczby

const numberDisplay = document.getElementById('number-display');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('best-score');
const startButton = document.getElementById('start-button');
const dzik = document.getElementById('dzik');
const gameOverMessage = document.createElement('div');
let lastClickedNumber = null; // śledzenie ostatnio klikniętej liczby
let bestScore = 0; // przechowywanie najlepszego wyniku
let clickTimeout; // zmienna do przechowywania timera
let startTime; // czas rozpoczęcia reakcji
let reactionTimeDisplay = document.getElementById('reaction-time');
let bestReactionTimeDisplay = document.getElementById('best-reaction-time');
let averageReactionTimeDisplay = document.getElementById('mid-reaction-time');

let bestReactionTime = Infinity; // najlepszy czas reakcji
let totalReactionTime = 0; // suma czasów reakcji
let reactionCount = 0; // liczba reakcji

function updateNumber() {
    numberDisplay.innerText = `Liczba: ${currentNumber}`;
    startTime = Date.now(); // zapisz czas wyświetlenia liczby
    
    if (currentNumber % 7 === 0 || String(currentNumber).includes('7')) {
        dzik.classList.add('highlight');
        
        // Ustaw timer na sprawdzenie, czy gracz kliknął w ciągu 1 sekundy
        clearTimeout(clickTimeout); // czyścimy poprzedni timer
        clickTimeout = setTimeout(() => {
            if (lastClickedNumber !== currentNumber) {
                gameOver();
            }
        }, 1000); // 1 sekunda
    } else {
        dzik.classList.remove('highlight');
    }

    currentNumber++;
    
    // Zwiększ prędkość co 20 liczb
    if ((currentNumber - 1) % incrementThreshold === 0) {
        speed = Math.max(speed * speedIncrement, maxSpeed);
        clearInterval(interval);
        interval = setInterval(updateNumber, speed);
    }
}

function startGame() {
    currentNumber = 1;
    score = 0;
    speed = 1000; // reset prędkości
    lastClickedNumber = null; // reset ostatnio klikniętej liczby
    scoreDisplay.innerText = `Wynik: ${score}`;
    startButton.disabled = true;
    startButton.style.backgroundColor = "gray";
    interval = setInterval(updateNumber, speed);
    gameOverMessage.innerText = ''; // usuń komunikat o końcu gry

    // Resetowanie czasów reakcji
    bestReactionTime = Infinity;
    totalReactionTime = 0;
    reactionCount = 0;
    bestReactionTimeDisplay.innerText = "Najlepszy czas reakcji: ";
    averageReactionTimeDisplay.innerText = "Średni czas reakcji: ";
}

function gameOver() {
    clearInterval(interval);
    clearTimeout(clickTimeout); // czyścimy timer kliknięcia
    startButton.disabled = false;
    gameOverMessage.style.color = "red";
    gameOverMessage.style.fontSize = "30px";
    gameOverMessage.innerText = 'Game Over! Kliknij, aby rozpocząć od nowa.';
    document.getElementById('game').appendChild(gameOverMessage);
    startButton.style.backgroundColor = "green";
    
    // Sprawdź i zaktualizuj najlepszy wynik
    if (score > bestScore) {
        bestScore = score;
        bestScoreDisplay.innerText = `Najlepszy wynik: ${bestScore}`;
    }
    
    lastClickedNumber = null; // reset ostatnio klikniętej liczby
}

dzik.addEventListener('click', () => {
    const reactionTime = Date.now() - startTime; // oblicz czas reakcji

    if (currentNumber > 1 && (currentNumber - 1) % 7 === 0 || String(currentNumber - 1).includes('7')) {
        if (lastClickedNumber === currentNumber) {
            gameOver(); // kończymy grę, jeśli kliknięto tę samą liczbę
        } else {
            score++;
            scoreDisplay.innerText = `Wynik: ${score}`;
            lastClickedNumber = currentNumber; // zapisz ostatnią klikniętą liczbę
            
            clearTimeout(clickTimeout); 
            // Wyświetl czas reakcji
            reactionTimeDisplay.innerHTML = `Ostatni czas reakcji: ${reactionTime} ms`;

            // Aktualizuj najlepszy czas reakcji
            if (reactionTime < bestReactionTime) {
                bestReactionTime = reactionTime;
                bestReactionTimeDisplay.innerHTML = `Najlepszy czas reakcji: ${bestReactionTime} ms`;
            }

            // Oblicz średni czas reakcji
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
