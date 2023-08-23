<template>
    <myPage_top />
    <div class="mypage_menu">
        <myPageSide />
    </div>

    <div class="right_box">
        <section class="tabWrap">
            <TabsWrapper>
                <TabItem title="작성가능한 리뷰">
                    <div>
                        <div v-for="(review, index) in reviewList" :key="index" class="review-info">
                            <div class="info-item book-cover" style="justify-content: flex-start">
                                <div class="info-title">북커버</div>
                                <img :src="review.book_cover" alt="북커버 이미지" class="info-content" />
                            </div>
                            <div class="info-item">
                                <div class="info-title">주문확정일</div>
                                <div class="info-content">{{ review.ORDERITEM_CONFIRMED_AT }}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-title">책 제목</div>
                                <div class="info-content">{{ book_title }}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-title">작가</div>
                                <div class="info-content">{{ book_author }}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-title">작성기한</div>
                                <div class="info-content">{{ calculateDeadline(review.ORDERITEM_CONFIRMED_AT) }}</div>
                            </div>
                            <button class="review-button">리뷰 쓰기</button>
                            <div class="info-item">
                                <div class="info-title">포인트</div>
                                <div class="info-content">{{ review.point }}</div>
                            </div>
                        </div>
                    </div>
                </TabItem>
                <TabItem title="작성한 리뷰">
                    <!-- 여기에 작성한 리뷰 내용 추가 -->
                </TabItem>
            </TabsWrapper>
        </section>
    </div>
</template>

<script>
import axios from "axios";
import myPageSide from "../components/myPageSide.vue";
import myPage_top from "../components/myPage_top.vue";
import TabsWrapper from "../components/TabsWrapper.vue";
import TabItem from "../components/TabItem.vue";

// Format the date in YY-MM-DD format
const formattedDate = (date) => {
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export default {
    components: { myPageSide, myPage_top, TabsWrapper, TabItem },
    data() {
        return {
            reviewList: [],
            book_cover: "",
            orderitem_confirmed_At: "",
            book_title: "",
            book_author: "",
            point: "300P",
        };
    },
    async mounted() {
        try {
            const email = localStorage.getItem("userID");
            this.reviewList = await axios.get(`mypage/notYetReview/${email}`);

            const data = this.reviewList.data[0];
            console.log(data);
            // Make sure the API response contains the necessary properties
            if (data) {
                this.book_cover = data.book_cover;
                this.book_title = data.book_title;
                this.book_author = data.book_author;

                const orderConfirmedDate = new Date(data.ORDERITEM_CONFIRMED_AT);
                this.orderitem_confirmed_At = formattedDate(orderConfirmedDate);
                this.deadline = formattedDate(new Date(orderConfirmedDate.getTime() + 30 * 24 * 60 * 60 * 1000));

                console.log("구매확정일:", this.orderitem_confirmed_At);
                console.log("작성기한:", this.deadline);
            } else {
                console.log("No data found in the response.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        console.log(this.reviewList);
    },
    methods: {
        calculateDeadline(confirmDate) {
            const orderConfirmedDate = new Date(confirmDate);
            return formattedDate(new Date(orderConfirmedDate.getTime() + 30 * 24 * 60 * 60 * 1000));
        },
    },
};
</script>
<style scoped>
.review-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    height: 200px;
    border-bottom: 1px solid rgba(199, 195, 195, 0.267); /* 아래쪽에만 border 추가 */
}

.info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.info-title {
    font-weight: bold;
}

.info-item.book-cover {
    justify-content: flex-start; /* 북커버는 맨 왼쪽으로 배치 */
    text-align: left; /* 텍스트는 왼쪽 정렬 */
}

.review-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
}
</style>
