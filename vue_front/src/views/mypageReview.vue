<template>
    <div class="mypage_menu">
        <myPageSide />
    </div>
    <div class="right_box">
        <div>작성가능한 리뷰</div>
        <hr />
    </div>
</template>
<script>
import axios from "axios";
import myPageSide from "../components/myPageSide.vue";

export default {
    components: { myPageSide },
};
</script>
