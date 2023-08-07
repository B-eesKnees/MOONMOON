<style src="../assets/css/qnaList.css"></style>
<template>  
<div>  
  
  <GnbBar />

  <section class="mypage_menu"></section>
  <h1 class="qna_title">1:1 문의</h1>
  <section class="tabWrap">
    <TabsWrapper>
      <TabItem title="전체({{ countAll }})">
        <div v-if="!nodata">
          <a href="#"
          class="qna-write">1:1 문의하기</a>
        </div>

        <div class="qna-empty">
          <div v-if="qnaAll.length === 0">
            <div id="nodata" class="nodata">작성한 문의글이 없습니다</div>
          </div>

        </div>
        
      </TabItem>
      <TabItem title="답변 대기({{ countWaiting }})">

      </TabItem>
      <TabItem title="답변 완료({{ countDone }})">

      </TabItem>
    </TabsWrapper>
  </section>
</div> 

</template>
<script>
import GnbBar from '../components/gnbBar.vue'
import TabsWrapper from '../components/TabsWrapper.vue'
import TabItem from '../components/TabItem.vue'
import qnaAll from '../components/qnaAll.vue'


export default {
  components: { 
    GnbBar,
    TabsWrapper,
    TabItem,
    qnaAll,
   },
  name: "qnaTab",
  data() {
    return {
      currentTagName: "all",
      tabList: [
        { name: "전체", tag: "all" },
        { name: "답변 대기", tag: "waiting" },
        { name: "답변 완료", tag: "done" },
      ],
      repList: [
        { title: "1", tag: "all" },
        { title: "2", tag: "waiting" },
        { title: "3", tag: "done" },
      ],
      showQnaContent: false,
      repWaiting: true,
      repDone: false,
      conOpenBotton: require("../assets/img/qna-open.png"),
      conCloseBotton: require("../assets/img/qna-close.png"),
      countAll: 1,
      countWaiting: 1,
      countDone: 1,
    };
  },
  methods: {
    toggleContent() {
      this.showQnaContent = !this.showQnaContent;

      if (this.conOpenBotton === require("../assets/img/qna-open.png")) {
        this.conOpenBotton = this.conCloseBotton;
      } else {
        this.conOpenBotton = require("../assets/img/qna-open.png");
      }
    }
  },
  computed: {
    currentList() {
      return this.repList.filter((el) => el.tag == this.currentTagName);
    },
  },
  };
</script>