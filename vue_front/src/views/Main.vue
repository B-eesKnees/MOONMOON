<template>
  <GnbBar />
  <div ref="content" class="main content">
    <!-- 이미지슬라이더 -->
    <div class="image-slider">
      <div class="slider-wrapper" v-if="slidesReady">
        <div
          class="slider"
          :style="{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: transitionDuration,
          }"
        >
          <div v-for="(image, index) in images" :key="index" class="slide">
            <img :src="image" alt="Slide Image" />
          </div>
        </div>
        <div class="controls">
          <button @click="prevSlide" class="prev-btn">&lt;</button>
          <button @click="nextSlide" class="next-btn">&gt;</button>
        </div>
        <div class="dots">
          <span
            v-for="(image, index) in images"
            :key="index"
            @click="goToSlide(index)"
            :class="{ active: index === currentIndex }"
            class="dot"
          ></span>
        </div>
      </div>
    </div>

    <!-- 책추천-->
    <div v-if="!login" class="container_blur">
      <h2>로그인하시면 취향에 맞는 책을 보여드려요</h2>
      <a href="/login">로그인하고 책 추천받기</a>
    </div>
    <div class="container">
      <h2 class="recommend_title">
        <span class="recommend_username">ㅇㅇㅇ</span>님에게 추천하는 책이예요
      </h2>
      <div class="main_item_wrap blur">
        <div class="recommend_item" v-for="i in 8">
          <img class="main_item_img" src="../assets/img/book4.jpg" alt="" />
          <div class="main_item_info">
            <h5 class="main_item_title">제목제목</h5>
            <span class="main_item_writer">글쓴이</span>
            •
            <span class="main_item_publisher">출판사</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 베스트추천-->
    <div class="container">
      <div class="main_contents_header">
        <h2 class="main_title">베스트</h2>
        <a href="/best">더보기 ＋</a>
      </div>
      <div class="main_item_wrap">
        <div class="main_contents_item" v-for="i in 5">
          <img class="main_item_img" src="../assets/img/book4.jpg" alt="" />
          <div class="main_item_info">
            <h5 class="main_item_title">제목제목</h5>
            <span class="main_item_writer">글쓴이</span>
            •
            <span class="main_item_publisher">출판사</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 신상품추천-->
    <div class="container">
      <div class="main_contents_header">
        <h2 class="main_title">신상품</h2>
        <a href="/new">더보기 ＋</a>
      </div>
      <div class="main_item_wrap">
        <div class="main_contents_item" v-for="i in 5">
          <img class="main_item_img" src="../assets/img/book4.jpg" alt="" />
          <div class="main_item_info">
            <h5 class="main_item_title">제목제목</h5>
            <span class="main_item_writer">글쓴이</span>
            •
            <span class="main_item_publisher">출판사</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 이벤트배너-->
    <div class="main_event">
      <img class="main_event_img" src="../assets/img/event1.jpg" alt="" />
    </div>

    <!-- 굿즈-->
    <div class="container">
      <div class="main_contents_header">
        <h2 class="main_title">굿즈</h2>
        <a href="">더보기 ＋</a>
      </div>
      <div class="main_item_wrap">
        <div class="recommend_item" v-for="i in 4">
          <img class="goods_img" src="../assets/img/goods1.png" alt="" />
          <div class="goods_ball">여긴뭘까</div>
        </div>
      </div>
    </div>

    <!-- 플로팅-->
    <div @click="openFloating" class="floating_btn">
      <img src="../assets/img/floating.png" alt="" />
      <span class="floating_num">0</span>
    </div>
    <div ref="float" class="floating_modal_wrap display_none">
      <div class="floating_modal">
        <div class="floating_modal_header">
          <h2
            ref="floatRecent"
            class="floating_modal_heart_btn current"
            @click="floatingMenuRecent"
          >
            최근 본
          </h2>
          <h2
            ref="floatHeart"
            class="floating_modal_recent_btn"
            @click="floatingMenuHeart"
          >
            찜 목록
          </h2>
          <span @click="closeFloating" class="cursor">✖</span>
        </div>
        <div class="floating_modal_list_header">
          <div class="floating_modal_list_header_left">
            <span>1</span>
            <span>건</span>
          </div>
          <div class="floating_modal_list_header_right cursor">
            <img src="../assets/img/trash.png" alt="" />
            <span>전체삭제</span>
          </div>
        </div>
        <div class="floating_modal_list">
          <div v-for="i in 2" class="floating_modal_item">
            <a class="floating_modal_item_img" href=""
              ><img src="../assets/img/book4.jpg" alt=""
            /></a>
            <div class="floating_modal_item_info">
              <a href="">
                <h2>세이노의 가르침</h2>
              </a>
              <p>세이노(SayNo)</p>
              <div class="floating_modal_item_info_price">
                <span>10%</span>
                <span>16,200</span>원
              </div>
            </div>
            <div class="floating_modal_item_control">
              <img class="cursor" src="../assets/img/heart.png" alt="" />
              <span class="cursor">✖</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 찜 목록 -->
      <div v-if="floatingState == 'heart'" class="floating_modal_heart_wrap">
        <div class="floating_modal_list_header">
          <div class="floating_modal_list_header_left">
            <span>2</span>
            <span>건</span>
          </div>
          <div class="floating_modal_list_header_right cursor">
            <img src="../assets/img/trash.png" alt="" />
            <span>전체삭제</span>
          </div>
        </div>
        <div class="floating_modal_list">
          <div v-for="i in 3" class="floating_modal_item">
            <a class="floating_modal_item_img" href=""
              ><img src="../assets/img/book4.jpg" alt=""
            /></a>
            <div class="floating_modal_item_info">
              <a href="">
                <h2>세이노의 가르침</h2>
              </a>
              <p>세이노(SayNo)</p>
              <div class="floating_modal_item_info_price">
                <span>10%</span>
                <span>16,200</span>원
              </div>
            </div>
            <div class="floating_modal_item_control">
              <img class="cursor" src="../assets/img/heart.png" alt="" />
              <span class="cursor">✖</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- toTop -->
  <div v-show="state.showTopButton" @click="scrollToTop" class="scroll_top_btn">
    <div>
      <span>TOP</span>
    </div>
  </div>

  <roulette />
</template>

<script>
import GnbBar from "../components/gnbBar.vue";
import { ref, reactive, onMounted, onUnmounted } from "vue";
import roulette from "../components/roulette.vue";

export default {
  components: { GnbBar, roulette },
  data() {
    return {
      images: [
        require("../assets/img/book2.jpg"),
        require("../assets/img/book1.jpg"),
        require("../assets/img/book3.jpg"),
      ],
      // 이미지슬라이드
      currentIndex: 0,
      slidesReady: false, // 슬라이드 준비 여부 상태 추가
      transitionDuration: "0.3s", // 이미지 이동 애니메이션 시간

      // 플로팅 데이터
      floatingState: "recent",
    };
  },
  setup() {
    const state = reactive({
      showTopButton: false,
    });

    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      // 스크롤이 일정 위치 이상으로 내려갔을 때 Top 버튼 표시
      state.showTopButton = scrollTop >= 300;
    };

    // Top 버튼 클릭 시 스크롤을 위로 부드럽게 이동
    Math.easeInOutQuad = function (t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    const scrollToTop = () => {
      const startTime = performance.now();
      const duration = 500;
      const startTop = window.scrollY;

      const scrollStep = (timestamp) => {
        const currentTime = timestamp || performance.now();
        const elapsed = currentTime - startTime;
        const ease = Math.easeInOutQuad(elapsed, startTop, -startTop, duration);

        window.scrollTo(0, ease);

        if (elapsed < duration) {
          window.requestAnimationFrame(scrollStep);
        }
      };
      window.requestAnimationFrame(scrollStep);
    };
    // 스크롤 이벤트 리스너 등록
    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });
    // 컴포넌트 제거 시 스크롤 이벤트 리스너 해제
    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });
    return {
      state,
      scrollToTop,
    };
  },
  mounted() {
    // 이미지 슬라이드가 렌더링되고 준비가 완료되면 slidesReady를 true로 설정
    this.slidesReady = true;
  },
  methods: {
    // 이전 슬라이드로 이동하는 메서드 (이미지가 오른쪽으로 넘어가는 애니메이션 추가)
    prevSlide() {
      if (this.slidesReady) {
        if (this.currentIndex > 0) {
          this.currentIndex--;
        } else {
          this.currentIndex = this.images.length - 1;
        }
        this.transitionDuration = "0.3s";
      }
    },
    // 다음 슬라이드로 이동하는 메서드 (이미지가 왼쪽으로 넘어가는 애니메이션 추가)
    nextSlide() {
      if (this.slidesReady) {
        if (this.currentIndex < this.images.length - 1) {
          this.currentIndex++;
        } else {
          this.currentIndex = 0;
        }
        this.transitionDuration = "0.3s";
      }
    },
    goToSlide(index) {
      this.currentIndex = index;
      this.transitionDuration = "0.3s";
    },
    openFloating() {
      const floatdiv = this.$refs.float.classList;
      floatdiv.toggle("display_none");
    },
    closeFloating() {
      const floatdiv = this.$refs.float.classList;
      floatdiv.toggle("display_none");
    },
    floatingMenuRecent() {
      const floatRecentBtn = this.$refs.floatRecent;
      const floatHeartBtn = this.$refs.floatHeart;
      this.floatingState = "recent";
      if (this.floatingState == "recent") {
        floatRecentBtn.classList.add("current");
        floatHeartBtn.classList.remove("current");
      }
    },
    floatingMenuHeart() {
      const floatRecentBtn = this.$refs.floatRecent;
      const floatHeartBtn = this.$refs.floatHeart;
      this.floatingState = "heart";
      if (this.floatingState == "heart") {
        floatHeartBtn.classList.add("current");
        floatRecentBtn.classList.remove("current");
      }
    },
  },
};
</script>

<style>
/* 메인 공용 스타일 */
.display_none {
  display: none;
}

.current {
  color: white;
  background-color: #595959;
}

.cursor {
  cursor: pointer;
}

.container {
  width: 70%;
  margin: 5% auto;
}

.main_title {
  font-size: xx-large;
  font-weight: bold;
  color: #4e4eff;
}

.main_item_wrap {
  display: flex;
  flex-wrap: wrap;
  /* 4개 이상의 박스가 있으면 다음 줄로 넘김 */
  justify-content: space-between;
  /* 가로로 오른쪽으로 정렬 */
}

.main_item_img {
  width: 100%;
  height: 80%;
}

.main_item_info {
  padding: 5%;
}

.main_item_title {
  font-size: large;
  font-weight: bold;
}

.main_item_writer,
.main_item_publisher {
  line-height: 40px;
}

/* 이미지슬라이더 */
.image-slider {
  text-align: center;
}

.slider-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  /* 높이를 80%로 설정 */
  max-height: 800px;
  /* 최대 높이 설정 (원하는 높이 값으로 변경 가능) */
  margin: 0 auto;
  overflow: hidden;
}

.slider {
  display: flex;
  transition: transform 0.3s ease;
}

.slide {
  flex: 0 0 100%;
}

.slide img {
  width: 100%;
  height: 100%;
  /* 이미지가 슬라이드의 높이를 100% 차지하도록 설정 */
  object-fit: cover;
  /* 이미지 비율 유지하며 슬라이드에 맞추도록 설정 */
}

.image-slider button {
  border: none;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  padding: 8px 22px;
  cursor: pointer;
  font-weight: bold;
}

.image-slider button:hover {
  background-color: white;
  color: #4e4eff;
}

.dot {
  width: 20px;
  height: 20px;
  border: 1px solid #4e4eff;
  border-radius: 50%;
  background-color: white;
  margin: 0 5px;
  cursor: pointer;
}

.dot.active {
  background-color: #4e4eff;
}

.controls {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.prev-btn,
.next-btn {
  border: none;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.3s ease;
  /* 애니메이션을 위한 transition 추가 */
}

.prev-btn {
  margin-left: 10px;
}

.next-btn {
  margin-right: 10px;
}

.dots {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
}

/* 책추천 비로그인시 블러 */
.blur {
  filter: blur(10px);
}

.container_blur {
  position: absolute;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 140%;
}

.container_blur h2 {
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
}

.container_blur a {
  margin-top: 1%;
  border: 2px solid #4e4eff;
  border-radius: 32px;
  background-color: aliceblue;
  color: #4e4eff;
  font-weight: bold;
  font-size: x-large;
  padding: 1% 10%;
}

.container_blur a:hover {
  background-color: #4e4eff;
  color: white;
}

/* 책추천 */
.recommend_title {
  font-size: xx-large;
  font-weight: bold;
}

.recommend_username {
  color: #4e4eff;
}

.recommend_item {
  width: 21%;
  margin: 2% 0 0 0;
  position: relative;
}

/* 베스트 */
.main_contents_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main_contents_header a {
  font-size: large;
  font-weight: bold;
}

.main_contents_item {
  width: 15%;
  margin: 2% 0 0 0;
}

/* 이벤트배너 */
.main_event {
  width: 100%;
  margin-top: 5%;
  text-align: center;
}

.main_event_img {
  width: 100%;
  height: 300px;
}

/* 굿즈 */
.goods_img {
  width: 90%;
  height: 100%;
  border-radius: 50%;
}

.goods_ball {
  width: 40%;
  height: 40%;
  border-radius: 50%;
  background-color: #4e4eff;
  position: absolute;
  left: 65%;
  top: 65%;
  text-align: center;
  font-size: xx-large;
  color: white;
  padding: 10% 0;
}

/* 플로팅 */
.floating_btn {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: fixed;
  right: 2%;
  bottom: 20%;
  background-color: #f2f2f2;
  padding: 0.8%;
  border-radius: 100%;
  cursor: pointer;
  z-index: 50;
}

.floating_btn img {
  width: 25px;
  height: 25px;
  border-radius: 50%;
}

.floating_num {
  position: absolute;
  font-size: small;
  left: 60%;
  top: -15%;
  color: white;
  background-color: #4e4eff;
  padding: 6% 12% 9% 12%;
  border-radius: 100px;
}

.floating_modal_wrap {
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}

.floating_modal {
  position: fixed;
  right: 2%;
  top: 5%;
  width: 23%;
  height: 90%;
  background-color: white;
  border-radius: 22px;
  padding: 1.5%;
}

.floating_modal_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20%;
}

.floating_modal_header h2 {
  font-size: x-large;
  font-weight: bold;
  cursor: pointer;
  padding: 3% 6%;
  border-radius: 8px;
}

.floating_modal_header h2:nth-child(2) {
  margin-right: 30%;
}

.floating_modal_header span {
  font-size: xx-large;
}

.floating_modal_list_header_left span:first-child {
  color: #4e4eff;
  font-weight: bold;
  font-size: large;
}

.floating_modal_list_header_left span:last-child {
  font-weight: bold;
}

.floating_modal_list_header_right {
  width: 18%;
  display: flex;
  align-items: center;
  font-size: small;
  color: #7c7c7c;
}

.floating_modal_list_header_right img {
  margin-right: 5%;
}

.floating_modal_list_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5%;
}

.floating_modal_item {
  display: flex;
  justify-content: space-between;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 4%;
  margin-bottom: 3%;
}

.floating_modal_item_img {
  width: 25%;
  height: 12%;
  border-radius: 12px;
}

.floating_modal_item_img img {
  width: 100%;
  max-height: 110px;
  border-radius: 12px;
  object-fit: cover;
}

.floating_modal_item_info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: -20%;
  font-size: small;
  padding: 2%;
}

.floating_modal_item_info h2 {
  font-weight: bold;
  font-size: medium;
}

.floating_modal_item_info h2:hover {
  text-decoration: underline;
}

.floating_modal_item_info_price span:first-child {
  font-weight: bold;
  font-size: large;
  color: #4e4eff;
  margin-right: 5%;
}

.floating_modal_item_info_price span:last-child {
  font-weight: bold;
  font-size: large;
}

.floating_modal_item_control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 12%;
  height: 10%;
  font-size: x-large;
}

.floating_modal_item_control span {
  margin-bottom: 1%;
}

.floating_modal_item_control img {
  width: 50%;
}

/* toTop */
.scroll_top_btn {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: fixed;
  right: 2%;
  bottom: 12%;
  background-color: white;
  padding: 1% 0.7%;
  border: 1px solid #ccc;
  border-radius: 100%;
  cursor: pointer;
  z-index: 50;
  font-weight: bold;
  color: #7c7c7c;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.1);
}
</style>
