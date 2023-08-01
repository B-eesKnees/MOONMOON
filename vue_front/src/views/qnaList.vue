<template>    
  <div class="wrap">
    <h1>1:1 문의</h1>
    <div class="tab">
      <!-- 탭메뉴 출력 -->
      <button
      v-for="(tab, index) in tabList"
      :key="index"
      @click.prevent="currentTagName = tab.tag"
      :class="{ active: currentTagName === tab.tag }"
      >
        {{ tab.name }}
      </button>
    </div>
    <ul class="tab-content">
      <li v-for="(item, index) in currentList" :key="index">
        <!-- 탭 내부 내용 출력 -->
        <div class="tab-rep" :class="{all : item.tag == 'all', waiting: item.tag == 'waiting', done: item.tag == 'done'}"></div>
          <button>편집{{ item.title }}</button>
          <button>1:1 문의하기{{ item.title }}</button>
          <h1>{{ item.title }}</h1>
          <div class="qna-list">
            <div class="qna-content">
              <div class="qna_rep">
                <!-- 대기중/완료 아이콘 -->
                <div v-if="repWaiting">
                  <img src="../assets/img/waiting.png" alt="waiting-img">
                </div>
                <div v-if="repDone">
                  <img src="../assets/img/done.png" alt="done-img">
                </div>
              </div>
              <!-- 문의 제목/날짜 -->
              <div class="qna_tilte">제목{{ item.title }}{{ QNA_TITLE }}</div>
              <div class="qna_date">날짜{{ item.title }}{{ QNA_DATE }}</div>
            </div>
            <div>
              <!-- 버튼 토글-문의 내용/답변 내용 -->
              <button @click="toggleContent" class="con-open">
                <img :src="conOpenBotton" alt="con-open/close" />
              </button>
              <div v-if="showQnaContent">
                <div class="qna_con">내용{{ item.title }}{{ QNA_CON }}</div>
                <div class="qna_reply">답변{{ item.title }}{{ QNA_REPLY }}</div>
              </div>
            </div>
          </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
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