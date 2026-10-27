const cardFaces = [
  { name: "HTML5", image: "assets/img/html.svg" },
  { name: "CSS3", image: "assets/img/css.svg" },
  { name: "JavaScript", image: "assets/img/javascript.svg" },
  { name: "Python", image: "assets/img/python.svg" },
  { name: "Terminal", image: "assets/img/terminal.svg" },
  { name: "Git", image: "assets/img/git.svg" },
  { name: "Banco de dados", image: "assets/img/banco-de-dados.svg" },
  { name: "Código", image: "assets/img/chaves.svg" }
];

const board = document.querySelector("#board");
const movesLabel = document.querySelector("#moves");
const timeLabel = document.querySelector("#time");
const statusLabel = document.querySelector("#status");
const restartButton = document.querySelector("#restart");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let seconds = 0;
let timer = null;
let started = false;

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
}

function startTimer() {
  if (started) return;
  started = true;
  timer = setInterval(() => {
    seconds += 1;
    timeLabel.textContent = formatTime(seconds);
  }, 1000);
}

function makeCard(face, index) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card";
  card.dataset.name = face.name;
  card.setAttribute("aria-label", `Carta ${index + 1}, escondida`);
  card.innerHTML = `<span class="back" aria-hidden="true">?</span>
    <img src="${face.image}" alt="${face.name}" draggable="false">`;
  card.addEventListener("click", () => flipCard(card));
  return card;
}

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains("matched") ||
      card.classList.contains("flipped")) return;

  startTimer();
  card.classList.add("flipped");
  card.setAttribute("aria-label", card.dataset.name);
  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves += 1;
  movesLabel.textContent = moves;
  lockBoard = true;

  if (firstCard.dataset.name === secondCard.dataset.name) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedPairs += 1;
    resetTurn();
    if (matchedPairs === cardFaces.length) {
      clearInterval(timer);
      statusLabel.textContent = `Você venceu em ${moves} movimentos e ${formatTime(seconds)}!`;
    } else {
      statusLabel.textContent = "Par encontrado! Continue assim.";
    }
  } else {
    statusLabel.textContent = "Não foi dessa vez. Tente novamente!";
    setTimeout(() => {
      [firstCard, secondCard].forEach(card => {
        card.classList.remove("flipped");
        card.setAttribute("aria-label", "Carta escondida");
      });
      resetTurn();
    }, 850);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function startGame() {
  clearInterval(timer);
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  moves = 0;
  matchedPairs = 0;
  seconds = 0;
  started = false;
  movesLabel.textContent = "0";
  timeLabel.textContent = "00:00";
  statusLabel.textContent = "Vire duas cartas para começar.";
  board.replaceChildren();
  const deck = shuffle([...cardFaces, ...cardFaces]);
  deck.forEach((face, index) => board.appendChild(makeCard(face, index)));
}

restartButton.addEventListener("click", startGame);
startGame();
