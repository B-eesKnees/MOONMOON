<template>
    <gnbBar />
    <div class="payment_total_ex">
        <div class="payment_title">주문/결제</div>
        <div class="progress">
            <span class="before">장바구니> <span class="now">주문/결제</span>> 완료 </span>
        </div>
        <div class="user_info">
            <div class="payment_date">
                <div class="info1">배송지 정보</div>
                <div class="info2">
                    <span>내일({{ month }}/{{ nextDay }})</span> 도착 예정
                </div>
            </div>
            <div class="user_add">
                <div class="user_info1">
                    <div class="user_name">{{ user_name }}</div>
                    <span> / </span>
                    <div class="user_phone">{{ user_phone }}</div>
                </div>
                <div class="user_add_detail">
                    {{ user_zipcode }} {{ user_add1 }} {{ user_add2 }}
                    <button type="button" @click="openAdd">변경</button>
                </div>
            </div>
        </div>
        <div class="payment_book_info">
            <table>
                <colgroup>
                    <col />
                </colgroup>
                <thead>
                    <th>
                        <div class="text">주문 상품</div>
                        <div class="num">총 3 개</div>
                    </th>
                </thead>

                <tbody>
                    <tr v-for="book in books" :key="book.id">
                        <td class="prod">
                            <div class="prod_area horizontal">
                                <div class="prod_thumb_box size_sm">
                                    <span class="img_box">
                                        <img :src="book.image" :alt="book.name" />
                                    </span>
                                </div>
                                <div class="prod_info_box">
                                    <div class="prod_info">
                                        <div class="prod_name">{{ book.name }}</div>
                                        <div class="book_price">{{ book.price }}원</div>
                                        <div class="book_q">{{ book.quantity }}개</div>
                                        <div class="book_total">{{ book.totalPrice }}원</div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="use_coupon">
            <div class="coupon_text">할인 쿠폰</div>
            <select v-model="selectedCoupon" class="choice_coupon">
                <option disabled value="">쿠폰을 선택하세요</option>
                <option v-for="coupon in coupons" :key="coupon.name" :value="coupon.value">
                    {{ coupon.name }}
                </option>
            </select>
            <button @click="applyCoupon">사용</button>
        </div>
        <div class="use_point">
            <div class="point_text">포인트</div>
            <input type="text" />
            <button @click="applyPoint">사용</button>
            <div class="user_havePoint">보유 포인트 : &nbsp;</div>
            <div class="user_point">20000P</div>
        </div>
        <div class="pay_area_ex">
            <div class="pay_wrap_ex">
                <div class="pay_before">
                    <span class="pay_text">상품 금액</span>
                    <span class="won_ex">46000 원</span>
                </div>
                <div class="pay_fee">
                    <span class="pay_text">배송비</span>
                    <span class="won_ex">0 원</span>
                </div>
                <div class="pay_usePoint">
                    <span class="pay_text">사용 포인트</span>
                    <span class="point">0 P</span>
                </div>
                <hr />
                <div class="pay_after">
                    <span class="pay_text">결제금액</span>
                    <span class="won_ex">46000 원</span>
                </div>
                <div class="pay_getPoint">
                    <span class="pay_text">총 적립 포인트</span>
                    <span class="won_ex">2300 P</span>
                </div>
                <div class="pay_button_wrap">
                    <button class="pay_button_ex" type="button" @click="startPay">결제하러 가기</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import gnbBar from "@/components/gnbBar.vue";
import axios from "axios";

export default {
    components: { gnbBar },
    data() {
        return {
            user_name: "홍길동",
            user_phone: "010-2222-2222",
            user_zipcode: "01484",
            user_add1: "주소1테스트",
            user_add2: "주소2테스트",
            user_email: `bj3757@gmail.com`,
            books: [
                {
                    id: 1,
                    name: "강원국의 진짜 공부",
                    image: "https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9791165702205.jpg",
                    quantity: "1",
                    price: "15,300",
                    totalPrice: "35,100",
                },
                {
                    id: 2,
                    name: "거의 모든 순간의 미술사",
                    image: "https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9788972917984.jpg",
                    quantity: "1",
                    price: "35,100",
                    totalPrice: "35,100",
                },
            ],
            coupons: [
                { name: "쿠폰 1", value: 1000 },
                { name: "쿠폰 2", value: 2000 },
                { name: "쿠폰 3", value: 3000 },
                // 추가적인 쿠폰들을 원하는 만큼 배열에 추가합니다.
            ],
            nextDay: "",
            month: "",
            selectedCoupon: "",
            isModalOpen: true,
            payID: this.$route.query.payid,
            userEmail: localStorage.getItem("userID"),
        };
    },
    mounted() {
        this.getNextDate();
        // this.getUserInfo();
        console.log(this.$route.query.payid);
        console.log(this.payID);
    },
    methods: {
        getUserInfo() {
            const email = this.userEmail;

            axios({
                url: "/pay/payUserInfo",
                method: "GET",
                data: { userEmail: email },
            }).then((res) => {
                console.log(res.data);
            });
        },
        getNextDate() {
            //내일 배송일로 나오게 하는 함수
            const today = new Date();
            this.nextDay = today.getDate() + 1;
            this.month = today.getMonth() + 1;
        },
        openAdd() {
            const confmKey = "devU01TX0FVVEgyMDIzMDgwMzE2NTY0NDExMzk4ODQ=";
            const returnUrl = "http://localhost:8080/pay";
            const resultType = "4";
            const useDetailAddr = "N";

            // 주소검색 팝업 API 호출 URL을 생성합니다.
            const apiUrl = `https://business.juso.go.kr/addrlink/addrLinkUrl.do?confmKey=${confmKey}&returnUrl=${returnUrl}&resultType=${resultType}&useDetailAddr=${useDetailAddr}`;

            // 팝업창을 엽니다.
            window.open(apiUrl, "주소검색팝업", "width=570, height=420, toolbar=no, menubar=no, scrollbars=yes, resizable=no");
        },
        startPay() {
            const IMP = window.IMP;
            IMP.init("imp18828153");
            IMP.request_pay(
                {
                    // param
                    pg: "inicis",
                    pay_method: "card",
                    name: `${this.user_name}`,
                    amount: 1, //결제 금액
                    buyer_email: `${this.user_email}`,
                    buyer_name: `${this.user_name}`,
                    buyer_tel: `${this.user_phone}`,
                    buyer_addr: `${this.user_add1} ${this.user_add2}`,
                    buyer_postcode: "01181", //고유번호..?
                },
                (rsp) => {
                    // callback
                    if (rsp.success) {
                        alert("!");
                        console.log(rsp.success);
                        console.log(rsp);
                    } else {
                        alert("?");
                    }
                }
            );
        },
    },
};
</script>

<style scoped>
/* 예시 CSS 스타일 */
/* 테이블 스타일 */
.payment_book_info table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}
.payment_book_info td {
    background-color: white;
}

.payment_book_info th,
.payment_book_info td {
    padding: 8px;
    border: 1px solid #ccc;
}

.payment_book_info th {
    display: flex;
    border: none;
}
.payment_book_info th .num {
    margin-left: 5%;
    margin-top: 8px;
}
.payment_book_info th .text {
    margin-left: 2%;
    font-size: 1.4em;
    font-weight: bold;
    margin-top: 5px;
    margin-bottom: 5px;
}

/* 상품 정보 스타일 */
.prod_area {
    display: flex;
    align-items: center;
}

.prod_thumb_box {
    margin-right: 10px;
}

.prod_info_box {
    flex: 1;
    position: relative;
    width: 100%;
}

.payment_book_info {
    position: relative;
    width: 67%;
    padding-left: 7%;
    margin-top: 1%;
}
.user_info {
    margin: 0 30% 2% 7%;
    width: 60%;
    border: 1px solid #ccc;
    padding: 1%;
    margin-top: 1%;
    display: flex;
    align-items: center;
    background-color: white;
    top: 30px;
    position: relative;
}
.payment_date {
    text-align: center;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: centers;
    width: 20%;
    height: 50px;
    margin-bottom: 0;
}
.payment_total {
}

.user_add {
    margin-left: 20px;
}
.user_info1 {
    display: flex;
}
.user_info1 span {
    margin-left: 10px;
    margin-right: 10px;
}
.payment_date .info1 {
    font-weight: bold;
    font-size: 1.2em;
    margin-bottom: 5px;
}
.payment_date .info2 {
    color: #4e4eff;
}
.payment_date .info2 span {
    font-weight: bold;
}
.use_coupon {
    margin: 0 30% 0 7%;
    width: 60%;
    border: 1px solid #ccc;
    padding: 1%;
    margin-top: 1%;
    display: flex;
    align-items: center;
    background-color: white;
}
.choice_coupon {
    margin-left: 10px;
    width: 20%;
}
.use_coupon button {
    margin-left: 10px;
    width: 60px;
    height: 25px;
    background-color: white;
    border-radius: 12%;
    border: 1px solid #000;
}
.use_coupon .coupon_text {
    font-weight: bold;
}
.use_point {
    margin: 0 30% 10% 7%;
    width: 60%;
    border: 1px solid #ccc;
    padding: 1%;
    margin-top: 1%;
    display: flex;
    align-items: center;
    background-color: white;
}
.use_point .point_text {
    font-weight: bold;
}
.use_point input {
    margin-left: 32px;
    height: 25px;
}
.use_point button {
    margin-left: 10px;
    width: 60px;
    height: 25px;
    border-radius: 12%;
    border: 1px solid #000;
    background-color: white;
}
.user_havePoint {
    margin-left: 10px;
}
.pay_area_ex {
    position: fixed;
    width: 17%;
    height: 35%;
    top: 29.5%;
    left: 68%;
    border: 1px solid #ccc;
    background-color: white;
    border-radius: 12%;
}
.prod_name {
    position: relative;
    margin-left: 2%;
    font-weight: bold;
}
.book_price {
    position: relative;
    top: -20px;
    margin-left: 2%;
}
.book_q {
    position: relative;
    top: -65px;
    margin-right: 5%;
    text-align: right;
}
.book_total {
    position: relative;
    width: 300px;
    top: -45px;
    float: right;
    text-align: right;
    margin-right: 5%;
    font-weight: bold;
}
.user_add_detail button {
    margin-left: 10px;
    width: 60px;
    height: 25px;
    border-radius: 12%;
    background-color: white;
    border: 1px solid #000;
}
.pay_wrap_ex {
    margin: 40px 35px 0 30px;
}
.won_ex {
    text-align: right;
    float: right;
}
.pay_fee {
    margin-top: 20px;
}
.point {
    text-align: right;
    float: right;
    left: 100px;
}
.pay_usePoint {
    margin-top: 20px;
    margin-bottom: 10px;
}
.pay_after {
    margin-top: 25px;
}
.pay_getPoint {
    margin-top: 17px;
}
.pay_button_ex {
    position: relative;
    width: 95%;
    height: 55px;
    border-radius: 12px;
    border: none;
    background-color: #4e4eff;
    color: white;
    margin-top: 25px;
    margin-left: 9px;
    text-align: center;
}

.pay_text {
    font-weight: bold;
    font-size: large;
}
.payment_title {
    position: relative;
    font-size: 1.6em;
    font-weight: bolder;
    margin-left: 7%;
    margin-top: 2%;
}
.progress {
    position: absolute;
    top: 22%;
    right: 15%;
    font-size: 1.4em;
    font-weight: bolder;
}
.before {
    color: rgb(158, 158, 158);
}
.now {
    color: #4e4eff;
}
.img_box img {
    max-height: 280px;
    height: 280px;
    width: 190px;
    border: 1px solid rgb(138, 138, 138);
    object-fit: scale-down;
}
</style>
