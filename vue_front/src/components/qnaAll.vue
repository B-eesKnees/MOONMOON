<script>
import axios from 'axios';

export default {
  data() {
    return {
      qnaAll: [],
    };
  },
  async created() {
    try {
      const response = await axios.get('/qna/qnaAll');
      this.qnaAll = response.data.qnaAll;
    } catch (error) {
      console.error(error);
    }
  },
  props: {
    showQnaContent: Boolean,
    qnaAll: Array,
  },
  computed: {
    truncatedContents() {
      const maxChars = 30;
      if (this.qnaAll[0].QNA_TITLE.length > maxChars) {
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
    <!-- 대기중/완료 아이콘 -->
    <div v-if="qnaAll.QNA_REP === 0">
      <img src="../assets/img/waiting.png" alt="waiting-img">
    </div>
    <div v-else>
      <img src="../assets/img/done.png" alt="done-img">
    </div>
    <!-- 문의 제목/날짜 -->
    <div class="qna_tilte">{{ truncatedContents }}{{ qnaAll.QNA_TITLE }}</div>
    <div class="qna_date">{{ qnaAll.QNA_DATE }}</div>
    <!-- 버튼 토글-문의 내용/답변 -->
    <div>
      <button @click="toggleContent" class="con-open">
        <img :src="conOpenBotton" alt="con-open/close" />
      </button>
      <div v-if="showQnaContent">
        <div class="qna_con">{{ qnaAll.QNA_CON }}</div>
        <div class="qna_reply">{{ qnaAll.QNA_REPLY }}</div>
      </div>
    </div>
  </div>
  
  
</template>