<template>
    <div class="topMyPage"><a href="/mypage">마이페이지</a></div>
    <div>
        <h2 class="sideName">
            쇼핑내역
            <hr />
            <div class="borderSideList">
                <a href="#">
                    <div @click="activeElement = 'orderList'" :class="{ sideList: true, activeText: isActiveText('orderList') }">
                        주문/배송목록
                    </div></a
                >

                <a href="/mypagereview">
                    <div @click="activeElement = 'myReview'" :class="{ sideList: true, activeText: isActiveText('myReview') }">마이리뷰</div>
                </a>
            </div>
        </h2>
    </div>

    <div>
        <h2 class="sideName">
            회원정보
            <hr />
            <div class="borderSideList">
                <a href="/mypageuserinfo">
                    <div @click="activeElement = 'userInfoControl'" :class="{ sideList: true, activeText: isActiveText('userInfoControl') }">
                        회원정보관리
                    </div></a
                >
                <a href="#"
                    ><div @click="activeElement = 'userGrade'" :class="{ sideList: true, activeText: isActiveText('userGrade') }">회원등급</div>
                </a>
            </div>
        </h2>
    </div>
    <div>
        <h2 class="sideName">
            <a href="/event">이벤트</a>
            <hr />
            <div class="borderSideList">
                <a href="/event"> <div @click="activeElement = 'myRoul'" :class="{ sideList: true, activeText: isActiveText('myRoul') }">룰렛</div></a
                ><a href="/event">
                    <div @click="[(activeElement = 'myAtt'), setTapName()]" :class="{ sideList: true, activeText: isActiveText('myAtt') }">
                        출석체크
                    </div></a
                >
            </div>
        </h2>
    </div>

    <div>
        <h2 class="sideName">
            고객센터
            <hr />
            <div class="borderSideList">
                <a href="/qna">
                    <div @click="activeElement = 'userInquiry'" :class="{ sideList: true, activeText: isActiveText('userInquiry') }">1:1문의</div>
                    <div @click="activeElement = 'userFaq'" :class="{ sideList: true, activeText: isActiveText('userFaq') }">자주묻는질문 FAQ</div>
                </a>
            </div>
        </h2>
    </div>
</template>
<script>
import axios from "axios";
export default {
    data() {
        return {
            activeElement: null,
        };
    },
    created() {
        this.email = localStorage.getItem("userID");
    },
    methods: {
        setTapName() {
            sessionStorage.setItem("eventTap", "출석체크");
        },
        isActiveText(element) {
            return this.activeElement === element ? "textBlack" : "";
        },
        fetchOrderInfo(orderState) {
            const userEmail = this.email;
            axios
                .get("/orderdelivery", {
                    params: {
                        userEmail: userEmail,
                        orderState: orderState,
                    },
                })
                .then((response) => {
                    this.orderInfo = response.data;
                })
                .catch((error) => {
                    console.error("fetching order info error", error);
                });
        },
    },
};
</script>
