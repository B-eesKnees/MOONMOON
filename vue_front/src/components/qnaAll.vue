<script>
import axios from 'axios';

export default {
  props: {
    showQnaContent: Boolean,
    toggleContent: Boolean,
    qnaAllList: Array,
  },
  /* computed: {
    truncatedContents() {
      const maxChars = 30;
      if (this.all.QNA_TITLE.length > maxChars) {
        return this.all.QNA_TITLE.substring(0, maxChars) + "...";
      } else {
        return this.all.QNA_TITLE;
      }
    },
  }, */
};
</script>

<template>

  <div class="qna-list">
    <div :key="i" v-for="(all, i) in qnaAllList">
      <!-- 대기중/완료 아이콘 -->
      <div v-if="all.QNA_REP === 0">
        <img src="../assets/img/waiting.png" alt="waiting-img">
      </div>
      <div v-else>
        <img src="../assets/img/done.png" alt="done-img">
      </div>
      <!-- 문의 제목/날짜 -->
      <div class="qna_title">{{ all.QNA_TITLE }}</div>
      <div class="qna_date">{{ all.QNA_DATE }}</div>
      <!-- 버튼 토글-문의 내용/답변 -->
      <div>
        <button @click="toggleContent" class="con-open">
          <img :src="conOpenBotton" alt="con-open/close" />
        </button>
        <div v-if="showQnaContent">
          <div class="qna_con">{{ all.QNA_CON }}</div>
          <div class="qna_reply">{{ all.QNA_REPLY }}</div>
        </div>
      </div>
    </div>
  </div>
  
  
</template>