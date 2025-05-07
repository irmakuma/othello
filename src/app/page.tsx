'use client';

import { useEffect, useState } from 'react'; // useEffect をインポート
import styles from './page.module.css';

export default function Home() {
  // canSpaceMap を初期化（最初は全て false で埋める）
  // オセロ盤と同じ 8x8 のサイズで初期化
  const [canSpaceMap, setCanSpaceMap] = useState<boolean[][]>(
    Array.from({ length: 8 }, () => new Array<boolean>(8).fill(false)),
  );
  const [turnColor, setTurnColor] = useState<1 | 2>(1); // <|> は Union Type で 1 または 2 のみを許容
  const [board, setBoard] = useState<number[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  // 石を置ける場所を計算する関数
  const updateCanSpaceMap = () => {
    const H = board.length;
    const W = board[0].length;
    const newMap: boolean[][] = Array.from({ length: H }, () => new Array<boolean>(W).fill(false)); // 新しいマップを生成
    const enemyColor = 3 - turnColor;

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

    // 全てのマスについて置けるか判定
    for (let yy = 0; yy < H; yy++) {
      for (let xx = 0; xx < W; xx++) {
        // 既に石があるマスは置けない
        if (board[yy][xx] !== 0) {
          newMap[yy][xx] = false;
          continue;
        }

        // 各方向をチェック
        for (const [dy, dx] of dirs) {
          let ny = yy + dy;
          let nx = xx + dx;
          let foundEnemy = false; // 敵の石を見つけたか

          // 盤面の範囲内で、隣が敵の石である限り進む
          while (ny >= 0 && ny < H && nx >= 0 && nx < W && board[ny][nx] === enemyColor) {
            foundEnemy = true; // 敵の石を見つけた
            ny += dy;
            nx += dx;
          }

          // 敵の石を1つ以上見つけて、その先が自分の石であれば置ける
          if (
            foundEnemy && // 敵の石を見つけている
            ny >= 0 &&
            ny < H &&
            nx >= 0 &&
            nx < W &&
            board[ny][nx] === turnColor // その先が自分の石
          ) {
            newMap[yy][xx] = true; // このマス (xx, yy) は置ける場所
            // このマスが置けることが確定したので、他の方向をチェックする必要はない
            break;
          }
        }
      }
    }
    // 計算結果で canSpaceMap を更新
    setCanSpaceMap(newMap);
  };

  // board または turnColor が変わったときに置ける場所を再計算
  useEffect(() => {
    console.log('useEffect triggered. Recalculating canSpaceMap.'); // 確認用ログ
    updateCanSpaceMap();
  }, [board, turnColor]); // board または turnColor が変更されたときに実行

  // マスをクリックしたときのハンドラ
  const clickHandler = (x: number, y: number): void => {
    console.log('clicked', x, y);

    // クリックされたマスが置ける場所か判定
    if (board[y][x] === 0 && canSpaceMap[y]?.[x]) {
      console.log('Placed stone at', x, y); // 確認用ログ

      // 盤面を更新 (ここでは石を置くだけで、ひっくり返す処理はまだ含んでいません)
      // 新しい盤面を作成し、クリックされた場所に石を置く
      const newBoard = board.map((row) => [...row]); // 盤面をディープコピー
      newBoard[y][x] = turnColor;
      setBoard(newBoard); // 盤面ステートを更新

      // ターンの色を切り替え (1 -> 2, 2 -> 1)
      setTurnColor((3 - turnColor) as 1 | 2);

      // ※ ひっくり返す処理と、ひっくり返した後に次の置ける場所を計算する処理がここに追加される必要がありますが、
      //    今回は置ける場所の表示と石を置くところまでなのでスキップします。
      //    setBoard(newBoard) の後に board が更新され、useEffect が発火して次のターンの canSpaceMap が計算されます。
    } else {
      // 置けない場所がクリックされた場合
      console.log('Cannot place stone at', x, y);
      // 必要であれば、ユーザーに置けないことを伝えるなどの処理を追加
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) => (
          <div key={y} className={styles.row}>
            {row.map((color, x) => {
              // マスが空いていて、かつ canSpaceMap で置ける場所と判定されているか
              const canPlaceHere = color === 0 && canSpaceMap[y]?.[x];
              return (
                // クリックハンドラを追加
                <div key={`${y}-${x}`} className={styles.cell} onClick={() => clickHandler(x, y)}>
                  {/* 置ける場所に薄い石を表示 */}
                  {canPlaceHere && <div className={styles.canSpaceStone} />}
                  {/* 既に石がある場合に表示 */}
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
      {/* ターンの表示などを追加する場所 */}
      <div>現在のターン: {turnColor === 1 ? '黒' : '白'}</div>
    </div>
  );
}
