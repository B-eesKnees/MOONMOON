<template>
  <div id="app">
    <div class="rouletter">
      <div class="rouletter-bg">
        <div class="rouletter-wacu"></div>
      </div>
      <div class="rouletter-arrow"></div>
      <button class="rouletter-btn" @click="startRoulette()">start</button>
    </div>

    <input type="hidden" class="hidden-input" ref="hiddenInput" />
    <div class="modal" id="resultModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-title">축하합니다!</div>
          <div class="modal-body" id="modal-body">
            {{ selectedValue }}P 당첨되었습니다!
          </div>
          <div class="modal-footer">
            <span class="modal-close" @click="hideModal">&times;</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      value: [100, 500, 1000, 500, 3000, 5000],
      //룰렛 돌리고 받는 포인트
      //룰렛 이미지 assets/룰.png보면 0~5 적어놨는데 이 배열임
      // ex) 3 > value[3];
      rolLength: 6,
      //룰렛 보상 배열 길이
      probabilities: [0.5, 0.15, 0.1, 0.15, 0.07, 0.03],
      // [0.5, 0.15, 0.1, 0.15, 0.07, 0.03]
      //룰렛 보상 확률 1 = 100%
      setNum: null,
      modalMessage: "",
      selectedValue: null,
    };
  },

  methods: {
    startRoulette() {
      // 룰렛 버튼 누르면 동작
      this.setNum = this.rRandom();
      //> this.setNum 은 배열의 랜덤 인덱스 즉 (0~5)까지의 랜덤값을 줌
      this.selectedValue = this.value[this.setNum];
      //rRandom()을 실행해 받은 0~5까지의 값을 활용하여 포인트 보상을 정해줌

      // 룰렛을 돌립니다.
      this.rRotate();

      // 선택된 값을 백엔드로 전송합니다.
      const backServer = "http://localhost:3000/roulette";
      axios
        .post(`${backServer}/addroul`, {
          userEmail: "user8@example.com",
          selectedValue: this.selectedValue,
        })
        .then((response) => {
          console.log(response.data.message);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    rRandom() {
      var rand = Math.random();
      // 0~1
      var sum = 0;
      for (var i = 0; i < this.probabilities.length; i++) {
        //보상 확률의 길이(6) 만큼 반복
        sum += this.probabilities[i];
        //0 + 보상 확률 배열에서 순서대로 플러스
        if (rand < sum) return i;
        // 0~1 사이의 랜덤값중에 sum이 더 커지면 보상 확률 배열중 더 커졋을때의 인덱스 값을 리턴
      }
      return this.probabilities.length - 1;
      //이건 혹시 모를 에러 처리 부분같음
    },
    rRotate() {
      var panel = document.querySelector(".rouletter-wacu");
      //룰렛 돌아가는 판 부분
      var btn = document.querySelector(".rouletter-btn");
      //룰렛 돌리는 버튼 부분

      var deg = [];
      for (var i = 1, len = this.rolLength; i <= len; i++) {
        // len = 6(보상 포인트 배열의 길이) 1~6
        deg.push((360 / len) * i);
        //룰렛의 각도를 정하는 거임
        //360도중 보상 선택지가 6개이니까 60도씩 각도 담당 배열에 저장
        //ex) [60, 120, 180, 240, 300, 360]
      }
      console.log(deg);

      var num = 0;

      this.$el.append(this.$refs.hiddenInput);
      //   this.setNum = this.$refs.hiddenInput.value = this.rRandom();
      this.modalMessage = "";

      var ani = setInterval(() => {
        //0.05초마다 실행
        num++;
        panel.style.transform = "rotate(" + 360 * num + "deg)";
        //회전시키는 css나 vue 애니메이션같은데 아마?
        btn.disabled = true;
        //룰렛버튼 비활성화
        btn.style.pointerEvents = "none";
        //룰렛버튼 비활성화 2

        if (num === 50) {
          //존나 돌리다보면
          clearInterval(ani);
          //룰렛 애니메이션 중지
          panel.style.transform = `rotate(${deg[this.setNum]}deg)`;
          //각도 담당 배열을 이용하여 rRandom()을 실행하여 받은 0~5에 해당하는 각도로 룰렛 고정
          //일정한 각도로 정지를 하긴하는데 잘 모르겠네..

          // console.log(this.value[this.setNum]);

          this.selectedValue = this.value[this.setNum];
          // //이건 왜 또 선언하는거지
          // console.log(this.selectedValue);
          // console.log(this.setNum);

          setTimeout(() => {
            this.rLayerPopup(this.setNum);
            //룰렛 실행시킨지 5.5초후 자동으로 버튼 활성화
            btn.disabled = false;
            btn.style.pointerEvents = "auto";
          }, 5500);
        }
      }, 50);
      //0.05초마다 실행
    },
    rLayerPopup(num) {
      const prizes = [100, 500, 1000, 500, 3000, 5000];
      //주기로한 포인트 배열 value랑 같음 굳이 또 선언해야하나?

      this.modalMessage = prizes[num];
      //모달 메세지에 rRandom()을 실행하여 받은 0~5 에 해당하는 값을 보여줌
      var modal = this.$el.querySelector("#resultModal");
      modal.style.display = "block";
      //모달 css
    },
    // showModal(message) {
    //   this.modalMessage = message;
    //   var modal = this.$el.querySelector("#resultModal");
    //   modal.style.display = "block";
    // },
    // 이건 왜 있는지 모르겠네
    hideModal() {
      var modal = this.$el.querySelector("#resultModal");
      modal.style.display = "none";
    },
    //모달창 끄는 버튼 이벤트 함수
    // rReset() {
    //   setTimeout(() => {
    //     var btn = this.$el.querySelector(".rouletter-btn");
    //     btn.disabled = false;
    //     btn.style.pointerEvents = "auto";
    //     this.rLayerPopup(this.setNum);
    //     this.$refs.hiddenInput.remove();
    //   }, 8000);
    // },
    // 이것도 왜 있는지 모르겠네
  },
};
</script>
<style>
.rouletter {
  position: relative;
  width: 400px;
  height: 400px;
}
.rouletter-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  height: 350px;
  border-radius: 350px;
  overflow: hidden;

  border: 25px solid rgb(127, 127, 170);
}
.rouletter-wacu {
  width: 100%;
  height: 100%;
  background: #f5f5f2 url("../assets/룰.png") no-repeat;
  background-size: 100%;
  transform-origin: center;
  transition-timing-function: ease-in-out;
  transition: 5s;
}

.rouletter-arrow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 1px;
  border-right: 10px solid transparent;
  border-left: 10px solid transparent;
  border-top: 40px solid rgb(127, 127, 170);
  border-bottom: 0px solid transparent;
}
.rouletter-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 80px;
  background: #fff;
  border-image: linear-gradient(to right, #fbfcb9be, #ffcdf3aa, #65d3ffaa);
  border: 2px solid;
}
.hidden-input {
  display: none;
}
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
}
.modal-title {
  font-weight: bold;
  margin-bottom: 10px;
}
.modal-body {
  margin-bottom: 20px;
}
.modal-footer {
  text-align: right;
}
.modal-close {
  cursor: pointer;
  color: #999;
}
</style>
