<script>
import axios from 'axios';

export default {
  props: {
    qnaWaitList: Object,    
    toggleContent2: Function,    
    conOpenBotton: String,
    conCloseBotton: String,
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
    <div class="qna-box" :key="i" v-for="(wait, i) in qnaWaitList">
      <!-- 대기중 아이콘 -->
      <div>
        <img class="wait-icon" src="../assets/img/waiting.png" alt="waiting-img">
      </div>
      <!-- 문의 제목/날짜 -->      
        <div class="qna-tilte">{{ wait.QNA_TITLE }}</div>
        <div class="qna-date">{{ wait.QNA_DATE }}</div>
      <!-- 버튼 토글-문의 내용/답변 -->        
          <button @click="toggleContent2(i)" class="con-open_close">
            <img :src="conOpenBotton" alt="con-open/close" />
          </button>
          <div class="younju" v-if="showQnaWaitContent[i]">
            <div class="qna-con">{{ wait.QNA_CON }}</div>
          </div>       
    </div>
  </div>
  
  
</template>