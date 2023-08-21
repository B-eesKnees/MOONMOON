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
          <input class="title_input" type="text" v-model="qna.qna_title">
        </div>
        <div class="con_write">
          <h2 class="con_text">내용</h2>
          <input class="con_input" type="text" v-model="qna.qna_con">
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
        qna_id: "",
        qna_title: "",
        qna_con: "",
        qna_rep: 0
      },
      qna_id: "",
    }
  },
  created() {
    this.qna.email = localStorage.getItem("userID");

    this.originalData();
  },
  methods: {
    /* async getOriginalQnaCon() {
      try {
        const url = "/qna/qnaOriginal";
        const data = { QNA_ID: this.qna_id };

        const getOriginalQnaCon = (await axios({
          method: 'post',
          url,
          data
        }).catch(error => {
          console.log(error);
        })).data;

        if (getOriginalQnaCon.length > 0) {
        this.getOriginalQnaCon = getOriginalQnaCon;

      }
      console.log(this.getOriginalQnaCon);
      } catch (error) {
        console.log(error);
      }
    }, */
    async qnaEdit() {
      if(!this.qna.qna_title || !this.qna.qna_con) {
        alert("제목과 내용을 모두 입력해주세요.");
        return;
      }

      this.editData = {
        qna_id: this.qna.qna_id,
        qna_title: this.qna.qna_title,
        qna_con: this.qna.qna_con
      }

      axios.post('/qna/qnaEdit', this.editData)
      .then((response) => {
        if (response.data.success) {
          alert('문의 내용이 수정되었습니다.');
          console.log(editData);
          this.$router.push({ path: '/qna' });
        } else {
          alert('문의 수정에 실패했습니다.\n다시 시도해주세요.');
        }
      })
      .catch((err) => {
        console.log(err);
      });
    },
    async getOriginalData() {
      try {
        const url = "/qna/qnaEditId";

        const originalData = (await axios({
          method: 'post',
          url,
          data
        }).catch(error => {
          console.log(error);
        })).data;

        if (originalData.length > 0) {
        this.originalData = originalData;

      }
      console.log(this.originalData);
      } catch (error) {
        console.log(error);
      }      
      },
    /* async qnaEdit() {
      const editData = {
        QNA_TITLE: this.qna_title,
        QNA_CON: this.qna_con,
        QNA_ID: this.qna_id
      }

      axios.post("/qna/qnaEdit", editData)
          .then(response => {
            window.location.reload();
          })
          .catch(error => {
            console.error("Error deleting Q&A", error);
          });
    }, */
  }
  
}
</script>