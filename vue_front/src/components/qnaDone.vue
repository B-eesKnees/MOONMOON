<script>
import axios from 'axios';

export default {
  props: {
    qnaDoneList: Object,
    toggleContent3: Boolean,
    showQnaDoneContent: {
      type: Array,
      default: () => []
    },
  },
  methods: {
    async toggleContent3(index) {
      this.showQnaDoneContent[index] =!this.showQnaDoneContent[index];
      await this.$emit('update:showQnaDoneContent', this.showQnaDoneContent);
    }
  }
  
  /* computed: {
    truncatedContents() {
      const maxChars = 30;
      if (this.done.QNA_TITLE.length > maxChars) {
        return this.done.QNA_TITLE.substring(0, maxChars) + "...";
      } else {
        return this.done.QNA_TITLE;
      }
    },
  }, */
};
</script>

<template>

  <div class="qna-list">
    <div :key="i" v-for="(done, i) in qnaDoneList">
      <!-- 대기중 아이콘 -->
      <div>
        <img src="../assets/img/done.png" alt="done-img">
      </div>
      <!-- 문의 제목/날짜 -->
      <div>
        <div class="qna_tilte">{{ done.QNA_TITLE}}</div>
        <div class="qna_date">{{ done.QNA_DATE }}</div>
      <!-- 버튼 토글-문의 내용/답변 -->
        <div>
          <button @click="toggleContent3(i)" class="con-open">
            <img :src="conOpenBotton" alt="con-open/close" />
          </button>
          <div v-if="showQnaDoneContent[i]">
            <div class="qna_con">{{ done.QNA_CON }}</div>0
            <div class="qna_reply">{{ done.QNA_REPLY }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  
</template>