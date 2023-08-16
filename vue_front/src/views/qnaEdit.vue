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
        <button class="btn_accept">문의 수정</button>
      </div>
    </div>
  </div>
</template>

<script>
import GnbBar from '../components/gnbBar.vue'

export default {
  components: { GnbBar },
  
}
</script>