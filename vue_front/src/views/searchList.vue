<style src="../assets/css/searchList.css"></style>

<template>
    <GnbBar ref="childComponent" @search-keyword="handleSearchKeyword" />
    <div class="search">
        <div class="search_header">
            <div class="search_header_left">
                <span>'{{ searchKeyword }}'</span>에 대한
                <span>{{ searchListData.length }}</span>개의 검색 결과
            </div>
            <div class="search_header_right">
                <select @change="getSearchList" v-model="filterValue">
                    <option value="판매순">판매순</option>
                    <option value="신상품순">신상품순</option>
                </select>
            </div>
        </div>
        <div class="search_items">
            <div v-for="(item, i) in searchListData" :key="i" class="search_item">
                <div class="search_item_img">
                    <a href=""><img :src="item.BOOK_COVER" alt="" /></a>
                </div>
                <div class="search_item_info">
                    <h2 class="best_item_info_title"><a href="">{{ item.BOOK_TITLE }}</a></h2>
                    <span class="search_item_info_author">{{ item.BOOK_AUTHOR }} | {{ item.BOOK_PUBDATE }}</span>
                    <div class="search_item_info_price">
                        <span>{{ formatNumber(item.BOOK_PRICE) }}</span>
                        <span>원</span>
                    </div>
                    <p class="best_item_info_summary">
                        {{ item.BOOK_DESCRIPTION }}
                    </p>
                    <div class="search_item_info_star">
                        <span v-if="item.reviewpoint == 0" class="best_item_info_star_num">0.0</span>
                        <span v-else class="best_item_info_star_num">{{ formatReviewScore(item.reviewpoint) }}</span>
                        <StarIcon :rating="convertRatingToHalfStars(reviewScore[i])" />
                    </div>
                </div>
                <div class="search_item_order">
                    <a href="">결제하러 가기</a>
                    <p><span>내일(7/28)</span> 도착예정</p>
                </div>
                <div class="search_item_btn">
                    <img src="../assets/img/heart.png" alt="" />
                    <img @click="addToCart(item.BOOK_ID)" src="../assets/img/cart2.png" alt="" />
                </div>
            </div>
        </div>
            <!-- 플로팅-->
    <Floating />
    </div>
</template>

<script>
import GnbBar from "../components/gnbBar.vue";
import Floating from "../components/floating.vue"
import StarIcon from "../components/star.vue"; // 별점 아이콘 컴포넌트의 경로를 수정해주세요.
import { eventBus } from '@/main'; // 이벤트 버스 가져오기

import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.post["Contents-Type"] = "application/json;charset=utf-8";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

export default {

    name: "",
    components: { GnbBar, StarIcon, Floating },
    data() {
        return {
            searchListData: [],
            reviewScore: [], // 리뷰 점수를 얻어온다고 가정
            email: "",
            bookId: "",
            searchKeyword: "",
            filterValue: "판매순",
        };
    },

    setup() { },
    created() {
        this.email = localStorage.getItem("userID");
        this.getSearchList();
    },
    mounted() { },
    unmounted() { },

    methods: {
        handleSearchKeyword(keyword) {
            this.searchKeyword = keyword;
            this.getSearchList();
        },

        async getSearchList() {
            const userKeyword = this.$route.params.keyword;
            this.searchKeyword = userKeyword;

            if (this.filterValue === "판매순") {
                try {
                    const response = await axios.get("http://localhost:3000/main/best", {
                        params: {
                            searchKeyword: userKeyword
                        }
                    });

                    console.log(response.data);

                    this.searchListData = response.data;
                    for (var i in response.data) {
                        this.reviewScore.push((response.data[i].reviewpoint) / 2);
                    }
                } catch (error) {
                    console.error("Error fetching search results:", error);
                }
            } else if (this.filterValue === "신상품순") {
                try {
                    const response = await axios.get("http://localhost:3000/main/new", {
                        params: {
                            searchKeyword: userKeyword
                        }
                    });

                    console.log(response.data);

                    this.searchListData = response.data;
                    for (var i in response.data) {
                        this.reviewScore.push((response.data[i].reviewpoint) / 2);
                    }
                } catch (error) {
                    console.error("Error fetching search results:", error);
                }
            }



        },
        //입력된 숫자를 주어진 범위에 따라 적절한 별점으로 변환
        convertRatingToHalfStars(number) {
            if (Number.isInteger(number)) {
                if (number >= 1 && number <= 5) {
                    return number;
                } else {
                    return 0; // 범위를 벗어나는 경우
                }
            } else {
                const integerPart = Math.floor(number);
                const decimalPart = number - integerPart;

                if (decimalPart < 0.5) {
                    return integerPart;
                } else {
                    return integerPart + 0.5;
                }
            }
        },
        formatReviewScore(number) {
            if (Number.isInteger(number)) {
                return number.toFixed(1); // 정수인 경우 소수점 자리를 1로 설정하여 변환
            } else {
                return number.toString(); // 소수인 경우 그대로 문자열로 변환
            }
        },
        formatNumber(number) {
            // 숫자를 천 단위마다 쉼표가 있는 형식으로 변환
            return new Intl.NumberFormat().format(number);
        },
        //장바구니에 추가
        async addToCart(bookId) {
            this.bookId = bookId;
            await axios({
                url: "http://localhost:3000/detail/gotoCart",
                method: "POST",
                data: {
                    email: this.email,
                    bookId: this.bookId
                }
            })
                .then((res) => {
                    alert("장바구니에 추가되었습니다.");
                    this.$refs.childComponent.getCartNum();
                })
        },
    },
};
</script>
