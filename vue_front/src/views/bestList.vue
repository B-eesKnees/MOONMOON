<style src="../assets/css/bestList.css"></style>

<template>
  <GnbBar ref="childComponent" />
  <div class="best">
    <div class="best_header">
      <h2>BEST</h2>
    </div>
    <div class="best_items">
      <div v-for="(item, i) in bestListData" :key="i" class="best_item">
        <div class="best_item_img">
          <a :href="`/detail/${item.BOOK_ID}`"><img :src="item.BOOK_COVER" alt="" /></a>
        </div>
        <div class="best_item_info">
          <h2 class="best_item_info_title"><a :href="`/detail/${item.BOOK_ID}`">{{ item.BOOK_TITLE }}</a></h2>
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
            <span v-else class="best_item_info_star_num">{{ formatReviewScore(item.reviewpoint) }}</span>
            <StarIcon :rating="convertRatingToHalfStars(reviewScore[i])" />
          </div>
        </div>
        <div class="best_item_order">
          <a @click="goToPay(item.BOOK_ID, item.BOOK_PRICE)" href="#">결제하러 가기</a>
          <p><span>내일(7/28)</span> 도착예정</p>
        </div>
        <div class="best_item_btn">
          <img v-if="item.isLiked == true" @click="likeToggle(item.BOOK_ID)" src="../assets/img/heartFill.png"
            alt="Heart Filled" />
          <img v-else-if="item.isLiked == false" @click="likeToggle(item.BOOK_ID)" src="../assets/img/heart.png"
            alt="Heart" />
          <img @click="addToCart(item.BOOK_ID)" src="../assets/img/cart2.png" alt="" />
        </div>
      </div>
    </div>
    <!-- 플로팅-->
    <Floating />
  </div>
</template>

<script>
import GnbBar from "../components/gnbBar.vue";
import Floating from "../components/floating.vue"
import StarIcon from "../components/star.vue"; // 별점 아이콘 컴포넌트의 경로를 수정해주세요.

import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.post["Contents-Type"] = "application/json;charset=utf-8";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

export default {

  name: "",
  components: { GnbBar, StarIcon, Floating },
  data() {
    return {
      bestListData: [],
      reviewScore: [], // 리뷰 점수를 얻어온다고 가정
      email: "",
      bookId: "",

      //좋아요 여부
      isLiked: false,
      likeBook: [],
    };
  },

  setup() { },
  created() {
    this.email = localStorage.getItem("userID");
    this.getLikeBook();
    this.getBestList();
  },
  mounted() { },
  unmounted() { },

  methods: {
    async getBestList() {
      await axios({
        url: "http://localhost:3000/booklist/getBest",
        method: "POST",
        data: {
        }
      })
        .then((res) => {
          if (localStorage.getItem("userID")) {
            this.bestListData = res.data.map(book => {
              return {
                ...book,
                isLiked: this.likeBook.includes(book.BOOK_ID) // 해당 책의 BOOK_ID가 likeBook 배열에 포함되어 있는지 확인하여 isLiked 값을 설정
              };
            });
            for (var i in res.data) {
              //별이 5개이므로 총점10점을 2로 나눔
              this.reviewScore.push((res.data[i].reviewpoint) / 2)
            }
          } else {
            this.bestListData = res.data.map(book => {
              return {
                ...book,
                isLiked: false // 해당 책의 BOOK_ID가 likeBook 배열에 포함되어 있는지 확인하여 isLiked 값을 설정
              };
            });
            for (var i in res.data) {
              this.bestListData.push(res.data[i]);
              //별이 5개이므로 총점10점을 2로 나눔
              this.reviewScore.push((res.data[i].reviewpoint) / 2)
            }
          }

          console.log(this.bestListData)

        })
        .catch((err) => {
          alert(err);
        });
    },
    //회원이 좋아요한 책 ID 가져오기
    async getLikeBook() {
      await axios({
        url: "http://localhost:3000/bookList/checkLikeList",
        method: "POST",
        data: {
          email: this.email
        }
      })
        .then((res) => {
          this.likeBook = res.data;
        })
    },
    async likeToggle(bookId) {
      if (localStorage.getItem("userID")) {
        this.bookId = bookId;
        await axios({
          url: "http://localhost:3000/detail/likeOrDislike",
          method: "POST",
          data: {
            email: this.email,
            bookId: this.bookId
          }
        })
          .then((res) => {
            console.log(res.data, "좋아요 추가삭제")
            this.getLikeBook();
            this.getBestList();
          })

      } else {
        const conResult = confirm("로그인이 필요합니다. \n 로그인 하시겠습니까?");
        conResult ? window.location.href = "/login" : null;
      }

    },
    //입력된 숫자를 주어진 범위에 따라 적절한 별점으로 변환
    convertRatingToHalfStars(number) {
      if (Number.isInteger(number)) {
        if (number >= 1 && number <= 5) {
          return number;
        } else {
          return 0; // 범위를 벗어나는 경우
        }
      } else {
        const integerPart = Math.floor(number);
        const decimalPart = number - integerPart;

        if (decimalPart < 0.5) {
          return integerPart;
        } else {
          return integerPart + 0.5;
        }
      }
    },
    formatReviewScore(number) {
      if (Number.isInteger(number)) {
        return number.toFixed(1); // 정수인 경우 소수점 자리를 1로 설정하여 변환
      } else {
        return number.toString(); // 소수인 경우 그대로 문자열로 변환
      }
    },
    formatNumber(number) {
      // 숫자를 천 단위마다 쉼표가 있는 형식으로 변환
      return new Intl.NumberFormat().format(number);
    },
    //장바구니에 추가
    async addToCart(bookId) {
      if (localStorage.getItem("userID")) {
        this.bookId = bookId;
        await axios({
          url: "http://localhost:3000/detail/gotoCart",
          method: "POST",
          data: {
            email: this.email,
            bookId: this.bookId
          }
        })
          .then((res) => {
            alert("장바구니에 추가되었습니다.");
            this.$refs.childComponent.getCartNum();
          })
      } else {
        const conResult = confirm("로그인이 필요합니다. \n 로그인 하시겠습니까?");
        conResult ? window.location.href = "/login" : null;
      }
    },
    // 결제하기 버튼 클릭시 서버로 보낼 데이터
    async goToPay(bookId, bookPrice) {
      const totalPoint = bookPrice * 0.05;
      const bookfee = bookPrice >= 50000 ? 0 : 2500;
      await axios({
        url: "http://localhost:3000/detail/gotoPay",
        method: "POST",
        data: {
          bookId: bookId,
          bookNum: 1,
          email: this.email,
          total_pay: bookPrice,
          total_point: totalPoint,
          fee: bookfee
        },
      })
        .then((res) => {
          console.log(res.data.payID);
          window.location.href = `/pay/${res.data.payID}`;
        })
        .catch((error) => {
          console.error("Error goToPay :", error);
        });
    },
  },
};
</script>

