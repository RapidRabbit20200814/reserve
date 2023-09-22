<?php
  // ====================================
  //   立ち位置一覧を取得
  // ====================================

  // 外部ファイルの読み込み
  require_once('config.php');
  require_once('functions.php');

  // POST送信かどうかを確認
  // $_POSTの中身が空じゃないかを確認
  if ( $_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo 'error';
    exit();
  }

  // 例外処理
  try {
    // DBの接続
    $dbh = new PDO(DSN, DB_USER, DB_PASSWORD);

    // SQLのエラー発生時に 例外を投げる設定
    // $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 条件文の設定
    if ($_POST['deleted_flg'] == 0 ) {
      $whereClause = ' WHERE COALESCE(deleted_flg, 0) = 0';
    } else {
      $whereClause = '';
    }

    // SQLの作成（予約情報登録）
    $sql = 'SELECT *
             FROM point'
             . $whereClause .
             ' ORDER BY point_no ASC;
             ';

    // プリペアステートメントの作成
    $stmt = $dbh->prepare($sql);

    // ステートメントを実行
    $stmt->execute();

    // 実行結果を連想配列に格納
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // JSONにするデータを作る
    $response = [
      'result' => $result
    ];

    //jsonで吐き出す
    $jsonData = json_encode($response);
    if ($jsonData === false) {
        echo json_last_error_msg();
    } else {
        echo $jsonData;
    }

    // DB切断
    $dbh = null;

  } catch(PDOException $e) {
    // 例外発生時
    echo 'エラー' . h($e->getMessage());
    exit;
  }
