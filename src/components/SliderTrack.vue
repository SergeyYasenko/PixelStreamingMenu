<template>
   <div class="slider-track-wrapper">
      <!-- Активная область -->
      <div class="slider-track-active" :style="activeStyle"></div>

      <!-- Полоска трека -->
      <div class="slider-track-base"></div>
   </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
   value: {
      type: Number,
      required: true,
   },
   min: {
      type: Number,
      default: 0,
   },
   max: {
      type: Number,
      default: 100,
   },
   height: {
      type: Number,
      default: 4,
   },
});

const activeStyle = computed(() => {
   const percentage =
      ((props.value - props.min) / (props.max - props.min)) * 100;
   return {
      width: `${percentage}%`,
   };
});
</script>

<style scoped>
.slider-track-wrapper {
   position: relative;
   width: 100%;
   height: v-bind("`${height}px`");
}

.slider-track-base {
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background: rgba(255, 255, 255, 0.3);
   border-radius: 2px;
}

.slider-track-active {
   position: absolute;
   top: 0;
   left: 0;
   height: 100%;
   background: rgba(255, 255, 255, 0.4);
   border-radius: 2px;
   pointer-events: none;
   z-index: 1;
}
</style>
