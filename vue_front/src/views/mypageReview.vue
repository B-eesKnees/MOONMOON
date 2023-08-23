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
                            <div class="info-item book-cover">
                                <div class="info-title"></div>
                                <img :src="review.book_cover" alt="북커버 이미지" class="info-content" />
                            </div>
                            <div class="info-item1">
                                <div class="info-title">구매확정일 : {{ formattedDate(review.ORDERITEM_CONFIRMED_AT) }}</div>

                                <div class="info-title.book-title">{{ review.book_title }}</div>

                                <div class="info-title.book-author">{{ review.book_author }}</div>
                            </div>

                            <div class="info-item2">
                                <a href="/detail"><button class="review-button">리뷰 쓰기</button></a>
                                <div class="info-title.deadline">작성기한</div>
                                <div class="info-content.deadline">{{ calculateDeadline(review.ORDERITEM_CONFIRMED_AT) }}</div>
                                <div class="info-title.point">포인트</div>
                                <div class="info-content.point">300P</div>
                            </div>
                        </div>
                    </div>
                    <div class="pagination">
                        <button v-for="pageNumber in totalPages" :key="pageNumber" @click="changePage(pageNumber)">
                            {{ pageNumber }}
                        </button>
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
            currentPage: 1,
            itemsPerPage: 10,
        };
    },
    async mounted() {
        try {
            const email = localStorage.getItem("userID");
            const response = await axios.get(`mypage/notYetReview/${email}`);
            this.reviewList = response.data; // API에서 받아온 모든 데이터를 reviewList에 할당

            console.log(this.reviewList);

            if (this.reviewList.length > 0) {
                const data = this.reviewList[0]; // 첫 번째 데이터를 가져와서 사용
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
    },
    computed: {
        totalPages() {
            return Math.ceil(this.reviewList.length / this.itemsPerPage);
        },
        displayedReviews() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            return this.reviewList.slice(startIndex, endIndex);
        },
    },
    methods: {
        formattedDate(date) {
            const orderConfirmedDate = new Date(date);
            const year = orderConfirmedDate.getFullYear().toString().substr(-2);
            const month = (orderConfirmedDate.getMonth() + 1).toString().padStart(2, "0");
            const day = orderConfirmedDate.getDate().toString().padStart(2, "0");
            return `${year}-${month}-${day}`;
        },
        calculateDeadline(confirmDate) {
            const orderConfirmedDate = new Date(confirmDate);
            return formattedDate(new Date(orderConfirmedDate.getTime() + 30 * 24 * 60 * 60 * 1000));
        },
    },
    changePage(pageNumber) {
        this.currentPage = pageNumber;
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
    margin-bottom: 20px;
}

.info-item.book-cover {
    display: flex;

    justify-content: flex-start; /* 변경: 북커버 이미지를 왼쪽 정렬 */

    margin-right: 20px; /* 변경: 오른쪽 간격 추가 */
}

.review-button {
    background-color: #5552f7;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
}
.pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.pagination button {
    margin: 0 5px;
    padding: 5px 10px;
    background-color: #f0f0f0;
    border: none;
    cursor: pointer;
}

.pagination button:hover {
    background-color: #ddd;
}
</style>
