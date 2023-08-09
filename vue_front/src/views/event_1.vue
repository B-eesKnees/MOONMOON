<style src="../assets/css/qnaList.css"></style>
<template>
  <div>
    <GnbBar />

    <div class="mypage_menu"></div>
    <div class="right_box">
      <h1 class="qna_title">EVENT</h1>
      <!-- 탭시작 -->
      <section class="tabWrap">
        <TabsWrapper>
          <TabItem title="룰렛">
            <div class="moonroul">
              <div class="roultitle">MOONMOON 룰렛 이벤트</div>
              <div class="roultitle1">
                꽝 없는 100% 당첨! 포인트 받고 책 읽자!
              </div>
              <div>
                <img
                  class="luckyroul"
                  src="../assets/img/럭키룰렛.png"
                  alt="럭키룰렛"
                />
              </div>
              <div id="app">
                <div class="rouletter">
                  <div class="rouletter-bg">
                    <div class="rouletter-wacu" ref="panel"></div>
                  </div>
                  <div class="rouletter-arrow"></div>
                  <button
                    class="rouletter-btn"
                    @click="startRoulette()"
                    ref="btn"
                  >
                    GO!
                  </button>
                </div>

                <input type="hidden" class="hidden-input" ref="hiddenInput" />
                <div
                  class="modal"
                  id="resultModal"
                  :class="{ 'modal-show': showModal }"
                  ref="resultModal"
                >
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-title" v-if="modalTitle">
                        {{ modalTitle }}
                      </div>
                      <div class="modal-body" id="modal-body" v-if="modalBody">
                        {{ modalBody }}
                      </div>
                      <div class="modal-footer">
                        <div class="modal-close" @click="hideModal">
                          &times;
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="roulinfo">
                <div class="roulspan">행사기간</div>
                <div class="roulspan1">2023.08.01 - 2023.08.31</div>
                <div class="roulcustom">대상고객</div>
                <div class="roulcustom1">
                  문문서점 전 회원 (아이디당 1일 1회 참여 가능)
                </div>
              </div>
              <div class="luckyrouldesc">
                <img src="../assets/img/룰렛당첨안내.png" alt="룰렛 당첨안내" />
              </div>
              <div class="awareroul">
                <div class="importantroul">꼭! 알아두세요</div>
                <div class="roulline">
                  ------------------------------------------------------------------
                </div>
                <div class="roulguide">
                  <ul>
                    <li>
                      •행사 기간 내 문문서점 로그인 한 후 참여 가능하며, 쿠폰은
                      이벤트 기간 내 ID당 1일 1회만 발급 가능합니다.
                    </li>
                    <li>
                      •포인트 사용은 이벤트 기간 내 사용가능하며, 사용된 포인트
                      취소 시 이벤트 기간에만 재 사용 가능합니다.
                    </li>
                    <li>•포인트는 마이페이지에서 확인 가능합니다.</li>
                    <li>
                      •본 이벤트는 당사 사정에 의해 조기 종료될 수 있습니다
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabItem>
          <TabItem title="출석체크"> </TabItem>
          <TabItem title="종료된 이벤트"> </TabItem>
        </TabsWrapper>
      </section>
    </div>
  </div>
</template>
<script>
import axios from "axios";

import GnbBar from "../components/gnbBar.vue";
import TabsWrapper from "../components/TabsWrapper.vue";
import TabItem from "../components/TabItem.vue";

export default {
  components: {
    GnbBar,
    TabsWrapper,
    TabItem,
  },
  data() {
    return {
      userEmail: localStorage.getItem("userID"),

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
      showModal: false,
      modalTitle: "", // 모달 제목을 동적으로 표시할 변수
      modalBody: "", // 모달 본문을 동적으로 표시할 변수

      selectedValue: null,
      modalMessage: "",
    };
  },

  methods: {
    async startRoulette() {
      const backServer = "http://localhost:3000/roulette";
      try {
        const response = await axios.get(`${backServer}/checkroul`, {
          params: {
            userEmail: this.userEmail,
          },
        });
        this.handleRouletteResponse(response);
      } catch (error) {
        console.error(error);
      }
    },

    handleRouletteResponse(response) {
      console.log(response.data.message);
      if (response.data.message === "참여불가") {
        // 이미 참여한 경우 모달 표시
        this.setNum = null;
        this.showModal = true;
        this.modalTitle = "이미 참여하셨네요!";
        this.modalBody = "내일 다시 참여해주세요.";
      } else {
        // 아직 참여하지 않은 경우 룰렛 돌리기
        this.setNum = this.rRandom();
        this.selectedValue = this.value[this.setNum];
        this.rRotate();

        const backServer = "http://localhost:3000/roulette";
        axios
          .post(`${backServer}/addroul`, {
            userEmail: this.userEmail,
            selectedValue: this.selectedValue,
          })
          .then((response) => {
            console.log(response.data.message);
            // 룰렛 결과에 따른 모달 표시

            this.modalTitle = "축하합니다!";
            this.modalBody = `${this.selectedValue}P 당첨되었습니다!`;
            setTimeout(() => {
              this.showModal = true;
              // setTimeout(() => {
              //   window.location.reload();
              // }, 1000);
            }, 8000);
          })
          .catch((error) => {
            console.error(error);
          });
      }
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
      var panel = this.$refs.panel; // 이 부분 수정
      var btn = this.$refs.btn; // 이 부분 수정

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

      //this.$el.append(this.$refs.hiddenInput);
      this.$refs.panel.appendChild(this.$refs.hiddenInput);
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
      // var modal = this.$refs.resultModal;
      // modal.style.display = "block";
      this.showModal = true;
      //모달 css
    },

    hideModal() {
      // var modal = this.$refs.resultModal;
      // modal.style.display = "none";
      this.showModal = false;
    },
  },
};
</script>

<style scoped>
.moonroul {
  width: 100%;
  position: relative;
  left: 0;
}

.luckyroul {
  width: 100%;

  border: 1px solid #000;

  background-size: cover; /* 이미지 크기 조절 옵션 */
  background-position: center;
}
.luckyroul > img {
  width: 100%;
}
.roultitle {
  font-size: 30px;
  color: #4e4eff;
  font-weight: bold;
}
.roultitle1 {
  font-size: 20px;
  margin: 15px;
  margin-left: 0;
}
.roulspan {
  display: inline-block;
  font-size: 20px;
  font-weight: 700;
}
.roulspan1 {
  display: inline-block;
  margin-left: 20px;
  font-size: 20px;
}
.roulcustom {
  display: inline-block;
  font-size: 20px;
  font-weight: 700;
}
.roulcustom1 {
  display: inline-block;
  margin-left: 20px;
  font-size: 20px;
}
.importantroul {
  font-size: 30px;
  font-weight: bold;
}
.roulguide {
  font-size: 20px;
}
</style>
