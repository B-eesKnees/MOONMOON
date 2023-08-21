<script>
import axios from 'axios';

export default {
  props: {
    showQnaAllContent: {
      type: Array,
      default: () => []
    },
    toggleContent1: Function,
    qnaAllList: Array,
    conOpenBotton: String,
    conCloseBotton: String,
    qnaDelFunction: Function,
    getEditQnaId: Function
  },
  methods: {
    async toggleContent1(index) {
      this.showQnaAllContent[index] =!this.showQnaAllContent[index];
      await this.$emit('update:showQnaAllContent', this.showQnaAllContent);
    },
    handleQnaDel(qna_id) {
      this.qnaDelFunction(qna_id);
    },
    getEditId(qna_id) {
      this.getEditQnaId(qna_id);
    }
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
    <div class="qna-box" :key="i" v-for="(all, i) in qnaAllList">
        <!-- 대기중/완료 아이콘 -->
        <div v-if="all.QNA_REP === 0">
          <img class="wait-icon" src="../assets/img/waiting.png" alt="waiting-img">
        </div>
        <div v-else>
          <img class="done-icon" src="../assets/img/done.png" alt="done-img">
        </div>
        <!-- 문의 제목/날짜 -->
        <div class="qna-title">{{ all.QNA_TITLE }}</div>
        <div class="qna-date">{{ all.QNA_DATE }}</div>
        <!-- 버튼 토글-문의 내용/답변 -->
        <button @click="toggleContent1(i)" class="con-open_close">
          <img :src="conOpenBotton" alt="con-open" />
          <img class="con-close" :src="conCloseBotton" alt="con-close" />
        </button>
        <div class="younju" v-if="showQnaAllContent[i]">
          <div class="qna-con">{{ all.QNA_CON }}</div>
            <div v-if="all.QNA_REP === 0">
              <a href="http://localhost:8080/qnaEdit">
                <button @click="getEditId(all.QNA_ID)">수정</button>
              </a>          
              <button @click="handleQnaDel(all.QNA_ID)">삭제</button>
            </div>
          <div class="qna-reply">{{ all.QNA_REPLY }}</div>
        </div>  
    </div>
  </div>
  
  
</template>