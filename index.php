<?php
  // 外部ファイルの読み込み
  require_once('inc/functions.php');
?>

<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>旗当番予約ページ</title>
  <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous" defer></script>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script src="js/app.js" defer></script>
  <link rel="stylesheet" href="./css/reset.css">
  <link rel="stylesheet" href="./css/style.css">
</head>
<body>
  <div id="app" class="inner">
    <h1 class="page-ttl">旗当番予約ページ</h1>

    <section>
      <h2>1. 希望の立ち位置を選んでください</h2>
      <select id="point" v-model="selectedPointID" @change="selectPoint">
        <option disabled value="">選択してください</option>
        <option v-for="item in points" :value="item.point_id" :key="item.point_id">{{ item.point_no }}：{{ item.point_name }}</option>
      </select>
    </section>

    <section v-if="selectedPointID">
      <h2>2. 実施日を選んでください</h2>
      <span class="btn-modal-close" @click="close($event)"></span>

      <div class="calender">
        <!-- カレンダータイトル -->
        <div class="calender__title">
          <button type="button" class="move-month move-month--prev" @click="movePrevMonth"><span></span></button>
          <span>{{currentYear+"/"+currentMonth}}</span>
          <button type="button" class="move-month move-month--next" @click="moveNextMonth"><span></span></button>
        </div>
        <ol class="calender__body">
          <!-- カレンダー曜日 -->
          <li v-for="day in weeks" class="calendar__item calendar__item--day">{{day}}</li>
          <!-- カレンダー日付 -->
          <li v-for="list in calendar" class="calendar__item" :class="{'is-able':list.isAble}, {'is-space':list.isSpace},{'is-holiday':list.isHoliday},{'is-exclusion':list.isExclusion}, {'is-reserved':list.isReserved}">
            <button type="button" class="calendar__item--btn js-modal-trigger" :tabindex="list.tabIndex" @click="selectDay(list.fullDate)">
              <span class="calendar__item--date" :class="{'is-today':list.isToday}">{{list.date}}</span>
              <span class="calendar__item--label">{{list.label}}</span>
            </button>
          </li>
        </ol>
      </div>
    </section>

    <dialog id="reserve-modal" class="modal">
      <button type="button" class="modal__close" @click="closeModal()">✕</button>

      <form class="form">
        <p class="form__label">{{selectedPointName}}</p>
        <p class="form__label">{{selectedDay}}（{{selectedWeekday}}）</p>
        <input type="hidden" name="point" id="point" :value="selectedPointID" class="form__input">
        <hr class="form__divide">
        <dl>
          <div class="form__row">
            <dt class="form__head"><span class="form__ttl">学年</span></dt>
            <dd class="form__data">
              <select id="grade" v-model="selectedGrade">
                <option v-for="label, index in grades" :value="label" :key="index">{{ label }}</option>
              </select> 年
            </dd>
          </div>
          <div class="form__row">
            <dt class="form__head"><span class="form__ttl">クラス</span></dt>
            <dd class="form__data">
              <select id="class" v-model="selectedClass">
                <option v-for="label, index in classes" :value="label" :key="index">{{ label }}</option>
              </select> 組
            </dd>
          </div>
          <div class="form__row">
            <dt class="form__head"><span class="form__ttl">出席番号</span></dt>
            <dd class="form__data">
              <select id="student_no" v-model="selectedStudentNo">
                <option v-for="label, index in student_nos" :value="label" :key="index">{{ label }}</option>番
              </select>
            </dd>
          </div>
        </dl>
        <div class="form__btn">
          <button type="button" class="button js-reserve" @click="reserve()"><span>予約する</span></button>
        </div>
      </form>
    </dialog>

  </div>
</body>
</html>
