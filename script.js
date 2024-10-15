let score = 0;
let currentNumber = 1;
let interval;
let speed = 1000; // początkowy czas w milisekundach
const speedIncrement = 0.7; // zmniejsza czas o 30%
const incrementThreshold = 20; // co 20 liczb
const maxSpeed = 100; // minimalny czas na zmiany liczby

const numberDisplay = document.getElementById('number-display');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('best-score'); // wyświetlanie najlepszego wyniku
const startButton = document.getElementById('start-button');
const dzik = document.getElementById('dzik');
const gameOverMessage = document.createElement('div');
let lastClickedNumber = null; // śledzenie ostatnio klikniętej liczby
let bestScore = 0; // przechowywanie najlepszego wyniku
let clickTimeout; // zmienna do przechowywania timera

function updateNumber() {
    numberDisplay.innerText = `Liczba: ${currentNumber}`;
    
    if (currentNumber % 7 === 0 || String(currentNumber).includes('7')) {
        dzik.classList.add('highlight');
        
        // Ustaw timer na sprawdzenie, czy gracz kliknął w ciągu 2 sekund
        clearTimeout(clickTimeout); // czyścimy poprzedni timer
        clickTimeout = setTimeout(() => {
            gameOver();
        }, 2000); // 2 sekundy
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
    interval = setInterval(updateNumber, speed);
    gameOverMessage.innerText = ''; // usuń komunikat o końcu gry
}

function gameOver() {
    clearInterval(interval);
    clearTimeout(clickTimeout); // czyścimy timer kliknięcia
    startButton.disabled = false;
    gameOverMessage.innerText = 'Game Over! Kliknij, aby rozpocząć od nowa.';
    document.getElementById('game').appendChild(gameOverMessage);
    
    // Sprawdź i zaktualizuj najlepszy wynik
    if (score > bestScore) {
        bestScore = score;
        bestScoreDisplay.innerText = `Najlepszy wynik: ${bestScore}`;
    }
    
    lastClickedNumber = null; // reset ostatnio klikniętej liczby
}

dzik.addEventListener('click', () => {
    if (currentNumber > 1 && (currentNumber - 1) % 7 === 0 || String(currentNumber - 1).includes('7')) {
        if (lastClickedNumber === currentNumber) {
            gameOver(); // kończymy grę, jeśli kliknięto tę samą liczbę
        } else {
            score++;
            scoreDisplay.innerText = `Wynik: ${score}`;
            lastClickedNumber = currentNumber; // zapisz ostatnią klikniętą liczbę
            
            clearTimeout(clickTimeout); // resetujemy timer po poprawnym kliknięciu
        }
    } else {
        gameOver();
    }
});

startButton.addEventListener('click', startGame);

