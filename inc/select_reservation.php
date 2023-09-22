<?php
  // ====================================
  //   ポイントIDと年月から予約日を取得する
  // ====================================

  // 外部ファイルの読み込み
  require_once('config.php');
  require_once('functions.php');

  // POST送信かどうかを確認
  // $_POSTの中身が空じゃないかを確認
  if ( $_SERVER['REQUEST_METHOD'] !== 'POST' || $_POST['point_id'] == '' ) {
    echo 'error';
    exit();
  }

  // 例外処理
  try {
    // DBの接続
    $dbh = new PDO(DSN, DB_USER, DB_PASSWORD);

    // SQLのエラー発生時に 例外を投げる設定
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // SQLの作成（予約情報登録）
    $sql = 'SELECT r.reservation_date, p.point_id
             FROM reservation AS r
             JOIN point AS p ON r.point_id = p.point_id
             WHERE r.point_id = ? AND r.reservation_date like ?
             ORDER BY r.reservation_date ASC
             ';

    // プリペアステートメントの作成
    $stmt = $dbh->prepare($sql);

    // ?に値をセット
    $stmt->bindValue(1, $_POST['point_id'], PDO::PARAM_INT);
    $stmt->bindValue(2, $_POST['month'], PDO::PARAM_STR);

    // ステートメントを実行
    $stmt->execute();

    // 実行結果を連想配列に格納
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // JSONにするデータを作る
    $response = [
      'result' => $result
    ];

    //jsonで吐き出す
    echo json_encode($response);

    // DB切断
    $dbh = null;

  } catch(PDOException $e) {
    // 例外発生時
    echo 'エラー' . h($e->getMessage());
    exit;
  }
