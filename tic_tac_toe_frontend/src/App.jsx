import React, { useMemo, useState } from "react";

/**
 * Returns the winning player symbol ("X" | "O") if a winner exists; otherwise null.
 * @param {(null|"X"|"O")[]} squares
 * @returns {("X"|"O"|null)}
 */
function calculateWinner(squares) {
  const lines = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) return v;
  }
  return null;
}

/**
 * Renders a single tic-tac-toe square.
 * @param {{ value: (null|"X"|"O"), onClick: () => void, disabled?: boolean }} props
 */
function Square({ value, onClick, disabled = false }) {
  const symbolClass =
    value === "X" ? "ttt-square--x" : value === "O" ? "ttt-square--o" : "";

  return (
    <button
      type="button"
      className={`ttt-square ${symbolClass}`.trim()}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Square ${value}` : "Empty square"}
    >
      {value}
    </button>
  );
}

/**
 * Renders the 3x3 board grid.
 * @param {{ squares: (null|"X"|"O")[], onPlay: (index:number) => void, disabled?: boolean }} props
 */
function Board({ squares, onPlay, disabled = false }) {
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
      {squares.map((value, idx) => (
        <Square
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
          value={value}
          disabled={disabled || Boolean(value)}
          onClick={() => onPlay(idx)}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
export default function App() {
  /** Root React component for the Tic Tac Toe game. */
  const [squares, setSquares] = useState(() => Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = useMemo(
    () => !winner && squares.every((s) => s !== null),
    [winner, squares]
  );

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return "Draw";
    return `Next player: ${xIsNext ? "X" : "O"}`;
  }, [winner, isDraw, xIsNext]);

  // PUBLIC_INTERFACE
  function handlePlay(index) {
    /** Handles a move at the given board index. */
    if (winner || squares[index] !== null) return;

    const next = squares.slice();
    next[index] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext((v) => !v);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    /** Resets the game to the initial state (empty board, X starts). */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <main className="ttt-page">
      <header className="ttt-header">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <p className="ttt-status" aria-live="polite">
          {statusText}
        </p>
      </header>

      <section className="ttt-card" aria-label="Game">
        <Board squares={squares} onPlay={handlePlay} disabled={Boolean(winner) || isDraw} />
        <div className="ttt-actions">
          <button type="button" className="ttt-reset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </section>
    </main>
  );
}
