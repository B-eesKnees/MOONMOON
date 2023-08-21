<script setup>
import { useSlots, ref, provide, onMounted, watch } from "vue";

const slots = useSlots();
const tabTitles = ref(slots.default().map((tab) => tab.props.title));
const selectedTitle = ref("룰렛");

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
