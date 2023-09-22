<?php
  // ====================================
  //   予約処理
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
    $sql = 'INSERT INTO reservation( point_id, reservation_date, grade, class, student_no, created ) VALUES (?, ?, ?, ?, ?, NOW())';

    // プリペアステートメントの作成
    $stmt = $dbh->prepare($sql);

    // ?に値をセット
    $stmt->bindValue(1, $_POST['point_id'], PDO::PARAM_INT);
    $stmt->bindValue(2, $_POST['reservation_date'], PDO::PARAM_STR);
    $stmt->bindValue(3, $_POST['grade'], PDO::PARAM_INT);
    $stmt->bindValue(4, $_POST['class'], PDO::PARAM_INT);
    $stmt->bindValue(5, $_POST['student_no'], PDO::PARAM_INT);

    // ステートメントを実行
    $stmt->execute();

    // 切断
    $dbh = null;
  } catch(PDOException $e) {
    // 例外発生時
    echo 'エラー' . h($e->getMessage());
    exit;
  }
