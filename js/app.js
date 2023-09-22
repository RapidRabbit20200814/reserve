Vue.createApp({
  data() {
    return {
      points: [],
      points_select_item: [],
      weeks: ["月", "火", "水", "木", "金", "土", "日"],
      grades: ["1", "2", "3", "4", "5", "6"],
      classes: ["1", "2", "3", "4", "5", "6"],
      student_nos: [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
        "31", "32", "33", "34", "35", "36", "37", "38", "39", "40"
      ],
      today: "",
      selectedPointID: "",
      selectedPointName: "",
      selectedDay: "",
      selectedWeekday: "",
      selectedGrade: "",
      selectedClass: "",
      selectedStudentNo: "",
      currentYear: "",
      currentMonth: "",
      currentMonthFull: "",
      currentDate: "",
      currentDateFull: "",
      calendar:[],
      holidays: [],
      exclusionDays: [
        "2023-07-18",
        "2023-07-21",
        "2023-07-22",
        "2023-07-23",
        "2023-07-24",
        "2023-09-05",
        "2023-09-16",
        "2023-09-17",
        "2023-09-23",
        "2023-09-24",
        "2023-09-30",
        "2023-10-01",
        "2023-10-08",
        "2023-10-14",
        "2023-10-15",
        "2023-10-21",
        "2023-10-22",
        "2023-10-28",
        "2023-10-29",
      ]
    };
  },

  methods: {
    // 前月へ
    movePrevMonth(){
      this.currentMonth = this.currentMonth != 1 ? this.currentMonth - 1 : 12;
      // ２桁に編集
      this.currentMonthFull = String(this.currentMonth).padStart(2, "0");
      this.currentYear = this.currentMonth != 12 ? this.currentYear : this.currentYear - 1;
      this.generateCalendar();
      this.getReservationList();
    },
    // 翌月へ
    moveNextMonth(){
      this.currentMonth = this.currentMonth != 12 ? this.currentMonth + 1 : 1;
      // ２桁に編集
      this.currentMonthFull = String(this.currentMonth).padStart(2, "0");
      this.currentYear = this.currentMonth != 1 ? this.currentYear : this.currentYear + 1;
      this.generateCalendar();
      this.getReservationList();
    },
    // 祝日データ取得
    fetchHolidays() {
      console.log("fetchHolidays");
      return new Promise((resolve, reject) => {
      // 非同期処理
      // データ取得が完了したら resolve() を呼び出し、エラーが発生したら reject() を呼び出す
      fetch('https://holidays-jp.github.io/api/v1/date.json')
        .then(response => response.json())
        .then(data => {
          for (const date in data) {
            const holiday = {
              date: date,
              name: data[date]
            };
            this.holidays.push(holiday);
          }
          resolve(); // データ取得完了後にresolve()を呼び出す
        })
        .catch(error => {
          reject(error); // エラーが発生した場合にreject()を呼び出す
        });
      });
    },
    // カレンダー生成
    generateCalendar() {
      console.log("generateCalendar");
      this.calendar = [];
      // 月初の曜日を取得
      const firstDay = new Date(this.currentYear, this.currentMonth - 1, 1).getDay();
      // 前月の空白スペースの数を計算
      const necessarySpace = firstDay == 0 ? 6 : firstDay - 1;
      // 月末の日付を取得
      const lastDate = new Date(this.currentYear, this.currentMonth, 0).getDate();
      // カレンダー情報編集
      const maxCnt = parseInt(necessarySpace) + parseInt(lastDate);
      for (let cnt = 1; cnt <= maxCnt; cnt++) {
        let date = ""; // 日
        let label = ""; // ラベル（◯：予約可/✕：予約済/ー：予約不可）
        let isAble = false; // 予約可 or 不可フラグ
        let tabIndex = "-1"; // タブ遷移(0:可、-1:不可)
        let isSpace = true; // 空白フラグ
        // 空白スペースではない場合
        if (cnt > necessarySpace) {
          date = cnt - necessarySpace;
          label = "◯";
          isAble = true;
          tabIndex = "0";
          isSpace = false;
        }
        // // 年月日
        const dateFull = String(date).padStart(2, "0");
        const fullDate = date ? `${this.currentYear}-${this.currentMonthFull}-${dateFull}` : "";
        // 今日
        const isToday = fullDate === this.today;
        // 過去日チェック
        if (fullDate < this.today && label != "") {
          label = "ー";
          isAble = false;
          tabIndex = "-1";
        }
        // 祝日チェック
        let holidayFlg = false;
        this.holidays.forEach(holiday => {
          if (holiday.date === fullDate) {
            holidayFlg = true;
            label = "ー";
            isAble = false;
            tabIndex = "-1";
          }
        });
        // 除外日チェック
        let exclusionFlg = false;
        this.exclusionDays.forEach(exclusion => {
          if (exclusion === fullDate) {
            exclusionFlg = true;
            label = "ー";
            isAble = false;
            tabIndex = "-1";
          }
        });
        // 配列に追加
        this.calendar.push({
          date: date,
          fullDate: fullDate,
          label: label,
          isAble: isAble,
          isSpace:  isSpace,
          isToday: isToday,
          isHoliday: holidayFlg,
          isExclusion: exclusionFlg,
          tabIndex: tabIndex
        });
      }
    },
    // 予約
    reserve() {
      const vm = this; // Vueコンポーネントのthisをvmに格納
      $.ajax({
        url: 'inc/insert_reservation.php',
        type: 'post',
        dataType: 'JSON',
        data: {
          point_id : this.selectedPointID,
          reservation_date : this.selectedDay,
          grade: this.selectedGrade,
          class : this.selectedClass,
          student_no : this.selectedStudentNo
        }
      }).done(function (data) {
        // 成功時
        this.generateCalendar();
        this.getReservationList();
      }).fail(function () {
        // 失敗時
      }).always(function () {
        // 成功・失敗時
        vm.getReservationList();
        // モーダルを閉じる
        const modal = document.querySelector("#reserve-modal");
        modal.close();
      })
    },
    // 立ち位置選択
    selectPoint() {
      // 選択されたポイントのIDから名前を見つけて selectedPointName に設定
      const selectedPoint = this.points.find(item => item.point_id === this.selectedPointID);

      if (selectedPoint) {
        this.selectedPointName = Number(this.selectedPointID) + "：" + selectedPoint.point_name;
      } else {
        this.selectedPointName = ''; // 選択が解除された場合
      }
      this.generateCalendar();
      this.getReservationList();
    },
    // 予約情報取得
    getReservationList() {
      console.log('getReservationList');
      const vm = this; // Vueコンポーネントのthisをvmに格納
      $.ajax({
        url: 'inc/select_reservation.php',
        type: 'POST',
        dataType: 'JSON',
        data: {
          point_id : vm.selectedPointID,
          month : vm.currentYear + '-' + vm.currentMonthFull + '%',
        }
      }).done(function (response) {
        // 成功時
        // レスポンスデータから予約情報を取得
        const reservations = response.result;
        // 予約情報をセット
        vm.calendar.forEach((day) => {
          const matchingReservation = reservations.find((reservation) => reservation.reservation_date === day.fullDate);
          if (matchingReservation) {
            day.isReserved = true;
            day.isAble = false;
            day.label = "✕";
          } else {
            day.isReserved = false;
          }
        });
      }).fail(function () {
        // 失敗時
      }).always(function () {
        // 成功・失敗時
      })
    },
    // 立ち位置情報取得
    getPointList() {
      console.log('getPointList');
      const vm = this; // Vueコンポーネントのthisをvmに格納
      $.ajax({
        url: 'inc/select_point.php',
        type: 'POST',
        dataType: 'JSON',
        data: {
          deleted_flg : '0'
        }
      }).done(function (response) {
        // 成功時
        if (response && response.result) {
          // レスポンスデータから立ち位置情報を取得
          const pointsList = response.result;
          pointsList.forEach(function (point) {
            vm.points.push({
              point_id: point.point_id,
              point_no: point.point_no,
              point_name: point.point_name,
              map_x: point.map_x,
              map_y: point.map_y,
              memo: point.memo,
              created: point.created,
              deleted_flg: point.deleted_flg
            });
            vm.points_select_item.push(
              point.point_no + "：" + point.point_name
            );
          });
        } else {
          console.error('Invalid response data'); // エラー処理：無効なレスポンスデータ
        }
      }).fail(function (xhr, textStatus, errorThrown) {
        // 失敗時
         console.error('Ajax request failed:', textStatus, errorThrown); // エラー処理：Ajaxリクエストの失敗
      }).always(function () {
        // 成功・失敗時
      })
    },
    // 日付選択
    selectDay(date) {
      // 選択日と曜日をセット
      this.selectedDay = date;
      let weekdayNo = new Date(date).getDay();
      if (weekdayNo == 0) {
        weekdayNo = 6;
      } else {
        weekdayNo--;
      }
      this.selectedWeekday = this.weeks[weekdayNo];
      // モーダルを開く
      const modal = document.querySelector("#reserve-modal");
      modal.showModal();
    },
    // モーダルを閉じる
    closeModal() {
      const modal = document.querySelector("#reserve-modal");
      modal.close();
    },
  },
  computed: {
  },

  // 日付取得
  created() {
    // 今日の日付を取得
    const d = new Date();
    this.currentYear = d.getFullYear();
    this.currentMonth = d.getMonth() + 1;
    this.currentDate = d.getDate();
    // ２桁に編集
    this.currentMonthFull = String(this.currentMonth).padStart(2, "0");
    this.currentDateFull = String(this.currentDate).padStart(2, "0");
    this.today = `${this.currentYear}-${this.currentMonthFull}-${this.currentDateFull}`;
  },

  mounted() {
    // 祝日情報取得
    this.fetchHolidays()
    .then(() => {
      // カレンダー生成
      this.generateCalendar();
    })
    .catch(error => {
      console.error('祝日情報の取得に失敗しました:', error);
    });
    // 立ち位置情報取得
    this.getPointList()
  },

}).mount("#app");
