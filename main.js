let score = 0;
let lives = 3;
let timeLeft = 10;
let level = 1;
let correctAnswer;
let timerInterval;

const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const submitBtn = document.getElementById("submit");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const timerEl = document.getElementById("timer");
const messageEl = document.getElementById("message");
const progressBar = document.getElementById("progress-bar");
const bgMusic = document.getElementById("bg-music");

// 🔊 Load sound effects
const soundCorrect = new Audio("assets/sounds/correct.mp3");
const soundWrong = new Audio("assets/sounds/wrong.mp3");
const soundGameOver = new Audio("assets/sounds/gameover.mp3");

// ================================
// 🔢 Generate Soal
// ================================
function generateQuestion() {
  clearInterval(timerInterval);

  const maxNumber = level * 10;
  const ops = ["+", "-", "×", "÷"];
  const op = ops[Math.floor(Math.random() * ops.length)];

  let num1, num2;

  if (op === "+") {
    num1 = Math.floor(Math.random() * maxNumber) + 1;
    num2 = Math.floor(Math.random() * maxNumber) + 1;
    correctAnswer = num1 + num2;
    questionEl.textContent = `${num1} + ${num2} = ?`;
  } else if (op === "-") {
    num1 = Math.floor(Math.random() * maxNumber) + 1;
    num2 = Math.floor(Math.random() * maxNumber) + 1;
    if (num1 < num2) [num1, num2] = [num2, num1];
    correctAnswer = num1 - num2;
    questionEl.textContent = `${num1} - ${num2} = ?`;
  } else if (op === "×") {
    num1 = Math.floor(Math.random() * maxNumber) + 1;
    num2 = Math.floor(Math.random() * maxNumber) + 1;
    correctAnswer = num1 * num2;
    questionEl.textContent = `${num1} × ${num2} = ?`;
  } else {
    num2 = Math.floor(Math.random() * Math.max(1, Math.floor(maxNumber / 2))) + 1;
    const quotient = Math.floor(Math.random() * maxNumber) + 1;
    num1 = num2 * quotient;
    correctAnswer = quotient;
    questionEl.textContent = `${num1} ÷ ${num2} = ?`;
  }

  answerEl.value = "";
  startTimer();
}

// ================================
// ⏱️ Timer
// ================================
function startTimer() {
  timeLeft = 10;
  timerEl.textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleWrong();
    }
  }, 1000);
}

// ================================
// ✅ Jawaban Benar
// ================================
function handleCorrect() {
  try { soundCorrect.play(); } catch (e) {}
  messageEl.textContent = "✅ Benar!";
  messageEl.style.color = "#00b894";
  score += 10;
  scoreEl.textContent = score;
  showScorePopup(10);

  if (score % 50 === 0) {
    level++;
    messageEl.textContent = `🚀 Naik Level! Level ${level}`;
    questionEl.textContent = `🚀 Level Up! Level ${level}`;
    questionEl.style.animation = "levelUp 0.6s ease";
    setTimeout(() => (questionEl.style.animation = ""), 600);
  }

  updateProgress();
  animateEffect("#00b894");
  generateQuestion();
}

// ================================
// ❌ Jawaban Salah
// ================================
function handleWrong() {
  try { soundWrong.play(); } catch (e) {}
  messageEl.textContent = "❌ Salah!";
  messageEl.style.color = "#d63031";
  lives--;
  livesEl.textContent = lives;
  animateEffect("#d63031");

  if (lives <= 0) {
    gameOver();
  } else {
    updateProgress();
    generateQuestion();
  }
}

// ================================
// 🌈 Efek Background
// ================================
function animateEffect(color) {
  document.body.style.background = `linear-gradient(135deg, ${color}, #ffeaa7)`;
  setTimeout(() => {
    document.body.style.background = `linear-gradient(135deg, #a8edea, #fed6e3)`;
  }, 300);
}

// ================================
// ✨ Efek +10
// ================================
function showScorePopup(points) {
  const popup = document.getElementById("score-popup");
  popup.textContent = `+${points}`;
  popup.style.opacity = "1";
  popup.style.transform = "translate(-50%, -60%)";
  setTimeout(() => {
    popup.style.opacity = "0";
    popup.style.transform = "translate(-50%, -50%)";
  }, 600);
}

// ================================
// 🔘 Tombol Submit
// ================================
submitBtn.addEventListener("click", () => {
  if (bgMusic.paused) bgMusic.play(); // mulai musik saat pertama klik
  const userAnswer = Number(answerEl.value);
  if (isNaN(userAnswer)) return;
  clearInterval(timerInterval);

  if (userAnswer === correctAnswer) {
    handleCorrect();
  } else {
    handleWrong();
  }
});

answerEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitBtn.click();
});

// ================================
// 📊 Progress Bar
// ================================
function updateProgress() {
  const progress = (score % 50) / 50 * 100;
  progressBar.style.width = `${progress}%`;
}

// ================================
// 💀 Game Over
// ================================
function gameOver() {
  try { soundGameOver.play(); } catch (e) {}
  clearInterval(timerInterval);
  questionEl.textContent = "💀 Game Over!";
  messageEl.textContent = `Final Score: ${score} (Level ${level})`;
  submitBtn.disabled = true;
  answerEl.disabled = true;
  progressBar.style.width = "0%";
  showNamePopup();
}

// ================================
// 🏆 Leaderboard System
// ================================
function saveScore(name, score, level) {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ name, score, level });
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  updateLeaderboard();
}

function updateLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const tbody = document.querySelector("#leaderboard tbody");
  tbody.innerHTML = "";

  leaderboard.slice(0, 5).forEach((entry, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.name}</td>
      <td>${entry.score}</td>
      <td>${entry.level}</td>
    `;
    if (index === 0) {
      tr.style.fontWeight = "bold";
      tr.style.color = "#00b894";
      tr.style.background = "#e8fdf3";
    }
    tbody.appendChild(tr);
  });
}

// ================================
// ✏️ Popup Input Nama
// ================================
function showNamePopup() {
  const popup = document.getElementById("name-popup");
  const input = document.getElementById("player-name");
  const saveBtn = document.getElementById("save-name");

  popup.style.display = "flex";
  input.value = "";
  input.focus();

  // 🖱️ Klik tombol
  saveBtn.onclick = savePlayerName;
  // ⌨️ Tekan Enter
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") savePlayerName();
  });

  function savePlayerName() {
    const name = input.value.trim();
    if (name) {
      saveScore(name, score, level);
      popup.style.display = "none";
    }
  }
}


// ================================
// 🔘 Reset Leaderboard
// ================================
const resetBtn = document.getElementById("reset-leaderboard");
if (resetBtn) {
  resetBtn.addEventListener("click", showResetPopup);
}

function showResetPopup() {
  const popup = document.getElementById("reset-popup");
  const confirmBtn = document.getElementById("confirm-reset");
  const cancelBtn = document.getElementById("cancel-reset");
  popup.style.display = "flex";

  confirmBtn.onclick = () => {
    localStorage.removeItem("leaderboard");
    updateLeaderboard();
    popup.style.display = "none";
  };

  cancelBtn.onclick = () => {
    popup.style.display = "none";
  };
}


// ================================
// 🚀 Start Game
// ================================
updateLeaderboard();
updateProgress();
generateQuestion();
