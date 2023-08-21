<template>
    <div class="mypage_top">
        <div class="mypage_top_left">
            <div class="mypage_profile_name_email">
                <div class="mypage_profile">
                    <img src="../assets/img/user.png" alt="user" />
                </div>
                <div class="mypage_profile_right">
                    <div class="name_grade">
                        <div class="mypage_grade">프렌즈</div>
                        <div class="mypage_name">{{ getUserData.USER_NAME }}<span>님</span></div>
                    </div>
                    <div class="mypage_email">{{ getUserData.USER_EMAIL }}</div>
                </div>
            </div>
            <div class="like_recent_point_cou">
                <a href="#" class="mypage_like">
                    <div class="like_recent_point_cou_text">
                        <div class="like_recent_point_cou_title">찜</div>
                        <div class="like_recent_point_cou_num" v-if="getLikeCountData.likecount !== undefined">{{ getLikeCountData.likecount }}</div>
                    </div></a
                >
                <a href="#" class="mypage_like">
                    <div class="like_recent_point_cou_text">
                        <div class="like_recent_point_cou_title">최근 본</div>
                        <div class="like_recent_point_cou_num">2</div>
                    </div></a
                >
                <a href="#" class="mypage_like">
                    <div class="like_recent_point_cou_text">
                        <div class="like_recent_point_cou_title">포인트</div>
                        <div class="like_recent_point_cou_num">{{ getUserData.USER_POINT }}<span>p</span></div>
                    </div></a
                >
                <a href="#" class="mypage_like">
                    <div class="like_recent_point_cou_text">
                        <div class="like_recent_point_cou_title">쿠폰</div>
                        <div class="like_recent_point_cou_num">4</div>
                    </div></a
                >
            </div>
        </div>
        <div class="mypage_top_right">
            <div class="mypage_slide_title">신간 추천</div>
            <carousel :items-to-show="4" class="mypage_slide_set">
                <slide v-for="slide in 10" :key="slide" class="mypage_slide">
                    {{ slide }}
                </slide>

                <!-- <slide> 양소원 바보{{ getUserData.USER_NAME }} </slide>
                <slide> 양소원 바보 </slide>
                <slide> 양소원 바보 </slide>
                <slide> 양소원 바보 </slide>
                <slide> 양소원 바보 </slide> -->

                <template #addons>
                    <navigation />
                    <pagination />
                </template>
            </carousel>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";

export default {
    name: "",
    components: {
        Carousel,
        Slide,
        Pagination,
        Navigation,
    },
    data() {
        return {
            getUserData: {
                USER_NAME: "",
                USER_EMAIL: "",
                USER_POINT: "",
            },
            likeCount: undefined,
        };
    },
    created() {
        this.email = localStorage.getItem("userID");
        this.getUser();
        this.getLikeCount();
    },
    methods: {
        getUser() {
            axios({
                url: "http://localhost:3000/mypage/getuser",
                method: "post",
                data: {
                    userEmail: this.email,
                },
            })
                .then((response) => {
                    this.getUserData = response.data.user;
                })
                .catch((error) => {
                    console.error("user데이터 받아오기 오류:", error);
                });
        },
        async getLikeCount() {
            try {
                const response = await axios.get("http://localhost:3000/mypage/getlikecount", {
                    params: {
                        userEmail: this.email,
                    },
                });

                console.log("서버 응답 데이터:", response.data);
                this.likeCount = response.data.likecount;
            } catch (error) {
                console.error("userlikecount 데이터 받아오기 오류:", error);
            }
        },
    },
};
</script>
