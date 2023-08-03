<style src="../assets/css/qnaList.css"></style>
<template>    
<GnbBar />
  
</template>
<script>
import GnbBar from '../components/gnbBar.vue'

export default {
  components: { GnbBar },
  name: "qnaTab",
  data() {
    return {
      currentTagName: "all",
      tabList: [
        { name: "전체", tag: "all" },
        { name: "답변 대기", tag: "waiting" },
        { name: "답변 완료", tag: "done" },
      ],
      repList: [
        { title: "1", tag: "all" },
        { title: "2", tag: "waiting" },
        { title: "3", tag: "done" },
      ],
      showQnaContent: false,
      repWaiting: true,
      repDone: false,
      conOpenBotton: require("../assets/img/qna-open.png"),
      conCloseBotton: require("../assets/img/qna-close.png"),
    };
  },
  methods: {
    toggleContent() {
      this.showQnaContent = !this.showQnaContent;

      if (this.conOpenBotton === require("../assets/img/qna-open.png")) {
        this.conOpenBotton = this.conCloseBotton;
      } else {
        this.conOpenBotton = require("../assets/img/qna-open.png");
      }
    }
  },
  computed: {
    currentList() {
      return this.repList.filter((el) => el.tag == this.currentTagName);
    },
  },
  };
</script>