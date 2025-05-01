'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0], //board[0]
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 2, 2, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0], //board[8]
  ]);
  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    const newBoard = board.map((row) => [...row]);
    const enemyColor = 3 - turnColor;
    let canSpace = false;
    const dirs = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
    ];
    if (board[y][x] === 0)
      for (const [dy, dx] of dirs) {
        let ny = y + dy;
        let nx = x + dx;
        const lineToFlip: [number, number][] = [];
        while (
          ny >= 0 &&
          ny < board.length &&
          nx >= 0 &&
          nx < board[0].length &&
          board[ny][nx] === enemyColor
        ) {
          lineToFlip.push([ny, nx]);
          ny += dy;
          nx += dx;
          if (
            ny >= 0 &&
            ny < board.length &&
            nx >= 0 &&
            nx < board[0].length &&
            board[ny][nx] === turnColor
          ) {
            for (const [fy, fx] of lineToFlip) {
              newBoard[fy][fx] = turnColor;
            }
            canSpace = true;
          }
        }
        if (canSpace) {
          newBoard[y][x] = turnColor;
          setBoard(newBoard);
          setTurnColor(enemyColor);
        }
      }
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cell} key={`${x} - ${y}`} onClick={() => clickHandler(x, y)}>
              {color === 0 ? (
                <div className={styles.canSpaceStone} />
              ) : (
                <div className={styles.stone} style={{ background: color === 1 ? '#000' : '#fff' }}>
                  <div />
                </div>
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
