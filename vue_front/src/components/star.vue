<template><i class="fa-solid fa-star-half"></i>
  <div>
    <template v-for="starIndex in 5" :key="'star-' + starIndex">
      <i
        class="fa-solid fa-star"
        v-if="starIndex <= filledStars"
      ></i>
      <i
        class="fa-solid fa-star-half-stroke"
        v-else-if="starIndex - 0.5 === filledStars"
      ></i>
      <i
        class="fa-regular fa-star"
        v-else
      ></i>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    rating: {
      type: Number,
      required: true,
    },
  },
  computed: {
    filledStars() {
      return Math.floor(this.rating);
    },
  },
}
</script>

<style scoped>
.star-icon {
  font-size: 1.2em; /* 조절 가능한 사이즈 */
  color: #4e4eff; /* 별 모양의 색상 */
}

.star {
  display: inline-block;
}
</style>
