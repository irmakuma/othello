'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    const newBoard = structuredClone(board);

    if (
      board[y + 1] ||
      board[y - 1] ||
      board[x + 1] ||
      board[x - 1] ||
      board[y - 1][x - 1] ||
      [y + 1][x + 1] ||
      [y + 1][x - 1] ||
      ([y - 1][x + 1] !== undefined && board[y + 1][x] === 3 - turnColor)
    ) {
      newBoard[y][x] = turnColor;
      setTurnColor(3 - turnColor);
      setBoard(newBoard);
    }
    // if (board[y + 1] !== undefined && board[y + 1][x] === 3 - turnColor) {
    //   newBoard[y][x] = turnColor;
    //   setTurnColor(3 - turnColor);
    //   setBoard(newBoard);
    // }
    // if (board[x + 1] !== undefined && board[y][x + 1] === 3 - turnColor) {
    //   newBoard[y][x] = turnColor;
    //   setTurnColor(3 - turnColor);
    //   setBoard(newBoard);
    // }
    // if (board[y - 1] !== undefined && board[y - 1][x] === 3 - turnColor) {
    //   newBoard[y][x] = turnColor;
    //   setTurnColor(3 - turnColor);
    //   setBoard(newBoard);
    // }
    // if (board[x - 1] !== undefined && board[y][x - 1] === 3 - turnColor) {
    //   newBoard[y][x] = turnColor;
    //   setTurnColor(3 - turnColor);
    //   setBoard(newBoard);
    // }
    // if (board[y - 1][x - 1] !== undefined && board[y - 1][x - 1] === 3 - turnColor) {
    //   newBoard[y][x] = turnColor;
    //   setTurnColor(3 - turnColor);
    //   setBoard(newBoard);
    // }
    // if (board[y + 1][x + 1] !== undefined && board[y + 1][x + 1] === 3 - turnColor) {
    //   newBoard[y][x] = turnColor;
    //   setTurnColor(3 - turnColor);
    //   setBoard(newBoard);
    // }
  };
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cell} key={`${x} - ${y}`} onClick={() => clickHandler(x, y)}>
              {color !== 0 && (
                <div
                  className={styles.stone}
                  style={{ background: color === 1 ? '#000' : '#fff' }}
                />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
