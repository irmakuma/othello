'use client';

import { useCallback, useEffect, useState } from 'react';
import styles from './page.module.css';

type StoneColor = 0 | 1 | 2;

export default function Home() {
  const [canSpaceMap, setCanSpaceMap] = useState<boolean[][]>(
    Array.from({ length: 8 }, () => new Array<boolean>(8).fill(false)),
  );

  const [turnColor, setTurnColor] = useState<1 | 2>(1);

  const [board, setBoard] = useState<StoneColor[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const updateCanSpaceMap = useCallback(() => {
    const H = board.length;
    const W = board[0].length;
    const newMap: boolean[][] = Array.from({ length: H }, () => new Array<boolean>(W).fill(false));
    const enemyColor = (3 - turnColor) as StoneColor;

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

    for (let yy = 0; yy < H; yy++) {
      for (let xx = 0; xx < W; xx++) {
        if (board[yy][xx] !== 0) {
          newMap[yy][xx] = false;
          continue;
        }

        for (const [dy, dx] of dirs) {
          let ny = yy + dy;
          let nx = xx + dx;
          let foundEnemy = false;

          while (ny >= 0 && ny < H && nx >= 0 && nx < W && board[ny][nx] === enemyColor) {
            foundEnemy = true;
            ny += dy;
            nx += dx;
          }
          if (foundEnemy && ny >= 0 && ny < H && nx >= 0 && nx < W && board[ny][nx] === turnColor) {
            newMap[yy][xx] = true;
            break;
          }
        }
      }
    }

    const canPlaceAnywhere = newMap.some((row) => {
      return row.some((canPlace) => canPlace === true);
    });

    if (!canPlaceAnywhere) {
      console.log(`${turnColor === 1 ? '黒' : '白'} は置ける場所がないのでパスします。`);
      setTurnColor((3 - turnColor) as 1 | 2);
    }

    setCanSpaceMap(newMap);
  }, [board, turnColor, setCanSpaceMap]);
  useEffect(() => {
    updateCanSpaceMap();
  }, [board, turnColor, updateCanSpaceMap]);

  const clickHandler = (x: number, y: number): void => {
    console.log('clicked', x, y);

    if (board[y][x] === 0 && canSpaceMap[y]?.[x]) {
      const newBoard = board.map((row) => [...row]);
      const enemyColor = (3 - turnColor) as StoneColor;

      newBoard[y][x] = turnColor;

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

      for (const [dy, dx] of dirs) {
        const flippedStonesInDir: { y: number; x: number }[] = [];
        let ny = y + dy;
        let nx = x + dx;

        while (
          ny >= 0 &&
          ny < board.length &&
          nx >= 0 &&
          nx < board[0].length &&
          newBoard[ny][nx] === enemyColor
        ) {
          flippedStonesInDir.push({ y: ny, x: nx });
          ny += dy;
          nx += dx;
        }
        if (
          ny >= 0 &&
          ny < board.length &&
          nx >= 0 &&
          nx < board[0].length &&
          newBoard[ny][nx] === turnColor &&
          flippedStonesInDir.length > 0
        ) {
          flippedStonesInDir.forEach((stone) => {
            newBoard[stone.y][stone.x] = turnColor;
          });
        }
      }

      setBoard(newBoard);

      setTurnColor((3 - turnColor) as 1 | 2);
    } else {
      console.log('Cannot place stone at', x, y);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.turnDisplay}>現在のターン: {turnColor === 1 ? '黒' : '白'}</div>

      <div className={styles.board}>
        {board.map((row, y) => (
          <div key={y} className={styles.row}>
            {row.map((color, x) => {
              const canPlaceHere = color === 0 && canSpaceMap[y]?.[x];
              return (
                <div key={`${y}-${x}`} className={styles.cell} onClick={() => clickHandler(x, y)}>
                  {canPlaceHere && <div className={styles.canSpaceStone} />}

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
        ))}
      </div>
    </div>
  );
}
