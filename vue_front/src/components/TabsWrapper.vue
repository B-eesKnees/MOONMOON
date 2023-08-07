<script setup>
import { useSlots, ref, provide, onMounted, watch } from "vue";

const slots = useSlots();
const tabTitles = ref(slots.default().map((tab) => tab.props.title));
const selectedTitle = ref();


// 탭 선택 시 호출되는 함수
/* const handleTabClick = (title) => {
  selectedTitle.value = title;
  // 선택한 탭을 sessionStorage에 저장
  sessionStorage.setItem("selectedTab", title);
  // 선택한 탭에 해당하는 selectGnb 값을 sessionStorage에 저장
  if (title === tabTitles.value[3]) {
    sessionStorage.setItem("selectGnb", "qnaDone");
  } else if (title === tabTitles.value[2]) {
    sessionStorage.setItem("selectGnb", "qnaWaiting");
  } else {
    sessionStorage.setItem("selectGnb", "");
  }
}; */

provide("selectedTitle", selectedTitle);
</script>

<template>
  <div class="tabs">
    <ul class="tabs__header">
      <li
        v-for="title in tabTitles"
        :key="title"
        class="tabs__item"
        :class="{ selected: selectedTitle === title }"
        @click="selectedTitle = title"
      >
        {{ title }}
      </li>
    </ul>

    <slot />
  </div>
</template>
