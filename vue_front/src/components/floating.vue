<style src="../assets/css/floating.css"></style>

<template>
    <!-- 최근 본 -->
    <div @click="openFloating" class="floating_btn">
        <img src="../assets/img/floating.png" alt="" />
        <span class="floating_num">0</span>
    </div>
    <div ref="float" class="floating_modal_wrap display_none">
        <div class="floating_modal">
            <div class="floating_modal_header">
                <h2 ref="floatRecent" class="floating_modal_heart_btn current"
                    @click="floatingMenuRecent(), getRecentBook()">
                    최근 본
                </h2>
                <h2 ref="floatHeart" class="floating_modal_recent_btn" @click="floatingMenuHeart">
                    찜 목록
                </h2>
                <span @click="closeFloating" class="cursor">✖</span>
            </div>
            <!-- 최근 본 -->
            <div v-if="floatingState == 'recent'" class="floating_modal_recent_wrap">
                <div class="floating_modal_list_header">
                    <div class="floating_modal_list_header_left">
                        <span>1</span>
                        <span>건</span>
                    </div>
                    <div class="floating_modal_list_header_right cursor">
                        <img src="../assets/img/trash.png" alt="" />
                        <span>전체삭제</span>
                    </div>
                </div>
                <div class="floating_modal_list">
                    <div v-for="i in 2" class="floating_modal_item">
                        <a class="floating_modal_item_img" href=""><img src="../assets/img/book4.jpg" alt="" /></a>
                        <div class="floating_modal_item_info">
                            <a href="">
                                <h2>세이노의 가르침</h2>
                            </a>
                            <p>세이노(SayNo)</p>
                            <div class="floating_modal_item_info_price">
                                <span>10%</span>
                                <span>16,200</span>원
                            </div>
                        </div>
                        <div class="floating_modal_item_control">
                            <img class="cursor" src="../assets/img/heart.png" alt="" />
                            <span class="cursor">✖</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 찜 목록 -->
            <div v-if="floatingState == 'heart'" class="floating_modal_heart_wrap">
                <div class="floating_modal_list_header">
                    <div class="floating_modal_list_header_left">
                        <span>2</span>
                        <span>건</span>
                    </div>
                    <div class="floating_modal_list_header_right cursor">
                        <img src="../assets/img/trash.png" alt="" />
                        <span>전체삭제</span>
                    </div>
                </div>
                <div class="floating_modal_list">
                    <div v-for="i in 2" class="floating_modal_item">
                        <a class="floating_modal_item_img" href=""><img src="../assets/img/book4.jpg" alt="" /></a>
                        <div class="floating_modal_item_info">
                            <a href="">
                                <h2>세이노의 가르침</h2>
                            </a>
                            <p>세이노(SayNo)</p>
                            <div class="floating_modal_item_info_price">
                                <span>10%</span>
                                <span>16,200</span>원
                            </div>
                        </div>
                        <div class="floating_modal_item_control">
                            <img class="cursor" src="../assets/img/heart.png" alt="" />
                            <span class="cursor">✖</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

export default {
    name: '',
    components: {},
    data() {
        return {
            // 플로팅 데이터
            floatingState: "recent",
        };
    },

    setup() { },
    created() { },
    mounted() { },
    unmounted() { },
    methods: {
        openFloating() {
            const floatdiv = this.$refs.float.classList;
            floatdiv.toggle("display_none");
        },
        closeFloating() {
            const floatdiv = this.$refs.float.classList;
            floatdiv.toggle("display_none");
        },
        floatingMenuRecent() {
            const floatRecentBtn = this.$refs.floatRecent;
            const floatHeartBtn = this.$refs.floatHeart;
            this.floatingState = "recent";
            if (this.floatingState == "recent") {
                floatRecentBtn.classList.add("current");
                floatHeartBtn.classList.remove("current");
            }
        },
        floatingMenuHeart() {
            const floatRecentBtn = this.$refs.floatRecent;
            const floatHeartBtn = this.$refs.floatHeart;
            this.floatingState = "heart";
            if (this.floatingState == "heart") {
                floatHeartBtn.classList.add("current");
                floatRecentBtn.classList.remove("current");
            }
        },
        async getRecentBook() {
            await axios({
                url: "http://localhost:3000/floating/recentbook",
                method: "GET",
                data: {},
            })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    alert(err);
                });
        },
    }
}
</script>