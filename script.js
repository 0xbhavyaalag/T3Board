const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
const status = document.getElementById('status');
const restartButton = document.getElementById('restartButton');
const resetScoreButton = document.getElementById('resetScoreButton');
const startGameBtn = document.getElementById('startGameBtn');
const playerSetup = document.getElementById('playerSetup');
const gameArea = document.getElementById('gameArea');
const playerXInput = document.getElementById('playerX');
const playerOInput = document.getElementById('playerO');
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');

const X_CLASS = 'x';
const O_CLASS = 'o';
let isXTurn = true;
let scores = { x: 0, o: 0 };
let playerNames = { x: 'Player X', o: 'Player O' };

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

// Sound effects
const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');
const drawSound = document.getElementById('drawSound');

startGameBtn.addEventListener('click', () => {
    const playerXName = playerXInput.value.trim() || 'Player X';
    const playerOName = playerOInput.value.trim() || 'Player O';
    
    playerNames.x = playerXName;
    playerNames.o = playerOName;
    
    document.querySelector('#scoreX .player-name').textContent = playerXName;
    document.querySelector('#scoreO .player-name').textContent = playerOName;
    
    playerSetup.style.display = 'none';
    gameArea.style.display = 'block';
    
    startGame();
});

function startGame() {
    isXTurn = true;
    cells.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.classList.remove('winning');
        cell.textContent = '';
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    updateStatus();
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = isXTurn ? X_CLASS : O_CLASS;
    
    // Play click sound
    clickSound.currentTime = 0;
    clickSound.play();
    
    // Place Mark
    placeMark(cell, currentClass);

    // Check For Win
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        // Switch Turns
        isXTurn = !isXTurn;
        updateStatus();
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.textContent = currentClass.toUpperCase();
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        const isWinning = combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
        
        if (isWinning) {
            // Highlight winning cells
            combination.forEach(index => {
                cells[index].classList.add('winning');
            });
        }
        
        return isWinning;
    });
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function endGame(draw) {
    if (draw) {
        status.textContent = "It's a draw!";
        drawSound.currentTime = 0;
        drawSound.play();
    } else {
        const winner = isXTurn ? 'x' : 'o';
        scores[winner]++;
        updateScores();
        status.textContent = `${playerNames[winner]} wins!`;
        winSound.currentTime = 0;
        winSound.play();
    }
    cells.forEach(cell => {
        cell.removeEventListener('click', handleClick);
    });
}

function updateStatus() {
    const currentPlayer = isXTurn ? 'x' : 'o';
    status.textContent = `${playerNames[currentPlayer]}'s turn`;
}

function updateScores() {
    document.querySelector('#scoreX .score-value').textContent = scores.x;
    document.querySelector('#scoreO .score-value').textContent = scores.o;
}

restartButton.addEventListener('click', startGame);

resetScoreButton.addEventListener('click', () => {
    scores = { x: 0, o: 0 };
    updateScores();
    startGame();
}); 