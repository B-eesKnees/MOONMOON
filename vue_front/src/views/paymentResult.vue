<template>
  <div>주문/결제</div>

  <div class="progress">
    <span class="before">장바구니> 주문/결제> </span>
    <span class="now">완료</span>
  </div>

  <div class="paymentResult_wrap">
    <div class="result_title">주문이 완료되었습니다.</div>
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

    <div class="bill"></div>
  </div>
</template>

<script>
export default {
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
  margin-top: 10%;
  box-shadow: 0 0 15px #ccc;
  border-radius: 10px;
  background-color: white;
}
.bill {
  position: absolute;
  border: 1px solid #000000;
  width: 30%;
  height: 100%;
  top: -25px;
  right: 70px;
  background-image: url("../assets/img/bill.png");
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
  border: none;
}
</style>
