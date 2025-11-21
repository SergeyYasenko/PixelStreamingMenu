<template>
   <div
      class="vertical-range-input-container"
      :class="{
         'has-open-menus': hasOpenMenus,
         'has-collapsed-menus': hasCollapsedMenus,
      }"
   >
      <div class="vertical-range-input-wrapper">
         <div class="vertical-slider-track-container">
            <div class="vertical-slider-track-wrapper">
               <div class="vertical-slider-track-base"></div>
            </div>
         </div>

         <input
            type="range"
            :min="min"
            :max="max"
            :step="step"
            :value="invertedValue"
            @input="handleInput"
            @mouseup="handleMouseUp"
            @touchend="handleMouseUp"
            class="vertical-range-input-slider"
         />
      </div>
   </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
   modelValue: {
      type: Number,
      default: 0,
   },
   min: {
      type: Number,
      default: -1,
   },
   max: {
      type: Number,
      default: 1,
   },
   step: {
      type: Number,
      default: 0.1,
   },
   hasOpenMenus: {
      type: Boolean,
      default: false,
   },
   hasCollapsedMenus: {
      type: Boolean,
      default: false,
   },
});

const emit = defineEmits(["update:modelValue"]);

// Инвертируем значение для слайдера: 1 вверху (-1 в исходном значении = 1 в слайдере)
const invertedValue = computed(() => {
   // Инвертируем: если modelValue = 1, то invertedValue = -1
   // Если modelValue = -1, то invertedValue = 1
   return -props.modelValue;
});

const handleInput = (event) => {
   // Инвертируем обратно: если слайдер = -1, то значение = 1
   const sliderValue = Number(event.target.value);
   const actualValue = -sliderValue;
   emit("update:modelValue", actualValue);
};

const handleMouseUp = () => {
   // Возвращаем значение к 0 при отпускании
   emit("update:modelValue", 0);
};
</script>

<style scoped>
.vertical-range-input-container {
   position: fixed;
   right: 50px;
   bottom: 130px;
   display: flex;
   flex-direction: column;
   align-items: center;
   pointer-events: auto;
   z-index: 15;
   transition: z-index 0s;

   @media (max-width: 1549px) {
      right: 50px;
      z-index: 5;
   }
}

.vertical-range-input-container.has-open-menus {
   z-index: 4;
   transition: z-index 0s;

   @media (max-width: 1549px) {
      z-index: 4;
   }
}

.vertical-range-input-container.has-collapsed-menus:not(.has-open-menus) {
   z-index: 150;
   transition: z-index 0s 0.4s;

   @media (max-width: 1549px) {
      z-index: 150;
   }
}

.vertical-range-input-wrapper {
   position: relative;
   height: 300px;
   width: 40px;
   display: flex;
   flex-direction: column;
   align-items: center;

   @media (max-width: 1549px) {
      height: 250px;
      width: 35px;
   }
}

.vertical-slider-track-container {
   position: absolute;
   top: 0;
   left: 50%;
   transform: translateX(-50%);
   height: 100%;
   width: 4px;
   z-index: 0;
}

.vertical-slider-track-wrapper {
   position: relative;
   width: 100%;
   height: 100%;
}

.vertical-slider-track-base {
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background: rgba(255, 255, 255, 0.3);
   border-radius: 2px;
}

.vertical-range-input-slider {
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%) rotate(-90deg);
   width: 300px;
   height: 40px;
   -webkit-appearance: none;
   appearance: none;
   background: transparent;
   outline: none;
   cursor: pointer;
   z-index: 2;

   @media (max-width: 1549px) {
      width: 250px;
      height: 35px;
   }
}

/* Webkit (Chrome, Safari, Edge) */
.vertical-range-input-slider::-webkit-slider-thumb {
   -webkit-appearance: none;
   appearance: none;
   width: 20px;
   height: 20px;
   border-radius: 50%;
   background: #fff;
   cursor: pointer;
   border: none;
   box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
   transition: all 0.2s ease;
   margin-top: -8px;
}

.vertical-range-input-slider::-webkit-slider-thumb:hover {
   transform: scale(1.1);
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.vertical-range-input-slider::-webkit-slider-runnable-track {
   width: 100%;
   height: 4px;
   background: transparent;
   border-radius: 2px;
}

/* Firefox */
.vertical-range-input-slider::-moz-range-thumb {
   width: 20px;
   height: 20px;
   border-radius: 50%;
   background: #fff;
   cursor: pointer;
   border: none;
   box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
   transition: all 0.2s ease;
}

.vertical-range-input-slider::-moz-range-thumb:hover {
   transform: scale(1.1);
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.vertical-range-input-slider::-moz-range-track {
   width: 100%;
   height: 4px;
   background: transparent;
   border: none;
   border-radius: 2px;
}
</style>
