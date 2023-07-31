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
                class="book_checkbox"
              />
              <img class="cart_img" :src="book.img" />
              <span class="book_name">{{ book.title }}</span>&nbsp;
              <span class="book_price">{{ book.price }} 원</span>
              <span class="book_point">적립포인트 &nbsp;&nbsp;&nbsp;{{ getPoint(book) }}</span>
              <div class="changeQua">
                <div class="button">
                  <button @click="decreaseQuantity(book)">-</button>
                  <span>{{ book.quantity }}</span>
                  <button @click="increaseQuantity(book)">+</button>
                </div>
                <p>{{ getPrice(book) }} 원</p>
              </div>
              <p></p>
            </li>
          </span>
        </ol>
        <div class="footer"></div>
      </div>
    </div>
    
    <div class="payment_area">
      <div class="payment_value">상품금액 <span class="getTotalPrice">{{ getTotalPrice }} <span class="unit">원</span></span></div>
      <div class="payment_pee">배송비 <span class=fee>{{ fee }} <span class="unit">원</span></span></div>
      <br><br><br><br><br><br><br><br>
      <hr />
      <div class="payment_total">결제금액 {{ getFinalPrice }}</div>
      <div class="payment_point">총 적립 포인트{{ totalPoint }}</div>
      <button @click="choosePay">선택 결제</button>
      <button @click="allPay">전체 결제</button>
    </div>
  </div>
  <div class="progress"><span class="first">장바구니</span> <span class="right">> 주문/결제> 완료</span></div>
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
          title: "엄청나게 긴 책 제목 테스트입니다 아무튼간에",
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
        {
          img: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791192512365.jpg",
          title: "Book 2",
          price: 24000,
          point: 30,
          quantity: 1,
          book_no: 3,
        },
        {
          img: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791192512365.jpg",
          title: "Book 2",
          price: 24000,
          point: 30,
          quantity: 1,
          book_no: 4,
        },
        {
          img: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791192512365.jpg",
          title: "Book 2",
          price: 24000,
          point: 30,
          quantity: 1,
          book_no: 5,
        },
        {
          img: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791192512365.jpg",
          title: "Book 2",
          price: 24000,
          point: 30,
          quantity: 1,
          book_no: 6,
        }
        
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
      // 선택된 상품들만 필터링하여 가져옵니다.
      const selectedBooks = this.cart.filter((book) =>
        this.select.includes(book.book_no)
      );

      let TP = 0; //총 결제 금액
      let TP2 = 0; //총 포인트
      let thisFee = 0;

      let bookData = [];

      selectedBooks.forEach((book) => {
        TP += this.getPrice(book);
        TP2 += this.getPoint(book);

        bookData.push({
          ORDERITEM_BOOKID: book.book_no,
          ORDERITEM_CNT: book.quantity,
          ORDERITEM_PRICE: book.price,
          ORDERITEM_POINT: this.getPoint(book),
        });
      });

      

        if(TP>=15000) { //결제금액이 15000원이상이면 배송료 0원으로 설정
        thisFee = 0;
      } else if(TP<15000) {
        thisFee = 2500;
      }

      axios({
        url: "http://localhost:3000/cart",
        method: "POST",
        data: {
          "email": "bj3757@naver.com",
          "total_pay": TP,
          "total_point": TP2,
          "fee": thisFee,
          "books_info": bookData,
        },
      }).then((res=>{
        if(res.status == 401) {
          console.log("에러 발생: "+res.data.error);
        } else if(res.status == 200) {
          const orderId = res.data.orderID;
          alert('결제페이지로 이동합니다');
          window.location.href = `/pay/${orderId}`;
        } 
      })).catch(error=>{
        console.log(error);
      });
    },
    allPay() {
      const allBooks = this.cart; //장바구니에 담긴 책 정보 전부 담아오기

      let TP = 0; //총 결제 금액
      let TP2 = 0; //총 포인트
      let thisFee = 0;

      let bookData = [];

      // 모든 상품에 대한 결제 정보를 콘솔로 출력합니다.
      allBooks.forEach((book) => {
        TP += this.getPrice(book);
        TP2 += this.getPoint(book);

        bookData.push({
          ORDERITEM_BOOKID: book.book_no,
          ORDERITEM_CNT: book.quantity,
          ORDERITEM_PRICE: book.price,
          ORDERITEM_POINT: this.getPoint(book),
        });
      });
      
      if(TP>=15000) { //결제금액이 15000원이상이면 배송료 0원으로 설정
        thisFee = 0;
      } else if(TP<15000) {
        thisFee = 2500;
      }

      axios({
        url: "http://localhost:3000/cart",
        method: "POST",
        data: {
          "email": "bj3757@naver.com",
          "total_pay": TP,
          "total_point": TP2,
          "fee": thisFee,
          "books_info": bookData,
        },
      }).then((res=>{
        if(res.status == 401) {
          console.log("에러 발생: "+res.data.error);
        } else if(res.status == 200) {
          const orderId = res.data.orderID;
          alert('결제페이지로 이동합니다');
          window.location.href = `/pay/${orderId}`;
        } 
      })).catch(error=>{
        console.log(error);
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
    fee() {
      if (this.getTotalPrice > 15000) {
        return 0;
      } else {
        return 2500;
      }
    },
    getFinalPrice() {
      //최종 결제 가격 함수
      return this.getTotalPrice + this.fee;
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
  max-height: 200px;
  margin-top: 20px;
}
.footer {
  padding-bottom: 100px;
}
.cart_header {
  padding: 20px 36px 1px 0;
  font-size: 1.4em;
  border-bottom: 5px double #000000;
}
.container {
  margin-bottom: 20px;
}
.cart_wrap {
  position: relative;
  margin-top: 8.65%;
  margin-left: 11%;
  padding-bottom: 5%;
  width: 50%;
  max-height: 200px;
}
.cart_list li {
  width: 100%;
  height: 250px;
  border-bottom: 2px solid #000000;
  list-style:none;
}
.payment_area {
  width: 450px;
  height: 600px;
  background-color: #ffffff;
  margin-left: 20px;
  margin-top: 8.9%;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 5%;
  position: fixed;
  right: 12%;
  top: 13%;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
}
.book_checkbox {
  margin-right: 3%;
  position: absolute;
  left: 5px;
  border: none;
  margin-top: 20px;
  background-color: #eee;
}
.book_name {
  position: absolute;
  margin-left: 15px;
  margin-top: 20px;
  font-weight: 700;
  font-size: larger;
}
.book_price {
  position: absolute;
  margin-left: 5px;
  margin-top: 45px;
}
.book_point {
  margin-left: 5px;
}
.changeQua {
  float: right;
  text-align: center;
  width: 300px;
  height: 249px;
  border-left: 2px solid #050505;
  margin: auto;
}
.changeQua .button {
 
  margin-top: 100px;
  margin-left: 80px;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  width: 120px;
  height: 30px;
  border: 1px solid #050505;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.changeQua .button button {
  border: none;
  background-color: white;
  cursor: pointer;
  font-size: larger;
  margin-left: 10px;
  margin-right: 10px;
  width: 30px;
  height: 30px;
}
.progress{
  position: absolute;
  top: 240px;
  right: 170px;
  font-size: 1.4em;
  font-weight: bolder;
}
.first {
  color: #4E4EFF;
}
.right {
  color: rgb(158, 158, 158);
}
.payment_value {
  margin-top: 20%;
  margin-left: 10%;
  
  white-space: nowrap;
}
.getTotalPrice {
  margin-left: 60%;
  
}
.payment_pee {
  margin-top: 5%;
  margin-left: 10%;
  
  white-space: nowrap;
}
.fee {
  margin-left: 60%;
  
}
.unit {
  margin-right: 10%;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: -0.01em;
  vertical-align: 1px;

}
</style>
