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
</template>

<script>
import GnbBar from "../components/gnbBar.vue";
import myPage_top from "@/components/myPage_top_grade.vue";
import myPageSide from "@/components/myPageSide.vue";

export default {
    components: { GnbBar, myPage_top, myPageSide },
};
</script>
