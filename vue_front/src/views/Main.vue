<style src="../assets/css/Main.css"></style>

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
    <div v-if="logined == false" class="container_blur">
      <h2>로그인하시면 취향에 맞는 책을 보여드려요</h2>
      <a href="/login">로그인하고 책 추천받기</a>
    </div>
    <div class="container">
      <h2 class="recommend_title">
        <span class="recommend_username">ㅇㅇㅇ</span>님에게 추천하는 책이예요
      </h2>
      <div ref="mainBlur" class="main_item_wrap blur">
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
        <a href="/goods">더보기 ＋</a>
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
            @click="floatingMenuRecent(), getRecentBook()"
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
        <!-- 최근 본 -->
        <div
          v-if="floatingState == 'recent'"
          class="floating_modal_recent_wrap"
        >
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
import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

import GnbBar from "../components/gnbBar.vue";
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { isLogindDisplay } from "../mixins/main.js";

export default {
  mixins: [isLogindDisplay],
  components: { GnbBar },
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

    async getRecentBook() {
      await axios({
        url: "http://localhost:3000/floating/recentbook",
        method: "GET",
        data: {},
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
};
</script>
