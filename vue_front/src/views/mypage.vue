<template>
    <GnbBar />
    <myPage_top />
    <div class="mypage_menu">
        <myPageSide />
    </div>
    <div class="right_box">
        <h1 class="mypage_title_big">전체 주문내역</h1>
        <div class="filter-container">
            <div class="date-filter">
                <input type="date" v-model="startDate" />
                ~
                <input type="date" v-model="endDate" />
                <!-- <button class="orderinfo_btn" @click="fetchFilteredOrders">검색</button> -->
            </div>

            <div class="order-search">
                <label>주문 검색:</label>
                <input class="mypage_book_search" type="text" v-model="orderKeyword" placeholder="책 이름 검색" />
                <button class="orderinfo_btn" @click="searchOrders">검색</button>
            </div>

            <div class="status-filter">
                <label>배송 상태별 조회:</label>
                <select v-model="selectedStatus">
                    <option value="전체">전체</option>
                    <option value="배송준비">배송준비</option>
                    <option value="배송중">배송중</option>
                    <option value="배송완료">배송완료</option>
                    <option value="주문취소">주문취소</option>
                </select>
                <button class="orderinfo_btn" @click="fetchOrdersByStatus">조회</button>
            </div>
        </div>

        <div class="order-list">
            <div v-for="order in filteredOrders" :key="order.ORDER_ID" class="order-box">
                <!-- 왼쪽에 배송 상태 및 결제일 -->
                <div class="order_status">
                    <div :class="{
                        mypage_completed_order: order.ORDER_STATE === '배송완료',
                        mypage_delivery: order.ORDER_STATE === '배송중',
                        mypage_delivery_cancle: order.ORDER_STATE === '주문취소',
                    }" class="mypage_order_state" @click="
    setSelectedStatus(order.ORDER_STATE);
fetchOrdersByStatus();
">
                        {{ order.ORDER_STATE }}
                    </div>
                    <div class="book-cover">
                        <img :src="order.items[0].BOOK_COVER" alt="Book Cover" />
                    </div>
                </div>

                <!-- 오른쪽에 책 정보 -->
                <div class="book_info">
                    <div>{{ order.ORDER_PAYDATE }}</div>
                    <p class="mypage_book_title">
                        {{ order.items[0].BOOK_TITLE }}
                        <span class="mypage_ordercnt" v-if="order.ORDER_CNT > 1"><span class="order_cnt_out"> 외</span> {{
                            order.ORDER_CNT - 1 }} 건</span>
                    </p>
                    <p class="mypage_orderpay">{{ formatNumber(order.ORDER_PAY) }}원</p>
                    <p>주문 상세</p>
                    <button v-if="order.ORDER_STATE === '배송완료'" class="confirm-button">구매확정</button>
                    <button v-if="order.ORDER_STATE === '배송준비'" class="confirm-button">주문취소</button>
                </div>

                <!-- 구매확정 버튼 -->
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import "@/assets/css/myPage.css";
import GnbBar from "../components/gnbBar.vue";
import myPage_top from "../components/myPage_top.vue";
import myPageSide from "../components/myPageSide.vue";

export default {
    name: "",
    components: { GnbBar, myPage_top, myPageSide },
    data() {
        return {
            startDate: null,
            endDate: null,
            orderKeyword: "",
            selectedStatus: "전체",
            orderList: [],
            orderState: "",
        };
    },
    created() {
        this.email = localStorage.getItem("userID");
    },
    mounted() {
        this.orderHistory();
    },
    computed: {
        filteredOrders() {
            if (!this.startDate || !this.endDate) {
                return this.orderList; // 날짜가 선택되지 않은 경우 원래 주문 목록을 반환합니다
            }

            const startTimestamp = new Date(this.startDate).getTime();
            const endTimestamp = new Date(this.endDate).getTime();

            return this.orderList.filter((order) => {
                const orderDate = new Date(order.ORDER_PAYDATE).getTime();
                return orderDate >= startTimestamp && orderDate <= endTimestamp;
            });
        },
    },
    methods: {
        searchOrders() {
            axios({
                url: "http://localhost:3000/mypage/ordersearchbook",
                method: "get",
                params: {
                    userEmail: this.email,
                    bookKeyword: this.orderKeyword,
                },
            })
                .then((response) => {
                    console.log(response.data);
                    this.orderList = response.data;
                })
                .catch((error) => {
                    console.error("주문 검색 오류:", error);
                });
        },
        setSelectedStatus(status) {
            this.selectedStatus = status;
        },
        fetchOrdersByStatus() {
            if (this.selectedStatus === "전체") {
                // "전체" 옵션을 선택하였을 때, 이미 가져온 전체 주문 목록을 그대로 사용
                this.orderHistory();
            } else {
                // 다른 상태를 선택한 경우, 해당 상태의 주문을 가져와서 표시
                axios({
                    url: "http://localhost:3000/mypage/orderdelivery",
                    method: "get",
                    params: {
                        userEmail: this.email,
                        orderState: this.selectedStatus,
                    },
                })
                    .then((response) => {
                        console.log(response.data);
                        this.orderList = response.data;
                    })
                    .catch((error) => {
                        console.error("배송 상태별 조회 오류:", error);
                    });
            }
        },
        // 주문 목록을 표시하는 코드 및 API 호출 메서드 추가
        orderHistory() {
            axios({
                url: "http://localhost:3000/mypage/orderHistory",
                method: "get",
                params: {
                    userEmail: this.email,
                },
            })
                .then((response) => {
                    console.log(response.data); // 가져온 데이터 확인
                    this.orderList = response.data; // 수정된 부분
                })
                .catch((error) => {
                    console.error("주문내역 가져오기 오류:", error);
                });
        },
        formatNumber(number) {
            // 숫자를 천 단위마다 쉼표가 있는 형식으로 변환
            return new Intl.NumberFormat().format(number);
        },
    },
};
</script>
