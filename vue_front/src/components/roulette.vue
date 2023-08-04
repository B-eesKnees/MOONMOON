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
      rolLength: 6,
      probabilities: [0.5, 0.15, 0.1, 0.15, 0.07, 0.03],
      setNum: null,
      modalMessage: "",
      selectedValue: null,
    };
  },

  methods: {
    rRandom() {
      var rand = Math.random();
      var sum = 0;
      for (var i = 0; i < this.probabilities.length; i++) {
        sum += this.probabilities[i];
        if (rand < sum) return i;
      }
      return this.probabilities.length - 1;
    },
    rRotate() {
      var panel = document.querySelector(".rouletter-wacu");
      var btn = document.querySelector(".rouletter-btn");

      var deg = [];
      for (var i = 1, len = this.rolLength; i <= len; i++) {
        deg.push((360 / len) * i);
      }

      var num = 0;

      this.$el.append(this.$refs.hiddenInput);
      this.setNum = this.$refs.hiddenInput.value = this.rRandom();
      this.modalMessage = "";

      var ani = setInterval(() => {
        num++;
        panel.style.transform = "rotate(" + 360 * num + "deg)";
        btn.disabled = true;
        btn.style.pointerEvents = "none";

        if (num === 50) {
          clearInterval(ani);
          panel.style.transform = `rotate(${deg[this.setNum]}deg)`;

          this.selectedValue = this.value[this.setNum];

          setTimeout(() => {
            this.rLayerPopup(this.setNum);
            btn.disabled = false;
            btn.style.pointerEvents = "auto";
          }, 5500);
        }
      }, 50);
    },
    rLayerPopup(num) {
      const prizes = [100, 500, 1000, 500, 3000, 5000];

      this.modalMessage = prizes[num];
      var modal = this.$el.querySelector("#resultModal");
      modal.style.display = "block";
    },
    showModal(message) {
      this.modalMessage = message;
      var modal = this.$el.querySelector("#resultModal");
      modal.style.display = "block";
    },
    hideModal() {
      var modal = this.$el.querySelector("#resultModal");
      modal.style.display = "none";
    },
    rReset() {
      setTimeout(() => {
        var btn = this.$el.querySelector(".rouletter-btn");
        btn.disabled = false;
        btn.style.pointerEvents = "auto";
        this.rLayerPopup(this.setNum);
        this.$refs.hiddenInput.remove();
      }, 8000);
    },
    startRoulette() {
      // 룰렛 값을 선택하는 로직
      this.setNum = this.rRandom();
      this.selectedValue = this.value[this.setNum];
      this.rRotate();
      this.rReset();

      // 선택된 값을 바로 백엔드로 전송
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
  background: #f5f5f2
    url("C:\Users\white\Documents\카카오톡 받은 파일\book\MOONMOON\vue_front\public\assets\룰.png")
    no-repeat;
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
