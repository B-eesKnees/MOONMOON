<script>
export default {
  props: {
    qnaWaiting: Object,
    showQnaContent: Boolean,
  },
  computed: {
    truncatedContents() {
      const maxChars = 30;
      if (this.qnaAll.QNA_TITLE.length > maxChars) {
        return this.qnaAll.QNA_TITLE.substring(0, maxChars) + "...";
      } else {
        return this.qnaAll.QNA_TITLE;
      }
    },
  },
};
</script>

<template>

  <div class="qna-list">
    <!-- 대기중 아이콘 -->
    <div>
      <img src="../assets/img/done.png" alt="done-img">
    </div>
    <!-- 문의 제목/날짜 -->
    <div v-if="qnaAll.QNA_REP === 1">
      <div class="qna_tilte">제목{{ truncatedContents }}{{ qnaAll.QNA_TITLE }}</div>
      <div class="qna_date">날짜{{ qnaAll.QNA_DATE }}</div>
    <!-- 버튼 토글-문의 내용/답변 -->
      <div>
        <button @click="toggleContent" class="con-open">
          <img :src="conOpenBotton" alt="con-open/close" />
        </button>
        <div v-if="showQnaContent">
          <div class="qna_con">내용{{ qnaAll.QNA_CON }}</div>
          <div class="qna_reply">답변{{ qnaAll.QNA_REPLY }}</div>
        </div>
      </div>
    </div>
  </div>
  
  
</template>