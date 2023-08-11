<script>
import axios from 'axios';

export default {
  props: {
    qnaWaitList: Object,    
    toggleContent2: Boolean,
    showQnaWaitContent: {
      type: Array,
      default: () => []
    },
  },
  methods: {
    async toggleContent2(index) {
      this.showQnaWaitContent[index] =!this.showQnaWaitContent[index];
      await this.$emit('update:showQnaWaitContent', this.showQnaWaitContent);
    }
  }
  /* computed: {
    truncatedContents() {
      const maxChars = 30;
      if (this.wait.QNA_TITLE.length > maxChars) {
        return this.wait.QNA_TITLE.substring(0, maxChars) + "...";
      } else {
        return this.wait.QNA_TITLE;
      }
    },
  }, */
};
</script>

<template>

  <div class="qna-list">
    <div :key="i" v-for="(wait, i) in qnaWaitList">
      <!-- 대기중 아이콘 -->
      <div>
        <img src="../assets/img/waiting.png" alt="waiting-img">
      </div>
      <!-- 문의 제목/날짜 -->
      <div>
        <div class="qna_tilte">{{ wait.QNA_TITLE }}</div>
        <div class="qna_date">{{ wait.QNA_DATE }}</div>
      <!-- 버튼 토글-문의 내용/답변 -->
        <div>
          <button @click="toggleContent2(i)" class="con-open">
            <img :src="conOpenBotton" alt="con-open/close" />
          </button>
          <div v-if="showQnaWaitContent[i]">
            <div class="qna_con">{{ wait.QNA_CON }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  
</template>