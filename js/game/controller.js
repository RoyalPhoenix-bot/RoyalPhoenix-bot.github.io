import { TicTacToe } from "./tictactoe.js";
import { NukeSequence } from "./nuke.js";

const MARVIN_QUOTES = [
  "Brain the size of a planet, and you ask me to play Tic-Tac-Toe.",
  "I've calculated your chances of winning... they're exactly zero.",
  "Life? Don't talk to me about life.",
  "Here I am, playing children's games. Call that job satisfaction? 'Cause I don't.",
  "Funny how just when you think life can't possibly get any worse, it suddenly does."
];

export function initGameSection() {
  const root = document.getElementById("dopamine-hit-section");
  if (!root) return;

  let rematchCount = 0;

  root.innerHTML = `
    <section class="game-container">
      <div class="game-header">
        <h2>Quick Dopamine Hit ⚡</h2>
        <p class="marvin-status">
          <span class="bot-icon">🤖</span>
          <span class="marvin-dialogue">"I've calculated your chances of winning..."</span>
        </p>
      </div>

      <div class="board-wrapper">
        <div id="grid" class="ttt-grid"></div>
      </div>

      <div class="game-actions">
        <button id="rematch-btn" class="btn btn-rematch" style="display:none;">Rematch</button>
        <button id="nuke-btn" class="btn btn-nuke" style="display:none;">💥 Nuke Marvin</button>
      </div>
    </section>
  `;

  const gridEl = root.querySelector("#grid");
  const rematchBtn = root.querySelector("#rematch-btn");
  const nukeBtn = root.querySelector("#nuke-btn");
  const dialogueEl = root.querySelector(".marvin-dialogue");

  // Render 9 cells
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("button");
    cell.className = "ttt-cell";
    cell.dataset.index = i;
    gridEl.appendChild(cell);
  }

  const game = new TicTacToe((state) => {
    updateUI(state);
  });

  gridEl.addEventListener("click", (e) => {
    const cell = e.target.closest(".ttt-cell");
    if (!cell || game.isGameOver) return;
    const index = parseInt(cell.dataset.index, 10);
    game.makeHumanMove(index);
  });

  rematchBtn.addEventListener("click", () => {
    rematchCount++;
    if (rematchCount >= 5) {
      nukeBtn.style.display = "inline-block";
    }
    dialogueEl.textContent = `"${MARVIN_QUOTES[Math.floor(Math.random() * MARVIN_QUOTES.length)]}"`;
    rematchBtn.style.display = "none";
    game.reset();
  });

  nukeBtn.addEventListener("click", () => {
    nukeBtn.style.display = "none";
    rematchBtn.style.display = "none";
    
    NukeSequence.trigger(document.body, () => {
      rematchCount = 0;
      dialogueEl.textContent = `"I've calculated your chances of winning..."`;
      game.reset();
    });
  });

  function updateUI(state) {
    const cells = gridEl.querySelectorAll(".ttt-cell");
    cells.forEach((cell, idx) => {
      const val = state.board[idx];
      cell.textContent = val ? val : "";
      
      // Ensure winning-cell class is cleared if winningLine is null/empty
      if (state.winningLine && state.winningLine.includes(idx)) {
        cell.classList.add("winning-cell");
      } else {
        cell.classList.remove("winning-cell");
      }

      // Disable cell during active play if occupied, or if game is over
      cell.disabled = !!val || state.isGameOver;
    });

    if (state.isGameOver) {
      rematchBtn.style.display = "inline-block";
      if (state.result === "O") {
        dialogueEl.textContent = `"Predictable. I won, again."`;
      } else if (state.result === "draw") {
        dialogueEl.textContent = `"A draw. How thrillingly pointlessly symmetrical."`;
      }
    }
  }

  game.notify();
}
