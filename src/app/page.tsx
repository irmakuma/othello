'use client';

import { useState } from 'react';
import styles from './page.module.css';
// この下のuseeffectについての解説を後で見る
import { useEffect } from 'react'

export default function Home() {
  const [canSpaceMap, setCanSpaceMap] = useState<boolean[][]>([]);
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0], //board[0]
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0], //board[8]
  ]);
  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
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
    const updateCanSpaceMap = () => {
      const H = board.length, W = board[0].length;
      const map: boolean[][] = Array.from(
        { length: H },
        ():boolean[] => Array(W).fill(false)
      );
      for (let yy = 0; yy < H; yy++) {
        for (let xx = 0; xx < W; xx++) {
          if (board[yy][xx] !== 0) {
            map[yy][xx] = false
            continue
          }
        for (const [dy, dx] of dirs) {
          let ny = yy + dy;
          let nx = xx + dx;
          let foundEnemy = false
          while (
            ny >= 0 &&
            ny < board.length &&
            nx >= 0 &&
            nx < board[0].length &&
            board[ny][nx] === enemyColor
          ) {
            foundEnemy = true
            ny += dy;
            nx += dx;
            if (
              foundEnemy&&
              ny >= 0 &&
              ny < H &&
              nx >= 0 &&
              nx < W &&
              board[ny][nx] === turnColor
            ) {
              canSpace=true
              break
              }

          }
          map[yy][xx]=canSpace
        }
      }
      setCanSpaceMap(Map)
    }

return (
  <div className={styles.container}>
    <div className={styles.board}>
       {board.map((row, y) =>
        <div key={y} className={styles.row}>
          {row.map((color, x) => {
            const canPlaceHere = color === 0 && canSpaceMap[y]?.[x];
            return (
              <div
                key={`${y}-${x}`}
                className={styles.cell}
                onClick={() => clickHandler(x, y)}
              >
                {canPlaceHere && (
                  <div className={styles.canSpaceStone} />
                )}
                {color !== 0 && (
                  <div
                    className={styles.stone}
                    style={{ background: color === 1 ? '#000' : '#fff' }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
 </div>
  )}}
