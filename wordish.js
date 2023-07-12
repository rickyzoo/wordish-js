let targetWord = null;
let guessedWord = null;
let numGuesses = 0;
const maxGuesses = 6;
const lettersRegex = /^[a-zA-Z]+$/;

// set up event listeners for the start button and guess button
document.getElementById("start_button").addEventListener("click", startGame);
document.getElementById("guess_button").addEventListener("click", makeGuess);

function startGame() {
    // get the target word from the input field
    targetWord = document.getElementById("target_text").value.toLowerCase();
    
    if (targetWord === "" || null) {
        setStatus("Enter a valid target word to start");
        return;
    }

    // check that the target word is valid
    if (!isValidWord(targetWord)) {
        setStatus("Invalid target word. 5-Lettered Words only!");
        return;
    }

    // clear any previous guesses
    guessedWord = null;
    numGuesses = 0;

    // clear the board
    clearBoard();

    // set up the game board with blank cells
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            const cell = document.getElementById(`cell_${i}_${j}`);
            cell.style.backgroundColor = "lightgray";
        }
    }
    
    setStatus("You have 6 Guesses. Good Luck!");

    // clear the target word input field
    document.getElementById("target_text").value = "";
}

function makeGuess() {

    // get the guess from the input field
    guessedWord = document.getElementById("guess_text").value.toLowerCase();

    // check that the guess is valid
    if (!isValidWord(guessedWord)) {
        setStatus("Invalid guess");
        return;
    }

    // check if the guess is correct
    if (guessedWord === targetWord) {
        updateBoard(guessedWord);
        setStatus("Congrats! You won!");
        document.getElementById("guess_text").value = '';
        
        resetGame();

        return;
    }

    // update board with the incorrect guess
    updateBoard(guessedWord);

    // check if the player used up all their guesses
    numGuesses++;
    if (numGuesses >= maxGuesses) {
        setStatus(`Sorry, you lost! The word was "${targetWord.toUpperCase()}".`);
        document.getElementById("guess_text").value = '';

        resetGame();

        return;
    }

    // show remaining guesses in status
    const guessesLeft = maxGuesses - numGuesses;
    setStatus(`Incorrect guess. ${guessesLeft} guesses left.`);

    // clear the guess input field
    document.getElementById("guess_text").value = '';

}

function isValidWord(word) {

    // check that the word contains only letters
    if (!lettersRegex.test(word)) {
        return false;
    }

    // check that the word has exactly 5 characters
    if (word.length !== 5) {
        return false;
    }
    return true;
}

function updateBoard(guessedWord) {
    const targetLettersCount = {};
    const guessLettersCount = {};
    const yellowLettersCount = {};

    // count the occurrences of each letter in the target and guess word
    for (let i = 0; i < 5; i++) {
        const targetLetter = targetWord.charAt(i);
        const guessLetter = guessedWord.charAt(i);

        targetLettersCount[targetLetter] = (targetLettersCount[targetLetter] || 0) + 1;
        guessLettersCount[guessLetter] = (guessLettersCount[guessLetter] || 0) + 1;
    }

    // identify the letters that should be marked yellow
    for (const letter in guessLettersCount) {
        const targetCount = targetLettersCount[letter] || 0;
        const guessCount = guessLettersCount[letter];

        if (targetCount > 0 && targetCount === guessCount) {
            yellowLettersCount[letter] = targetCount;
        } else if (targetCount > 0 && targetCount < guessCount) {
            yellowLettersCount[letter] = Math.min(guessCount, targetCount);
        }
    }

    // update the guessed letters on the game board
    for (let i = 0; i < 5; i++) {
        const letter = guessedWord.charAt(i);
        const cell = document.getElementById(`cell_${numGuesses}_${i}`);
        
        if (letter === targetWord.charAt(i)) {
            cell.style.backgroundColor = "green";
            yellowLettersCount[letter]--;
        } else if (yellowLettersCount[letter] > 0) {
            cell.style.backgroundColor = "yellow";
            yellowLettersCount[letter]--;
        } else {
            cell.style.backgroundColor = "lightgray";
        }

        cell.innerHTML = letter.toUpperCase();
    }
}

function clearBoard() {
    // clear the board by resetting the cell colors and contents
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            const cell = document.getElementById(`cell_${i}_${j}`);
            cell.style.backgroundColor = "lightgray";
            cell.innerHTML = '';
        }
    }
}

function resetGame() {
    // reset the game state and clear the board
    targetWord = null;
    guessedWord = null;
    numGuesses = 0;
    // clearBoard();
}

function setStatus(message) {

    // update the status message
    const statusElement = document.getElementById("status");
    statusElement.value = message;
}

