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
              <div v-if="qnaAll.length === 0">
                <div id="nodata" class="nodata">작성한 문의글이 없습니다</div>
              </div>
              <qnaAll
                v-if="!nodata && qnaAll.length > 0"
                :qnaAll="qnaAll"
                :showQnaContent="showQnaContent"
                :key="qnaAll[0].QNA_ID"
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

            <div class="qna-all">
              <div v-if="qnaAll.length === 0">
                <div id="nodata" class="nodata">답변 대기중인 문의글이 없습니다</div>
              </div>
              <qnaWaiting
                v-if="!nodata && qnaAll.length > 0"
                :qnaAll="qnaAll"
                :showQnaContent="showQnaContent"
                :key="qnaAll[0].QNA_ID"
                :editMode="editMode"
              ></qnaWaiting>
            </div>
          </TabItem>
          <TabItem title="답변 완료(9)">
            <a href="#">
              <div class="qna-btn" v-if="!nodata">
                1:1 문의하기
              </div>
            </a>

            <div class="qna-all">
              <div v-if="qnaAll.length === 0">
                <div id="nodata" class="nodata">답변 완료된 문의글이 없습니다</div>
              </div>
              <qnaDone
                v-if="!nodata && qnaAll.length > 0"
                :qnaAll="qnaAll"
                :showQnaContent="showQnaContent"
                :key="qnaAll[0].QNA_ID"
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
import qnaWaiting from "../components/qnaWaiting.vue";
import qnaDone from "../components/qnaDone.vue";

export default {
  components: {
    GnbBar,
    TabsWrapper,
    TabItem,
    qnaAll,
    qnaWaiting,
    qnaDone,
  },
  name: "qnaList",
  data() {
    return {
      currentTagName: "전체(11)",
      showQnaContent: true,
      repWaiting: true,
      repDone: false,
      conOpenBotton: require("../assets/img/qna-open.png"),
      conCloseBotton: require("../assets/img/qna-close.png"),
      nodata: false,     
      qnaAll: [], 
    };
  },
    created() {
      this.email = localStorage.getItem("userID");  
     
      this.qnaAllList();
    },
    methods: {
    toggleContent() {
      this.showQnaContent = !this.showQnaContent;

      if (this.conOpenBotton === require("../assets/img/qna-open.png")) {
        this.conOpenBotton = this.conCloseBotton;
      } else {
        this.conOpenBotton = require("../assets/img/qna-open.png");
      }
    },  
    async qnaAllList() {
      this.nodata = false;
    try {
      const response = await axios.get("/qna/qnaAll", { email: this.email });
      this.qnaAll = response.data.qnaAll;
      console.log(this.qnaAll);
    } catch (error) {
      console.log(error);
    }
  },  
    
  },
  computed: {
    currentList() {
      return this.repList.filter((el) => el.tag == this.currentTagName);
    },
  },
};
</script>
