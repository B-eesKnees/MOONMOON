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
                <button class="orderinfo_btn" @click="fetchFilteredOrders">검색</button>
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
            <div v-for="order in orderList" :key="order.ORDER_ID" class="order-box">
                <!-- 왼쪽에 배송 상태 및 결제일 -->
                <div class="order-status">
                    <p>배송상태: {{ order.ORDER_STATE }}</p>
                    <p>결제일: {{ order.ORDER_DATE }}</p>
                </div>

                <!-- 왼쪽에 책 표지 -->
                <div class="book-cover">
                    <img :src="order.BOOK_COVER" alt="Book Cover" />
                </div>

                <!-- 오른쪽에 책 정보 -->
                <div class="book-info">
                    <p>책 제목: {{ order.BOOK_TITLE }}</p>
                    <p>가격: {{ order.BOOK_PRICE }}</p>
                    <p>주문 상세: {{ order.ORDER_DETAIL }}</p>
                </div>

                <!-- 구매확정 버튼 -->
                <button v-if="order.ORDER_STATE === '배송완료'" class="confirm-button">구매확정</button>
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
            orderList: [], // 주문 목록을 저장할 배열
        };
    },
    created() {
        this.email = localStorage.getItem("userID");
    },
    mounted() {
        this.orderHistory();
    },
    methods: {
        fetchFilteredOrders() {
            // 선택한 날짜 범위로 주문 목록을 가져오는 로직
            // axios.get(...)를 사용하여 API 호출
        },
        searchOrders() {
            // 주문 검색 로직
            // axios.get(...)를 사용하여 API 호출
        },
        fetchOrdersByStatus() {
            // 선택한 배송 상태별로 주문 목록을 가져오는 로직
            // axios.get(...)를 사용하여 API 호출
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
                    this.order = response.data[0];
                })
                .catch((error) => {
                    console.error("주문내역 가져오기 오류:", error);
                });
        },
    },
};
</script>
