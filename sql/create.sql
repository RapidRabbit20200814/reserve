-- データベースの作成
CREATE DATABASE safety_db DEFAULT CHARACTER SET UTF8;

-- データベースの変更
USE safety_db;

-- 予約管理テーブルの作成
CREATE TABLE reservation (
  id int(10) unsigned zerofill primary key auto_increment,
  point_id tinyint unsigned not null,
  reservation_date date not null,
  grade tinyint unsigned not null,
  class tinyint unsigned not null,
  student_no tinyint unsigned not null,
  created datetime
) engine=InnoDB default charset=utf8;

-- 立ち位置管理テーブルの作成
CREATE TABLE point (
  point_id tinyint unsigned zerofill primary key auto_increment,
  point_no int(2) not null,
  point_name VARCHAR(100) not null,
  map_x int(3),
  map_y int(3),
  memo VARCHAR(200),
  created datetime,
  deleted_flg int(1)
) engine=InnoDB default charset=utf8;

-- 初期データの設定
INSERT INTO point( point_no, point_name, created ) VALUES (1, '魚屋「魚栄」付近', NOW());
INSERT INTO point( point_no, point_name, created ) VALUES (2, '南門付近', NOW());
INSERT INTO point( point_no, point_name, created ) VALUES (3, '正門坂下横断歩道', NOW());
INSERT INTO point( point_no, point_name, created, memo, deleted_flg ) VALUES (4, '東雪谷５丁目１８番地', NOW(), '※令和３年度より削除', 1);
INSERT INTO point( point_no, point_name, created ) VALUES (5, '正門坂上十字路', NOW());
INSERT INTO point( point_no, point_name, created, memo, deleted_flg ) VALUES (6, 'カーブミラーのある交差点', NOW(), '※令和４年度より削除', 1);
INSERT INTO point( point_no, point_name, created ) VALUES (7, '公務員住宅坂上角', NOW());
INSERT INTO point( point_no, point_name, created ) VALUES (8, '公務員住宅坂下角', NOW());
INSERT INTO point( point_no, point_name, created ) VALUES (9, '海員組合住宅付近（五叉路）', NOW());
INSERT INTO point( point_no, point_name, created ) VALUES (10, '鳥安、だいた接骨院付近', NOW());
INSERT INTO point( point_no, point_name, created ) VALUES (11, '駐在所付近', NOW());
INSERT INTO point( point_no, point_name, created ) VALUES (12, '猿坂上角', NOW());
INSERT INTO point( point_no, point_name, created ) VALUES (13, '郵便局前', NOW());
INSERT INTO point( point_no, point_name, created ) VALUES (14, 'パルシステムそば横断歩道', NOW());
INSERT INTO point( point_no, point_name, created ) VALUES (15, 'プリン公園付近', NOW());
INSERT INTO point( point_no, point_name, created ) VALUES (16, '仲池上児童館付近', NOW());
INSERT INTO point( point_no, point_name, created ) VALUES (17, 'コーヒー工場付近', NOW());
INSERT INTO point( point_no, point_name, created ) VALUES (18, '仲池上会館付近', NOW());
INSERT INTO point( point_no, point_name, created, memo ) VALUES (19, '西河屋前交差点', NOW(),'※令和３年度位置を変えました');
INSERT INTO point( point_no, point_name, created, memo ) VALUES (20, '新幹線ガード下トンネル（みどり幼稚園側)', NOW(),'※令和３年度位置を変えました');
INSERT INTO point( point_no, point_name, created ) VALUES (21, '子安八幡神社下付近', NOW());
INSERT INTO point( point_no, point_name, created ) VALUES (22, '林昌寺下付近', NOW());
INSERT INTO point( point_no, point_name, created ) VALUES (23, '大森十中グランド横', NOW());
INSERT INTO point( point_no, point_name, created, memo ) VALUES (24, 'ヤマト運輸付近', NOW(),'※令和５年度追加');
