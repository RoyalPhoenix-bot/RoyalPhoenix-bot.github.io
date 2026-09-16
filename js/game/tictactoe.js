// Unbeatable Minimax Tic-Tac-Toe Engine
export class TicTacToe {
    constructor(onStateChange) {
      this.board = Array(9).fill(null);
      this.human = "X";
      this.marvin = "O";
      this.isGameOver = false;
      this.winningLine = null;
      this.onStateChange = onStateChange;
    }
  
    reset() {
      this.board = Array(9).fill(null);
      this.isGameOver = false;
      this.winningLine = null;
      this.notify();
    }
  
    makeHumanMove(index) {
      if (this.board[index] !== null || this.isGameOver) return false;
      this.board[index] = this.human;
  
      const winner = this.checkWinner(this.board);
      if (winner) {
        this.isGameOver = true;
        this.winningLine = winner.line;
        this.notify(winner.player);
        return true;
      }
  
      if (this.isBoardFull(this.board)) {
        this.isGameOver = true;
        this.notify("draw");
        return true;
      }
  
      this.notify();
      this.makeMarvinMove();
      return true;
    }
  
    makeMarvinMove() {
      if (this.isGameOver) return;
      const bestMove = this.getBestMove();
      if (bestMove !== undefined && bestMove !== null) {
        this.board[bestMove] = this.marvin;
        const winner = this.checkWinner(this.board);
        if (winner) {
          this.isGameOver = true;
          this.winningLine = winner.line;
          this.notify(winner.player);
        } else if (this.isBoardFull(this.board)) {
          this.isGameOver = true;
          this.notify("draw");
        } else {
          this.notify();
        }
      }
    }
  
    getBestMove() {
      let bestScore = -Infinity;
      let move = null;
      for (let i = 0; i < 9; i++) {
        if (this.board[i] === null) {
          this.board[i] = this.marvin;
          let score = this.minimax(this.board, 0, false);
          this.board[i] = null;
          if (score > bestScore) {
            bestScore = score;
            move = i;
          }
        }
      }
      return move;
    }
  
    minimax(board, depth, isMaximizing) {
      const result = this.checkWinner(board);
      if (result) {
        return result.player === this.marvin ? 10 - depth : depth - 10;
      }
      if (this.isBoardFull(board)) return 0;
  
      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
          if (board[i] === null) {
            board[i] = this.marvin;
            let score = this.minimax(board, depth + 1, false);
            board[i] = null;
            bestScore = Math.max(score, bestScore);
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
          if (board[i] === null) {
            board[i] = this.human;
            let score = this.minimax(board, depth + 1, true);
            board[i] = null;
            bestScore = Math.min(score, bestScore);
          }
        }
        return bestScore;
      }
    }
  
    checkWinner(b) {
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];
      for (let line of lines) {
        const [a, bIdx, c] = line;
        if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) {
          return { player: b[a], line };
        }
      }
      return null;
    }
  
    isBoardFull(b) {
      return b.every(cell => cell !== null);
    }
  
    notify(result = null) {
      if (this.onStateChange) {
        this.onStateChange({
          board: [...this.board],
          isGameOver: this.isGameOver,
          winningLine: this.winningLine,
          result
        });
      }
    }
  }
  