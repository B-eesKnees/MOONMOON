<style src="../assets/css/qnaWrite.css"></style>
<template>
  <div>
    <GnbBar />

    <div class="mypage_menu"></div>
    <div class="right_box">
      <h1 class="qna_title_big">1:1 문의 접수</h1>
      <div class="write_box">
        <div class="title_write">
          <h2 class="title_text">제목</h2>
          <input class="title_input" type="text" v-model="qna.qna_title">
        </div>
        <div class="con_write">
          <h2 class="con_text">내용</h2>
          <input class="con_input" type="text" v-model="qna.qna_con">
        </div>
      </div>
      <div class="btn_box">
        <button class="btn_cancel">취소</button>
        <button class="btn_accept" @click="qnaInsert">문의 접수</button>
      </div>
    </div>
  </div>

</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

import GnbBar from '../components/gnbBar.vue'

export default {
  components: { 
    GnbBar 
  },
  data() {
    return {
      qna: {
        qna_title: "",
        qna_con: "",
    },
    }
  },
  methods: {
    goToQnaTitle(title) {
     this.$router.push({path:'/qna/qnaWrite', query:{title: qna_title}}); 
    },
    goToQnaCon(con) {
     this.$router.push({path:'/qna/qnaWrite', query:{con: qna_con}}); 
    },
  }
  
}
</script>
