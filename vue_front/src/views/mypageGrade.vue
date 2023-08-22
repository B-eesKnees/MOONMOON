<template>
    <GnbBar />
    <myPage_top />
    <div class="mypage_menu">
        <myPageSide />
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
