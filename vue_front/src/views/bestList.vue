<style src="../assets/css/bestList.css"></style>

<template>
  <GnbBar />
  <div class="best">
    <div class="best_header">
      <h2>BEST</h2>
    </div>
    <div class="best_items">
      <div v-for="(item, i) in bestListData" :key="i" class="best_item">
        <div class="best_item_img">
          <a href=""><img :src="item.BOOK_COVER" alt="" /></a>
        </div>
        <div class="best_item_info">
          <h2 class="best_item_info_title"><a href="">{{ item.BOOK_TITLE }}</a></h2>
          <span class="best_item_info_author">{{ item.BOOK_AUTHOR }} | {{ item.BOOK_PUBDATE }}</span>
          <div class="best_item_info_price">
            <span>{{ formatNumber(item.BOOK_PRICE) }}</span>
            <span>원</span>
          </div>
          <p class="best_item_info_summary">
            {{ item.BOOK_DESCRIPTION }}
          </p>
          <div class="best_item_info_star">
            <span v-if="item.reviewpoint == 0" class="best_item_info_star_num">0.0</span>
            <span v-else class="best_item_info_star_num">{{ item.reviewpoint }}</span>
            <StarIcon :rating="reviewScore" />
          </div>
        </div>
        <div class="best_item_order">
          <a href="">결제하러 가기</a>
          <p><span>내일(7/28)</span> 도착예정</p>
        </div>
        <div class="best_item_btn">
          <a href=""><img src="../assets/img/heart.png" alt="" /></a>
          <a href=""><img src="../assets/img/cart2.png" alt="" /></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GnbBar from "../components/gnbBar.vue";
import StarIcon from "../components/star.vue"; // 별점 아이콘 컴포넌트의 경로를 수정해주세요.

import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

export default {

  name: "",
  components: { GnbBar, StarIcon },
  data() {
    return {
      bestListData: [],
      reviewScore: 3.5 // 리뷰 점수를 얻어온다고 가정
    };
  },

  setup() { },
  created() { },
  mounted() { this.getBestList() },
  unmounted() { },

  methods: {
    getBestList() {
      axios({
        url: "http://localhost:3000/booklist/getBest",
        method: "POST",
        data: {

        }
      })
        .then((res) => {
          for (var i in res.data) {
            this.bestListData.push(res.data[i]);
          }
          console.log(this.bestListData);
        })
    },
    formatNumber(number) {
      // 숫자를 천 단위마다 쉼표가 있는 형식으로 변환
      return new Intl.NumberFormat().format(number);
    }
  },
};
</script>

