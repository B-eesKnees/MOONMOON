<style src="../assets/css/qnaWrite.css"></style>
<template>
  <div>
    <GnbBar />

    <div class="mypage_menu"></div>
    <div class="right_box">
      <h1 class="qna_title_big">1:1 문의 접수</h1>
      <div class="write_box">
        <div class="title_write">
          <h2 class="title_text qna-title-width">제목</h2>
          <input class="title_input" type="text" v-model="qna.qna_title">
        </div>
        <div class="con_write">
          <h2 class="con_text qna-title-width">내용</h2>
          <input class="con_input" type="text" v-model="qna.qna_con">
        </div>
      </div>
      <div class="btn_box">
        <button class="btn_cancel">취소</button>
        <button class="btn_accept" @click="qnaWrite">문의 접수</button>
      </div>
    </div>
  </div>

</template>

<script>
import axios from 'axios';

import GnbBar from '../components/gnbBar.vue'

export default {
  components: { 
    GnbBar 
  },
  data() {
    return {
      qna: {
        email: "",
        qna_title: "",
        qna_con: "",
        qna_rep: 0
    },
    }
  },
  created() {
    this.qna.email = localStorage.getItem("userID");
  },
  methods: {
    qnaWrite() {
      axios.post("/qna/qnaWrite", this.qna) // this.qna 객체를 서버로 전송
        .then(response => {
          // 서버 응답 처리
          // ... (원하는 처리 방식으로 추가)
          this.$router.push("/qna"); // 문의 작성 후에 목록 페이지로 이동
        })
        .catch(error => {
          console.error("Error writing Q&A:", error);
        });
    },
  }
  
}
</script>
