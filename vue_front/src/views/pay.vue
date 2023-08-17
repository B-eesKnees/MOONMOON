<style src="../assets/css/pay.css"></style>
<template>
    <div>
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
                <div class="user_point">{{ point }} P</div>
            </div>
            <div class="pay_area_ex">
                <div class="pay_wrap_ex">
                    <div class="pay_before">
                        <span class="pay_text">상품 금액</span>
                        <span class="won_ex">{{ originalPrice }} 원</span>
                    </div>
                    <div class="pay_fee">
                        <span class="pay_text">배송비</span>
                        <span class="won_ex">{{ deliveryFee }} 원</span>
                    </div>
                    <div class="pay_usePoint">
                        <span class="pay_text">할인 금액</span>
                        <span class="point">- {{ discountAmount }} 원</span>
                    </div>
                    <hr />
                    <div class="pay_after">
                        <span class="pay_text">결제 금액</span>
                        <span class="won_ex">{{ finalPrice }} 원</span>
                    </div>
                    <div class="pay_getPoint">
                        <span class="pay_text">총 적립 포인트</span>
                        <span class="won_ex">{{ earnPoint }} P</span>
                    </div>
                    <div class="pay_button_wrap">
                        <button class="pay_button_ex" type="button" @click="startPay">결제하러 가기</button>
                    </div>
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
            user_name: "",
            user_phone: "",
            user_zipcode: "",
            user_add1: "",
            user_add2: "",
            user_email: ``,
            books: [],
            coupons: [],
            point: "",
            nextDay: "",
            month: "",
            selectedCoupon: "",
            isModalOpen: true,
            payID: this.$route.query.payid,
            userEmail: localStorage.getItem("userID"),
            originalPrice: "12345",
            deliveryFee: "1234",
            discountAmount: "1234",
            finalPrice: "1234",
            earnPoint: "23",
            applyCouponPrice: "",
        };
    },
    mounted() {
        this.getNextDate();
        this.getUserInfo();
        this.getBookInfo();
        this.getCouponList();
        this.getUserPoint();
        console.log(this.$route.query.payid);
        console.log(this.payID);
    },
    methods: {
        getUserInfo() {
            const email = this.userEmail;

            axios({
                url: "/pay/payUserInfo",
                method: "post",
                data: { userEmail: email },
            }).then((res) => {
                this.user_name = res.data[0].USER_NAME;
                this.user_phone = res.data[0].USER_PHONE;
                this.user_zipcode = res.data[0].USER_ZIPCODE;
                this.user_add1 = res.data[0].USER_ADD1;
                this.user_add2 = res.data[0].USER_ADD2;
            });
        },
        getNextDate() {
            //내일 배송일로 나오게 하는 함수
            const today = new Date();
            this.nextDay = today.getDate() + 1;
            this.month = today.getMonth() + 1;
        },
        getBookInfo() {
            const payid = this.payID;

            axios({
                url: "/pay/payBookInfo",
                method: "post",
                data: { payID: [payid] },
            }).then((res) => {
                this.books = res.data;
            });
        },
        getCouponList() {
            const email = this.userEmail;

            axios({
                url: "/pay/couponList",
                method: "get",
                params: { userEmail: email },
            }).then((res) => {
                this.coupons = res.data;
            });
        },
        getUserPoint() {
            const email = this.userEmail;

            axios({
                url: "/pay/userPoint",
                method: "get",
                params: { userEmail: email },
            }).then((res) => {
                this.point = res.data[0].USER_POINT;
            });
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
        applyCoupon() {
            const payload = {
                selectedCoupon: this.selectedCoupon,
                selectedCouponRatio: this.coupons.ratio,
                originalPrice: 10000,
            };

            axios
                .post("/pay/applyCoupon", payload)
                .then((response) => {
                    const applyCouponPrice = response.data.applyCouponPrice;
                })
                .catch((error) => {
                    console.error(error);
                });
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
