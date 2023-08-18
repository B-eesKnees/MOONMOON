<template>
    <GnbBar />
    <myPage_top />
    <myPageSide />
    <div></div>
</template>
<script>
import "@/assets/css/myPage.css";
import GnbBar from "../components/gnbBar.vue";
import myPage_top from "../components/myPage_top.vue";
import myPageSide from "../components/myPageSide.vue";

export default {
    name: "",
    components: { GnbBar, myPage_top, myPageSide },
    data() {
        return {};
    },
    methods: {},
};
</script>
