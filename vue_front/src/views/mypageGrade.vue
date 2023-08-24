<template>
    <GnbBar />
    <myPage_top />
    <div class="mypage_menu">
        <myPageSide />
    </div>
    <div class="right_box">
        <h1 class="qna_title_big">회원등급</h1>
        <button>쿠폰받기</button>
        <img src="../assets/img/grade_img.png" alt="grade_img" />
    </div>
    <!-- 플로팅-->
    <Floating />
    <!-- 스크롤 TOP -->
    <ScrollTop />

</template>

<script>
import GnbBar from "../components/gnbBar.vue";
import myPage_top from "@/components/myPage_top_grade.vue";
import myPageSide from "@/components/myPageSide.vue";

import Floating from "../components/floating.vue";
import ScrollTop from "@/components/scrollTop.vue";


export default {
    components: { GnbBar, myPage_top, myPageSide, Floating, ScrollTop },
};
</script>
