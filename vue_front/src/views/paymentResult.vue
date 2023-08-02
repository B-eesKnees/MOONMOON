<template>
  <gnbbar />
  <div class="pay_title">주문/결제</div>

  <div class="progress">
    <span class="before">장바구니> 주문/결제> </span>
    <span class="now">완료</span>
  </div>

  <div class="paymentResult_wrap">
    <div class="result_title">
      <span class="text_color">주문이 완료</span>되었습니다.
    </div>
    <div class="payment_info">
      <span>주문번호</span><span class="payment_no">{{ payment_no }}</span>
      <br /><br />
      <span>구매내역</span><span class="payment_title">{{ cutBookTitle }}</span
      ><span v-if="payment_data.length > 1"
        >...외 {{ payment_data.length - 1 }}개</span
      ><br />
      <br /><br /><br />
      <div class="user_info">
        <div class="user_info2">배송지 정보</div>
        <span class="user_name">임승리</span>
        <br /><br />
        <div class="user_phone">010-2222-2222</div>
        <br />
        <div class="user_add">경기도 고양시 화신로 170 2111-1111</div>
      </div>
    </div>

    <div class="bill">
      <div class="logo"></div>
      <div class="bill_top">
        <div class="cost">
          <div class="payment_cost_text">주문금액</div>
          <div class="payment_cost1">23000 원</div>
        </div>
        <div class="cost_book">
          <div class="payment_cost_text">상품금액</div>
          <div class="payment_cost2">9900 원</div>
        </div>
        <div class="cost_fee">
          <div class="payment_cost_text">배송비</div>
          <div class="payment_cost3">2500 원</div>
        </div>
        <div class="cost_coupon">
          <div class="payment_cost_text">쿠폰할인</div>
          <div class="payment_cost4">-1000 원</div>
        </div>
        <div class="cost_point">
          <div class="payment_cost_text">사용한 포인트</div>
          <div class="payment_cost5">0 포인트</div>
        </div>
      </div>

      <div class="bill_bottom">
        <div class="pay_result">결제 상세</div>
        <div class="pay_info">
          <div class="card_info">신한 카드</div>
          <div class="pay_cost">23000 원</div>
          <br />
        </div>
        <div class="pay_date">2023-08-02 11:25</div>
      </div>
    </div>
  </div>
</template>

<script>
import gnbbar from "../components/gnbBar.vue";

export default {
  components: { gnbbar },
  data() {
    return {
      payment_no: this.$route.params.orderNum,
      payment_data: [
        {
          book_title:
            "테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트테스트",
        },
        { book_title: "ㄴㄹㄴㅁㄹㄹㄹㄴㄴㅁㄹㄴㅁㄹ" },
        { book_title: "fasfsssfsasafsafsfs" },
      ],
    };
  },
  computed: {
    cutBookTitle() {
      const max_title_len = 24;
      if (this.payment_data[0].book_title.length > max_title_len) {
        return this.payment_data[0].book_title.slice(0, max_title_len) + " ";
      } else {
        return this.payment_data[0].book_title;
      }
    },
  },
};
</script>

<style scoped>
.user_info2,
.user_name {
  display: inline-block;
  margin-right: 40px; /* Optional: Add some space between items */
}
.user_phone {
  margin-left: 144px;
}
.user_add {
  margin-right: 791px;
  text-align: right;
}
.payment_title {
  margin-left: 70px;
}
.payment_no {
  margin-left: 70px;
  text-align: right;
  color: #4e4eff;
}
.payment_info {
  margin-top: 12%;
  margin-left: 6%;
  font-weight: bold;
  font-size: 1.2em;
}
.paymentResult_wrap {
  position: absolute;
  border: none;
  width: 70%;
  height: 55%;
  margin-left: 15%;
  margin-right: 15%;
  margin-top: 5%;
  box-shadow: 0 0 15px #ccc;
  border-radius: 10px;
  background-color: white;
}
.bill {
  position: relative;
  border: 1px solid #000000;
  width: 30%;
  height: 100%;
  top: -418px;
  right: -830px;
  background-image: url("../assets/img/bill.png");
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
  border: none;
}
.result_title {
  position: relative;
  top: 100px;
  margin-left: 6%;
  font-weight: bold;
  font-size: 1.5em;
}
.result_title span {
  color: #4e4eff;
}
.bill_top {
  position: relative;
  top: 130px;
  border-top: 1px solid #999999;
  width: 90%;
  left: 19px;
}
.payment_cost {
  text-align: right;
}
.cost {
  display: flex;
  position: relative;
  font-weight: bold;
  font-size: 1.1em;
  margin-left: 7%;
  margin-top: 5%;
  justify-content: space-between;
}
.cost_book {
  display: flex;
  position: relative;
  margin-top: 7%;
  margin-left: 7%;
  justify-content: space-between;
}
.cost_fee {
  display: flex;
  position: relative;
  margin-top: 4%;
  margin-left: 7%;
  justify-content: space-between;
}
.cost_coupon {
  display: flex;
  position: relative;
  margin-top: 4%;
  margin-left: 7%;
  justify-content: space-between;
}
.cost_point {
  display: flex;
  position: relative;
  margin-top: 4%;
  margin-left: 7%;
  justify-content: space-between;
}
.bill_bottom {
  position: relative;
  top: 180px;
  border-top: 1px solid #999999;
  width: 90%;
  left: 19px;
}
.pay_result {
  margin-top: 15px;
  margin-left: 7%;
  font-weight: bold;
  font-size: 1.1em;
}
.pay_info {
  display: flex;
  margin-left: 7%;
  margin-top: 20px;
}
.pay_cost {
  margin-left: 180px;
  font-weight: bold;
}
.pay_date {
  margin-left: 7%;
  margin-top: 20px;
}
.payment_cost1 {
  position: relative;
  margin-right: 19px;
  text-align: right;
  float: right;
}
.payment_cost2 {
  position: relative;
  margin-right: 19px;
  text-align: right;
  float: right;
}
.payment_cost3 {
  position: relative;
  margin-right: 19px;
  text-align: right;
  float: right;
}
.payment_cost4 {
  position: relative;
  margin-right: 19px;
  text-align: right;
  float: right;
}
.payment_cost5 {
  position: relative;
  margin-right: 19px;
  text-align: right;
  float: right;
}
.progress {
  position: absolute;
  font-size: 1.4em;
  top: 20%;
  right: 15%;
}
.progress .before {
}
.progress .now {
  color: #4e4eff;
  font-weight: bolder;
}
.pay_title {
  font-size: 1.6em;
  position: absolute;
  font-size: 1.4em;
  top: 20%;
  left: 15%;
}
</style>
