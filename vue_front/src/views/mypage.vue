<template>
    <GnbBar />
    <myPage_top />
    <div></div>
</template>
<script>
import "@/assets/css/myPage.css";
import GnbBar from "../components/gnbBar.vue";
import myPage_top from "../components/myPage_top.vue";

export default {
    name: "",
    components: { GnbBar, myPage_top },
    data() {
        return {};
    },
    methods: {},
};
</script>
