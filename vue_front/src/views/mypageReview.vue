<template>
    <GnbBar />
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
                                <img :src="review.book_cover" alt="북커버 이미지" class="info-content" />
                            </div>
                            <div class="info-item1">
                                <div class="info-title.confirm">구매확정 {{ formattedDate(review.ORDERITEM_CONFIRMED_AT) }}</div>

                                <div class="info-title.book-title">{{ review.book_title }}</div>

                                <div class="info-title.book-author">{{ review.book_author }}</div>
                            </div>

                            <div class="info-item2">
                                <router-link :to="`/detail/${review.ORDERITEM_BOOK_ID}`"
                                    ><button class="review-button">리뷰 쓰기</button></router-link
                                >

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
                    <div>
                        <!-- 작성한 리뷰 데이터를 순회하며 표시 -->
                        <div v-for="(review, index) in writtenReview" :key="index" class="review-info">
                            <div class="info-item book-cover" style="justify-content: flex-start">
                                <img :src="review.book_cover" alt="북커버 이미지" class="info-content" />
                            </div>
                            <div class="info-item1">
                                <div class="info-title book-title">{{ review.book_title }}</div>
                                <div class="info-title book-author">{{ review.book_author }}</div>

                                <div class="info-title review-comment">리뷰: {{ review.rev_comment }}</div>
                            </div>
                            <div class="info-item2">
                                <div class="info-title review-created-at">작성일: {{ review.rev_created_at }}</div>
                                <div class="info-title review-rating">별점: {{ review.rev_rating }} 점</div>
                            </div>
                        </div>
                        <!-- 페이지네이션 버튼 -->
                        <div class="pagination">
                            <button v-for="pageNumber in totalPages" :key="pageNumber" @click="changePage(pageNumber)">
                                {{ pageNumber }}
                            </button>
                        </div>
                    </div>
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
import GnbBar from "../components/gnbBar.vue";

// Format the date in YY-MM-DD format
const formattedDate = (date) => {
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export default {
    components: { myPageSide, myPage_top, TabsWrapper, TabItem, GnbBar },
    data() {
        return {
            reviewList: [],
            writtenReview: [],
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

            // 작성한 리뷰 데이터를 가져오는 요청
            const writtenReviewResponse = await axios.get(`review/myreviewdata/${email}`);
            this.writtenReview = writtenReviewResponse.data.myReviews;

            console.log(this.reviewList);
            console.log(this.writtenReview);

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

            if (this.writtenReview.length > 0) {
                this.writtenReview = this.writtenReview.map((review) => {
                    const rev_created_at = new Date(review.REV_CREATED_AT);
                    return {
                        book_cover: review.BOOK_COVER,
                        book_title: review.BOOK_TITLE,
                        book_author: review.BOOK_AUTHOR,
                        rev_rating: review.REV_RATING,
                        rev_comment: review.REV_COMMENT,
                        rev_created_at: formattedDate(rev_created_at),
                    };
                });
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

.info-content {
    width: 100px; /* 이미지의 가로 너비를 원하는 크기로 조절해보세요 */
    height: auto; /* 높이를 자동으로 조절하여 비율을 유지하도록 설정 */
    max-width: 100%; /* 부모 요소 너비에 맞게 이미지 크기 조절 */
    max-height: 100%; /* 부모 요소 높이에 맞게 이미지 크기 조절 */
}
</style>
