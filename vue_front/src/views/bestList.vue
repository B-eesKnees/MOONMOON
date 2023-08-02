<template>
    <GnbBar />
    <div class="best">
        <div class="best_header">
            <h2>BEST</h2>
        </div>
        <div class="best_items">
            <div v-for="i in 4" class="best_item">
                <div class="best_item_img">
                    <img src="../assets/img/book4.jpg" alt="">
                </div>
                <div class="best_item_info">
                    <h2 class="best_item_info_title">2023 시나공 정보처리기사 실기</h2>
                    <span class="best_item_info_author">김정준 | 2023.06.24</span>
                    <div class="best_item_info_price">
                        <span>23.000</span>
                        <span>원</span>
                    </div>
                    <p class="best_item_info_summary">간단 요약 설명 간단 요약 설명 간단 요약 설명 간단 요약 설명 간단 요약 설명 간단 요약 설명 간단 요약 설명 간단 요약
                        설명 간단
                        요약 설명 간단 요약 설명 간단 요약 설명 간단 요약 설명 간단 요약 설명 </p>
                    <div class="best_item_info_star">
                        <span class="best_item_info_star_num">9.3</span>
                        <img v-for="i in 5" src="../assets/img/starFill.png" alt="">
                    </div>
                </div>
                <div class="best_item_order">
                    <a href="">결제하러 가기</a>
                    <p><span>내일(7/28)</span> 도착예정</p>
                </div>
                <div class="best_item_btn">
                    <a href=""><img src="../assets/img/heart.png" alt=""></a>
                    <a href=""><img src="../assets/img/cart2.png" alt=""></a>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import GnbBar from '../components/gnbBar.vue'

export default {
    name: '',
    components: { GnbBar },
    data() {
        return {
            sampleData: ''
        };
    },

    setup() { },
    created() { },
    mounted() { },
    unmounted() { },
    methods: {}
}
</script>

<style>
.best {
    margin: 3% auto;
    width: 100%;
}

.best_header {
    width: 60%;
    color: #4E4EFF;
    font-weight: bold;
    font-size: xx-large;
    padding-bottom: 1%;
    margin: 0 auto;
    border-bottom: 2px solid #ccc;
}

.best_items {
    width: 60%;
    height: 100%;
    margin: 0 auto;
}

.best_item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 2% 0 2% 2%;
    border-bottom: 1px solid #ccc;
    margin: 0;
}

.best_item_img {
    width: 13%;
}

.best_item_img img {
    width: 100%;
}

.best_item_info {
    padding: 2%;
    padding-left: 5%;
    width: 57%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
}
.best_item_info_title {
    font-weight: bold;
    font-size: large;
}
.best_item_info_author {
    font-size: small;
}
.best_item_info_price span:first-child {
    font-weight: bold;
    font-size: large;
}
.best_item_info_star {
    width: 100%;
}
.best_item_info_star_num {
    font-weight: bold;
    padding-right: 2%;
}

.best_item_order {
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.best_item_order a {
    color: white;
    background-color: #4E4EFF;
    padding: 6% 12%;
    border-radius: 8px;
    font-weight: bold;
    margin-bottom: 7%;
}
.best_item_order span {
    font-weight: bolder;
}
.best_item_btn {
    width: 5%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start;
    
}
.best_item_btn img,
.best_item_btn a {
    margin-bottom: 50%;
}
</style>