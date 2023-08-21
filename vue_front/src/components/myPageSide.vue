<template>
    <div class="topMyPage">마이페이지</div>
    <div>
        <h2 class="sideName">
            쇼핑내역
            <hr />
            <div class="borderSideList">
                <a href="#">
                    <div @click="activeElement = 'orderList'" :class="{ sideList: true, activeText: isActiveText('orderList') }">주문/배송목록</div>

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
                <a href="#">
                    <div @click="activeElement = 'userInfoControl'" :class="{ sideList: true, activeText: isActiveText('userInfoControl') }">
                        회원정보관리
                    </div>
                    <div @click="activeElement = 'userGrade'" :class="{ sideList: true, activeText: isActiveText('userGrade') }">회원등급</div>
                </a>
            </div>
        </h2>
    </div>
    <div>
        <h2 class="sideName">
            이벤트
            <hr />
            <div class="borderSideList">
                <a href="#">
                    <div @click="activeElement = 'myRoul'" :class="{ sideList: true, activeText: isActiveText('myRoul') }">룰렛</div>
                    <div @click="activeElement = 'myAtt'" :class="{ sideList: true, activeText: isActiveText('myAtt') }">출석체크</div>
                </a>
            </div>
        </h2>
    </div>

    <div>
        <h2 class="sideName">
            고객센터
            <hr />
            <div class="borderSideList">
                <a href="#">
                    <div @click="activeElement = 'userInquiry'" :class="{ sideList: true, activeText: isActiveText('userInquiry') }">1:1문의</div>
                    <div @click="activeElement = 'userFaq'" :class="{ sideList: true, activeText: isActiveText('userFaq') }">자주묻는질문 FAQ</div>
                </a>
            </div>
        </h2>
    </div>
</template>
<script>
export default {
    data() {
        return {
            activeElement: null,
        };
    },
    methods: {
        isActiveText(element) {
            return this.activeElement === element ? "textBlack" : "";
        },
    },
};
</script>
<style>
.topMyPage {
    font-size: 40px;
    margin-top: 50px;
    margin-left: 40px;
    margin-bottom: 80px;
}
.sideName {
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 80px;
    margin-left: 10px;
}

.sideList {
    font-size: 25px;
    font-weight: normal;
    margin-left: 10px;
    margin-bottom: 20px; /* 원하는 간격 값으로 변경 */
    color: rgb(155, 152, 152);
}
.textBlack {
    color: black;
}
.activeText {
    color: black; /* 활성화된 요소의 텍스트 색상 변경 */
}
.borderSideList {
    background-color: rgb(248, 248, 248);
    padding: 40px;
}
</style>
