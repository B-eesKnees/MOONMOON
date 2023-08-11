<style src="../assets/css/qnaList.css"></style>
<template>
  <div>
    <GnbBar />

    <div class="mypage_menu"></div>
    <div class="right_box">
      <h1 class="qna_title">1:1 문의</h1>
      <!-- 탭시작 -->
      <section class="tabWrap">
        <TabsWrapper>
          <TabItem title="전체(11)">           
            <a href="#">
              <div class="qna-btn" v-if="!nodata">
                1:1 문의하기
              </div>
            </a>
            
            <div class="qna-all">
              <div v-if="qnaAllList.length === 0">
                <div id="nodata" class="nodata">작성한 문의글이 없습니다</div>
              </div>
              <qnaAll
                v-if="!nodata && qnaAllList.length > 0"
                :qnaAllList="qnaAllList"
                :showQnaContent="showQnaContent"                  
                :toggleContent="toggleContent"              
                :editMode="editMode"
              ></qnaAll>
            </div>
          </TabItem>
          <TabItem title="답변 대기(2)">
            <a href="#">
              <div class="qna-btn" v-if="!nodata">
                1:1 문의하기
              </div>
            </a>

            <div class="qna-wait">
              <div v-if="qnaWaitList.length === 0">
                <div id="nodata" class="nodata">답변 대기중인 문의글이 없습니다</div>
              </div>
              <qnaWait
                v-if="!nodata && qnaWaitList.length > 0"
                :qnaWaitList="qnaWaitList"
                :showQnaContent="showQnaContent"
                :toggleContent="toggleContent"
                :editMode="editMode"
              ></qnaWait>
            </div>
          </TabItem>
          <TabItem title="답변 완료(9)">
            <a href="#">
              <div class="qna-btn" v-if="!nodata">
                1:1 문의하기
              </div>
            </a>

            <div class="qna-done">
              <div v-if="qnaDoneList.length === 0">
                <div id="nodata" class="nodata">답변 완료된 문의글이 없습니다</div>
              </div>
              <qnaDone
                v-if="!nodata && qnaDoneList.length > 0"
                :qnaDoneList="qnaDoneList"
                :showQnaContent="showQnaContent"
                :toggleContent="toggleContent"
                :editMode="editMode"
              ></qnaDone>
            </div>
          </TabItem>
        </TabsWrapper>
      </section>
    </div>
  </div>
</template>
<script>
import axios from "axios";

import GnbBar from "../components/gnbBar.vue";
import TabsWrapper from "../components/TabsWrapper.vue";
import TabItem from "../components/TabItem.vue";
import qnaAll from "../components/qnaAll.vue";
import qnaWait from "../components/qnaWait.vue";
import qnaDone from "../components/qnaDone.vue";

export default {
  components: {
    GnbBar,
    TabsWrapper,
    TabItem,
    qnaAll,
    qnaWait,
    qnaDone,
  },
  name: "qnaList",
  data() {
    return {
      email: "",
      editMode: false,
      currentTagName: "전체(11)",
      showQnaContent: [],
      conOpenBotton: require("../assets/img/qna-open.png"),
      conCloseBotton: require("../assets/img/qna-close.png"),
      nodata: false,     
      qnaAllList: [],
      qnaWaitList: [],
      qnaDoneList: [], 
    };
  },
    created() {
      this.email = localStorage.getItem("userID");  
     
      this.getQnaAllList();
      this.getQnaWaitList();
      this.getQnaDoneList();
    },
    methods: {
    toggleContent() {
      this.$set(this.showQnaContent, index, !this.showQnaContent[index]);

      if (this.conOpenBotton === require("../assets/img/qna-open.png")) {
        this.conOpenBotton = this.conCloseBotton;
      } else {
        this.conOpenBotton = require("../assets/img/qna-open.png");
      }
    },  
    async getQnaAllList() {
      try {
        const url = "/qna/qnaAll";
        const data = { email: this.email };

        const qnaAllList = (await axios({
          method: 'post',
          url,
          data
        }).catch(error => {
          console.log(error);
        })).data;

        if (qnaAllList.length > 0) {
        this.qnaAllList = qnaAllList;

      }
      console.log(this.qnaAllList);
      } catch (error) {
        console.log(error);
      }      
      },
      async getQnaWaitList() {
      try {
        const url = "/qna/qnaWait";
        const data = { email: this.email };

        const qnaWaitList = (await axios({
          method: 'post',
          url,
          data
        }).catch(error => {
          console.log(error);
        })).data;

        if (qnaWaitList.length > 0) {
        this.qnaWaitList = qnaWaitList;

      }
      console.log(this.qnaWaitList);
      } catch (error) {
        console.log(error);
      }      
      },
      async getQnaDoneList() {
      try {
        const url = "/qna/qnaDone";
        const data = { email: this.email };

        const qnaDoneList = (await axios({
          method: 'post',
          url,
          data
        }).catch(error => {
          console.log(error);
        })).data;

        if (qnaDoneList.length > 0) {
        this.qnaDoneList = qnaDoneList;

      }
      console.log(this.qnaDoneList);
      } catch (error) {
        console.log(error);
      }      
      }
    }, 
 
};
</script>
