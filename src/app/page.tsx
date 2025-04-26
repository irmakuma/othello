'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0], //board[0]
    [0, 1, 0, 0, 0, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0], //board[8]
  ]);
  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    const newBoard = structuredClone(board);
    const enemyColor = 3 - turnColor;
    let canSpace = false;
    const height = board.length;
    const width = board[0].length;

    //up_ok
    if (y > 0 && board[y - 1]?.[x] === enemyColor) {
      canSpace = true;
    }
    //down_ok
    if (y < height - 1 && board[y + 1]?.[x] === enemyColor) {
      canSpace = true;
    }
    //right_ok
    if (x < width - 1 && board[y]?.[x + 1] === enemyColor) {
      canSpace = true;
    }
    //left_ok
    if (x > 0 && board[y]?.[x - 1] === enemyColor) {
      canSpace = true;
    }
    //left_down_ok
    if (y < height - 1 && x > 0 && board[y + 1]?.[x - 1] === enemyColor) {
      canSpace = true;
    }
    //left_up_ok
    if (y > 0 && x > 0 && board[y - 1]?.[x - 1] === enemyColor) {
      canSpace = true;
    }
    //right_down_ok
    if (y < height - 1 && x < width - 1 && board[y + 1]?.[x + 1] === enemyColor) {
      canSpace = true;
    }
    //right_up_ok
    if (y > 0 && x < width - 1 && board[y - 1]?.[x + 1] === enemyColor) {
      canSpace = true;
    }
    if (canSpace) {
      newBoard[y][x] = turnColor;
      setBoard(newBoard);
      setTurnColor(enemyColor);
    }
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
