<template>
  <div class="container">
    <div class="cart_wrap">
      <div class="cart_header">
        <input type="checkbox" v-model="selectAll" @change="selectAllItems" />
        <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;장바구니</h3>
      </div>
      <div class="cart_inside">
        <ol class="cart_list">
          <span v-if="cart.length == 0"><p>없음</p></span>
          <span v-else-if="cart.length >= 1">
            <li v-for="book in cart">
              <input
                type="checkbox"
                v-model="book.checked"
                @change="insertOrRemove(book)"
              />
              <img class="cart_img" :src="book.img" />
              <span>{{ book.title }}</span>
              <span>가격: {{ getPrice(book) }}</span>
              <span>마일리지: {{ getPoint(book) }}</span>
              <button @click="decreaseQuantity(book)">-</button>
              <span>수량: {{ book.quantity }}</span>
              <button @click="increaseQuantity(book)">+</button>
              <p></p>
            </li>
          </span>
        </ol>
        <div class="footer"></div>
      </div>
    </div>

    <div class="payment_area">
      <div class="payment_value">{{ getTotalPrice }}</div>
      <div class="payment_pee">{{ pee }}</div>
      <hr />
      <div class="payment_total">{{ getFinalPrice }}</div>
      <div class="payment_point">{{ totalPoint }}</div>
      <button @click="choosePay">선택 결제</button>
      <button @click="allPay">전체 결제</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      cart: [
        //책 데이터 예시
        {
          img: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791192512365.jpg",
          title: "Book 1",
          price: 9900,
          point: 50,
          quantity: 1,
          book_no: 1,
        },
        {
          img: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791192512365.jpg",
          title: "Book 2",
          price: 24000,
          point: 30,
          quantity: 1,
          book_no: 2,
        },
      ],
      select: [],
      selectAll: false,
    };
  },
  methods: {
    increaseQuantity(book) {
      //장바구니 수량 늘리기

      book.quantity++;
    },
    choosePay() {
      console.log("선택된 상품들의 결제 정보:");

      // 선택된 상품들만 필터링하여 가져옵니다.
      const selectedBooks = this.cart.filter((book) =>
        this.select.includes(book.book_no)
      );

      let TP = 0; //총 결제 금액
      let TP2 = 0; //총 포인트

      // 선택된 상품들에 대한 결제 정보를 콘솔로 출력합니다.
      selectedBooks.forEach((book) => {
        console.log("--------------");
        console.log("책 제목:", book.title);
        console.log("가격:", this.getPrice(book)); // 함수로 호출하여 계산 결과를 출력합니다.
        console.log("마일리지:", this.getPoint(book)); // 함수로 호출하여 계산 결과를 출력합니다.
        console.log("수량:", book.quantity);

        TP += this.getPrice(book);
        TP2 += this.getPoint(book);
      });

      console.log("--------------");
      console.log("선택된 상품들의 총 결제 금액:", TP); // 함수로 호출하여 계산 결과를 출력합니다.
      console.log("선택된 상품들의 총 포인트:", TP2); // 함수로 호출하여 계산 결과를 출력합니다.
      console.log("==============");
    },
    allPay() {
      this.selectAllItems();

      console.log("전체 상품들의 결제 정보:");

      // 모든 상품에 대한 결제 정보를 가져옵니다.
      const allBooks = this.cart;

      let TP = 0; //총 결제 금액
      let TP2 = 0; //총 포인트

      let bookData = [];

      // 모든 상품에 대한 결제 정보를 콘솔로 출력합니다.
      allBooks.forEach((book) => {
        console.log("--------------");
        console.log("책 제목:", book.title);
        console.log("가격:", this.getPrice(book)); // 함수로 호출하여 계산 결과를 출력합니다.
        console.log("마일리지:", this.getPoint(book)); // 함수로 호출하여 계산 결과를 출력합니다.
        console.log("수량:", book.quantity);

        TP += this.getPrice(book);
        TP2 += this.getPoint(book);

        bookData.push({
          book_no: book.book_no,
          quantity: book.quantity,
        });
      });

      console.log("--------------");
      console.log("총 결제 금액:", TP); // 함수로 호출하여 계산 결과를 출력합니다.
      console.log("포인트:", TP2); // 함수로 호출하여 계산 결과를 출력합니다.
      console.log("==============");

      axios({
        url: "http://localhost:3000/test",
        method: "POST",
        data: {
          "총 결제 금액": TP,
          "총 포인트": TP2,
          "상품 정보": bookData,
        },
      });
    },
    decreaseQuantity(book) {
      //장바구니 수량 줄이기
      if (book.quantity === 1) {
        //한개 이상은 못줄이게 하기
        return;
      }
      book.quantity--;
    },
    insertOrRemove(book) {
      // 배열에 book.book_no가 없으면 해당 값을 추가
      // 배열에 이미 book.book_no가 있으면 해당 값을 제거하는 filter 적용

      if (book.checked && !this.select.includes(book.book_no)) {
        this.select.push(book.book_no); // 체크되어 있고, 배열에 없는 경우 추가
      } else if (!book.checked && this.select.includes(book.book_no)) {
        this.select = this.select.filter(
          (selectedBookNo) => selectedBookNo !== book.book_no
        ); // 체크가 해제되고, 배열에 있는 경우 제거
      }
      console.log(this.select);
    },
    selectAllItems() {
      for (const book of this.cart) {
        book.checked = this.selectAll;
        this.insertOrRemove(book);
      }
    },
    handleChildCheckboxChange() {
      // 모든 자식 체크박스가 선택되어 있는지 확인합니다.
      const allChildChecked = this.cart.every((book) => book.checked);

      // 부모 체크박스의 상태를 업데이트합니다.
      this.selectAll = allChildChecked;
    },
  },
  computed: {
    // 데이터 값이 바뀌면 실행 되는것?
    getPrice(book) {
      //버튼으로 수량을 바꾸면 실행
      return (book) => book.price * book.quantity; //값 * 수량
    },
    getPoint(book) {
      //버튼으로 수량바꾸면 실행
      const point = (book) => book.point * book.quantity; //마일리지 * 수량
      return point;
    },
    getTotalPrice() {
      //선택한 상품들 총합 가격
      const selectedBooks = this.cart.filter((book) =>
        this.select.includes(book.book_no)
      ); //책 정보가 있는 배열에서 체크가 된것만 필터링

      const totalPrice = selectedBooks.reduce(
        (total, book) => total + book.price * book.quantity,
        0
      ); //선택된것만 값 총합 가져오기

      return totalPrice; //리턴
    },
    pee() {
      if (this.getTotalPrice > 15000) {
        return 0;
      } else {
        return 2500;
      }
    },
    getFinalPrice() {
      //최종 결제 가격 함수
      return this.getTotalPrice + this.pee;
    },
    totalPoint() {
      //결제 시 얻는 포인트
      const selectedBooks = this.cart.filter((book) =>
        this.select.includes(book.book_no)
      ); //책 정보가 있는 배열에서 체크가 된것만 필터링

      const totalPoint = selectedBooks.reduce(
        (total, book) => total + book.point * book.quantity,
        0
      ); //선택된것만 값 총합 가져오기

      return totalPoint;
    },
  },
  mounted() {},
  watch: {
    // 자식 체크박스 상태 변경 감지
    cart: {
      handler() {
        this.handleChildCheckboxChange();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.cart_img {
  text-align: center;
  max-height: 230px;
  margin-top: auto;
}
.footer {
  padding-bottom: 100px;
}
.cart_header {
  padding: 20px 36px 20px 0;
  border-top: 1px solid #000;
  border-bottom: 1px solid #d5d5d5;
}
.container {
  margin-bottom: 20px;
}
.cart_wrap {
  position: relative;
  margin-top: 13%;
  margin-left: 5%;
  padding-bottom: 5%;
  width: 65%;
  max-height: 200px;
}
.cart_list li {
  /* margin: auto; */

  width: 100%;
  height: 250px;
  border-bottom: 1px solid #d5d5d5;
  border-right: 1px solid #d5d5d5;
  padding: 1%;
}
.payment_area {
  width: 450px;
  height: 600px;
  background-color: #ffffff;
  margin-left: 20px;
  margin-top: 2%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #050505;
  border-radius: 5%;
  position: fixed;
  right: 10%;
  top: 13%;
}
</style>
