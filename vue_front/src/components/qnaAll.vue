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
    <!-- 대기중/완료 아이콘 -->
    <div v-if="qnaAll.QNA_REP === 0">
      <img src="../assets/img/waiting.png" alt="waiting-img">
    </div>
    <div v-else>
      <img src="../assets/img/done.png" alt="done-img">
    </div>
    <!-- 문의 제목/날짜 -->
    <div class="qna_tilte">교환 및 반품 절차가 어떻게 되나요?{{ truncatedContents }}{{ qnaAll.QNA_TITLE }}</div>
    <div class="qna_date">2023-08-12{{ qnaAll.QNA_DATE }}</div>
    <!-- 버튼 토글-문의 내용/답변 -->
    <div>
      <button @click="toggleContent" class="con-open">
        <img :src="conOpenBotton" alt="con-open/close" />
      </button>
      <div v-if="showQnaContent">
        <div class="qna_con">구매한 책이 마음에는 들지만 조금 더 다른 책으로 교환하거나 반품하고 싶습니다. 어떤 식으로 절차를 진행해야 하는지 자세히 안내해주세요.{{ qnaAll.QNA_CON }}</div>
        <div class="qna_reply">물론입니다. 제품을 받으신 날로부터 7일 이내에는 사용하지 않은 상태로 제품을 교환하거나 반품하실 수 있습니다. '마이 페이지'에서 교환 및 반품 신청을 진행하거나, 고객센터로 문의주시면 관련된 절차와 안내를 자세히 안내해드리겠습니다.{{ qnaAll.QNA_REPLY }}</div>
      </div>
    </div>
  </div>
  
  
</template>