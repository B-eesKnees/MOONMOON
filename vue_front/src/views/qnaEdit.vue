<style src="../assets/css/qnaEdit.css"></style>
<template>
  <div>
    <GnbBar />

    <div class="mypage_menu"></div>
    <div class="right_box">
      <h1 class="qna_title_big">1:1 문의 수정</h1>
      <div class="write_box">
        <div class="title_write">
          <h2 class="title_text">제목</h2>
          <input class="title_input" type="text">
        </div>
        <div class="con_write">
          <h2 class="con_text">내용</h2>
          <input class="con_input" type="text">
        </div>
      </div>
      <div class="btn_box">
        <button class="btn_cancel">취소</button>
        <button class="btn_accept" @click="qnaEdit">문의 수정</button>
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
    qnaEdit() {
      axios.post("/qna/qnaEdit", this.qna) // this.qna 객체를 서버로 전송
        .then(response => {
          // 서버 응답 처리
          // ... (원하는 처리 방식으로 추가)
          this.$router.push("/qna"); // 문의 작성 후에 목록 페이지로 이동
        })
        .catch(error => {
          console.error("Error editing Q&A:", error);
        });
    },
  }
  
}
</script>