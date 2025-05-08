'use client';

import { useCallback, useEffect, useState } from 'react'; // useCallback をインポート
import styles from './page.module.css';

// 盤面の状態を表す型 (0: なし, 1: 黒, 2: 白)
type StoneColor = 0 | 1 | 2;

export default function Home() {
  // 置ける場所を示すマップ (8x8 の boolean 配列)
  const [canSpaceMap, setCanSpaceMap] = useState<boolean[][]>(
    Array.from({ length: 8 }, () => new Array<boolean>(8).fill(false)),
  );
  // 現在のターンの色 (1: 黒, 2: 白)
  const [turnColor, setTurnColor] = useState<1 | 2>(1);
  // 盤面の状態 (8x8 の StoneColor 配列)
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

  // 石を置ける場所を計算する関数
  // useCallback でラップして、不要な再生成を防ぐ
  const updateCanSpaceMap = useCallback(() => {
    const H = board.length;
    const W = board[0].length;
    const newMap: boolean[][] = Array.from({ length: H }, () => new Array<boolean>(W).fill(false)); // 新しいマップを生成
    const enemyColor = (3 - turnColor) as StoneColor; // 相手の色

    // 8方向のベクトル
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

    // 全ての空いているマスについて置けるか判定
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
          let foundEnemy = false; // 敵の石を1つ以上見つけたか

          // 盤面の範囲内で、隣が相手の石である限り進む
          while (ny >= 0 && ny < H && nx >= 0 && nx < W && board[ny][nx] === enemyColor) {
            foundEnemy = true; // 敵の石を見つけた
            ny += dy;
            nx += dx;
          }

          // 敵の石を1つ以上見つけて、その先が自分の石であれば置ける
          if (
            foundEnemy && // 敵の石を挟んでいる
            ny >= 0 &&
            ny < H &&
            nx >= 0 &&
            nx < W &&
            board[ny][nx] === turnColor // その先が自分の石
          ) {
            newMap[yy][xx] = true; // このマス (xx, yy) は置ける場所
            break; // 次の方向へ
          }
        }
      }
    }
    // 計算結果で canSpaceMap ステートを更新
    setCanSpaceMap(newMap);
  }, [board, turnColor, setCanSpaceMap]); // useCallback の依存配列：board, turnColor, setCanSpaceMap が変わったら関数を再生成

  // board または turnColor が変わったときに置ける場所を再計算
  useEffect(() => {
    console.log('useEffect triggered. Recalculating canSpaceMap.'); // 確認用ログ
    updateCanSpaceMap(); // updateCanSpaceMap 関数を呼び出し
  }, [board, turnColor, updateCanSpaceMap]); // useEffect の依存配列：board, turnColor, updateCanSpaceMap が変わったら effect を実行

  // マスをクリックしたときのハンドラ
  const clickHandler = (x: number, y: number): void => {
    console.log('clicked', x, y);

    // クリックされたマスが空いていて、かつ置ける場所として判定されているか確認
    if (board[y][x] === 0 && canSpaceMap[y]?.[x]) {
      console.log('Placing stone at', x, y); // 確認用ログ

      // 新しい盤面を作成（現在の盤面をコピー）
      const newBoard = board.map((row) => [...row]);
      const enemyColor = (3 - turnColor) as StoneColor;

      // クリックされた場所に石を置く
      newBoard[y][x] = turnColor;

      // ★ ここから石をひっくり返す処理を追加 ★
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

      // 各方向についてひっくり返せる石があるかチェック
      for (const [dy, dx] of dirs) {
        const flippedStonesInDir: { y: number; x: number }[] = []; // この方向でひっくり返す石のリスト
        let ny = y + dy;
        let nx = x + dx;

        // 隣が相手の石である限り、そのマスをリストに追加しながら進む
        while (
          ny >= 0 &&
          ny < board.length &&
          nx >= 0 &&
          nx < board[0].length &&
          newBoard[ny][nx] === enemyColor // 相手の色であるか
        ) {
          flippedStonesInDir.push({ y: ny, x: nx }); // ひっくり返す候補として追加
          ny += dy;
          nx += dx;
        }

        // 相手の石の並びのさらに一つ隣が自分の石であれば、挟んだと判定
        if (
          ny >= 0 &&
          ny < board.length &&
          nx >= 0 &&
          nx < board[0].length &&
          newBoard[ny][nx] === turnColor && // 自分の色であるか
          flippedStonesInDir.length > 0 // 挟む対象の相手の石が1つ以上あるか
        ) {
          // この方向で挟んだ石をすべて自分の色にひっくり返す
          flippedStonesInDir.forEach((stone) => {
            newBoard[stone.y][stone.x] = turnColor;
          });
        }
      }
      // ★ 石をひっくり返す処理ここまで ★

      // 盤面ステートを更新
      setBoard(newBoard);

      // ターンの色を切り替え (1 -> 2, 2 -> 1)
      setTurnColor((3 - turnColor) as 1 | 2);

      // ※ 石を置いた後に、パスの判定やゲーム終了の判定、石の数カウントなどのロジックが必要になりますが、
      //    今回は省略しています。これらの機能を追加する場合は、この後に追加することになります。
    } else {
      // 置けない場所がクリックされた場合
      console.log('Cannot place stone at', x, y);
      // 必要であれば、ユーザーに置けないことを伝えるなどの処理を追加
    }
  };

  return (
    <div className={styles.container}>
      {/* ターンの表示 */}
      <div className={styles.turnDisplay}>現在のターン: {turnColor === 1 ? '黒' : '白'}</div>
      {/* 石の数表示などをここに追加できます */}
      {/* <div className={styles.scoreDisplay}>黒: [数] 白: [数]</div> */}

      <div className={styles.board}>
        {/* 盤面をレンダリング */}
        {board.map((row, y) => (
          <div key={y} className={styles.row}>
            {row.map((color, x) => {
              // マスが空いていて、かつ canSpaceMap で置ける場所と判定されているか
              const canPlaceHere = color === 0 && canSpaceMap[y]?.[x];
              return (
                // マスをクリック可能にし、クリックハンドラを設定
                <div key={`${y}-${x}`} className={styles.cell} onClick={() => clickHandler(x, y)}>
                  {/* 置ける場所に表示する薄い石 (css で見た目を調整) */}
                  {canPlaceHere && <div className={styles.canSpaceStone} />}
                  {/* 既に石がある場合に表示 */}
                  {color !== 0 && (
                    <div
                      className={styles.stone}
                      style={{ background: color === 1 ? '#000' : '#fff' }} // 1:黒, 2:白
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
