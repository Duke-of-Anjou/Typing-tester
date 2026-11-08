// ---------- Sample sentence pool ----------
const quotes = [
    "The quick brown fox jumps over the lazy dog while the sun sets behind the quiet hills.",
    "Practice makes progress, not perfection, so keep your fingers moving and your eyes on the screen.",
    "JavaScript lets a web page react to every click, scroll, and keystroke a user makes.",
    "A good programmer writes code that humans can understand, not just code that computers can run.",
    "Learning to type without looking at the keyboard is one of the most useful skills you can build.",
    "Every expert was once a beginner who refused to give up when the problems got difficult."
];

const MAX_TIME = 60;

// ---------- DOM references ----------
const quoteDisplay = document.getElementById("quote-display");
const quoteInput = document.getElementById("quote-input");
const timeLeftEl = document.getElementById("time-left");
const mistakesEl = document.getElementById("mistakes");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const restartBtn = document.getElementById("restart-btn");
const modal = document.getElementById("result-modal");
const modalRestartBtn = document.getElementById("modal-restart-btn");
const finalWpmEl = document.getElementById("final-wpm");
const finalAccuracyEl = document.getElementById("final-accuracy");
const finalMistakesEl = document.getElementById("final-mistakes");

// ---------- State ----------
let timer = null;
let timeLeft = MAX_TIME;
let isTyping = false;
let mistakes = 0;
let totalTyped = 0;

// Step 1: Quote injection - split the quote into characters and wrap each in a <span>
function initGame() {
    clearInterval(timer); // prevents runaway intervals when restarting mid-test
    timer = null;
    timeLeft = MAX_TIME;
    isTyping = false;
    mistakes = 0;
    totalTyped = 0;

    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteDisplay.innerHTML = "";
    quote.split("").forEach((char) => {
        const span = document.createElement("span");
        span.innerText = char;
        quoteDisplay.appendChild(span);
    });
    quoteDisplay.querySelector("span").classList.add("active");

    quoteInput.value = "";
    quoteInput.disabled = false;
    modal.classList.add("hidden");
    updateStats();
    quoteInput.focus();
}

// Step 3: Real-time auditing - compare every typed char with its matching span
function handleInput() {
    // Step 2: First-key countdown - the timer only starts on keystroke #1
    if (!isTyping) {
        isTyping = true;
        timer = setInterval(updateTimer, 1000);
    }

    const spanArray = quoteDisplay.querySelectorAll("span");
    const userTyped = quoteInput.value.split("");
    mistakes = 0;

    spanArray.forEach((span, index) => {
        const char = userTyped[index];
        if (char == null) {
            span.className = "";
        } else if (char === span.innerText) {
            span.className = "correct";
        } else {
            span.className = "incorrect";
            mistakes++;
        }
    });

    totalTyped = Math.min(userTyped.length, spanArray.length);

    // The span at index = input length is the next character to type
    if (userTyped.length < spanArray.length) {
        spanArray[userTyped.length].classList.add("active");
    }

    updateStats();

    if (userTyped.length >= spanArray.length) {
        finishGame();
    }
}

function updateTimer() {
    timeLeft--;
    updateStats();
    if (timeLeft <= 0) {
        finishGame();
    }
}

// Telemetry math: a "word" is standardised as 5 characters
function calculateWpm() {
    const timeElapsedInMinutes = (MAX_TIME - timeLeft) / 60;
    const netWpm = Math.round(((totalTyped - mistakes) / 5) / timeElapsedInMinutes);
    if (netWpm < 0 || !isFinite(netWpm) || isNaN(netWpm)) {
        return 0;
    }
    return netWpm;
}

function calculateAccuracy() {
    if (totalTyped === 0) {
        return 100;
    }
    const correctChars = totalTyped - mistakes;
    return Math.round((correctChars / totalTyped) * 100);
}

function updateStats() {
    timeLeftEl.innerText = timeLeft;
    mistakesEl.innerText = mistakes;
    wpmEl.innerText = calculateWpm();
    accuracyEl.innerText = calculateAccuracy() + "%";
}

// Step 4: Teardown & lock
function finishGame() {
    clearInterval(timer);
    timer = null;
    quoteInput.disabled = true;

    const active = quoteDisplay.querySelector(".active");
    if (active) {
        active.classList.remove("active");
    }

    finalWpmEl.innerText = calculateWpm();
    finalAccuracyEl.innerText = calculateAccuracy() + "%";
    finalMistakesEl.innerText = mistakes;
    modal.classList.remove("hidden");
    modalRestartBtn.focus();
}

// ---------- Event listeners ----------
quoteInput.addEventListener("input", handleInput);
restartBtn.addEventListener("click", initGame);
modalRestartBtn.addEventListener("click", initGame);

// Clicking anywhere on the quote focuses the hidden-ish input layer
quoteDisplay.addEventListener("click", () => quoteInput.focus());

initGame();
