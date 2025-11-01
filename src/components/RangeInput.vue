<template>
   <div class="range-input-container">
      <div class="range-input-title">{{ title }}</div>
      <div class="range-input-value-container">
         <div class="range-input-value-row">
            <div class="range-input-value-wrapper">
               <div class="range-input-value-text">{{ valuePrefix }}</div>
               <div class="range-input-value-number">
                  {{ formatValue(modelValue) }}{{ valueSuffix }}
               </div>
            </div>
            <div class="range-input-wrapper">
               <!-- Компонент полоски -->
               <div class="slider-track-container">
                  <SliderTrack
                     :value="modelValue"
                     :min="min"
                     :max="max"
                     :height="trackHeight"
                  />
               </div>

               <input
                  type="range"
                  :min="min"
                  :max="max"
                  :step="step"
                  :value="modelValue"
                  @input="handleInput"
                  class="range-input-slider"
               />

               <!-- Labels под слайдером -->
               <div class="range-input-labels-bottom">
                  <span>{{ formatValue(min) }}</span>
                  <span>{{ formatValue(max) }}</span>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { computed } from "vue";
import SliderTrack from "./SliderTrack.vue";

const props = defineProps({
   title: {
      type: String,
      required: true,
   },
   modelValue: {
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
   step: {
      type: Number,
      default: 1,
   },
   formatValue: {
      type: Function,
      default: (value) => value,
   },
   valuePrefix: {
      type: String,
      default: "",
   },
   valueSuffix: {
      type: String,
      default: "",
   },
   thumbSize: {
      type: Number,
      default: 20,
   },
   thumbOffset: {
      type: Number,
      default: 0,
   },
   trackHeight: {
      type: Number,
      default: 1,
   },
});

const emit = defineEmits(["update:modelValue"]);

const handleInput = (event) => {
   const value = Number(event.target.value);
   emit("update:modelValue", value);
};

// Computed для размеров в CSS
const thumbSizeValue = computed(() => `${props.thumbSize}px`);
const thumbOffsetValue = computed(() => `${props.thumbOffset}px`);
</script>

<style scoped>
.range-input-container {
   border-radius: 4px;
   min-width: 150px;
   display: flex;
   flex-direction: column;
   align-self: stretch;
}

.range-input-title {
   width: 100%;
   background-color: rgba(34, 34, 34, 0.8);
   font-size: 0.875rem;
   color: #fff;
   padding-left: 15px;
   letter-spacing: 1px;
   text-transform: uppercase;
   font-weight: 500;

   @media (max-width: 1549px) {
      background-color: transparent;
      padding-bottom: 10px;
   }
}

.range-input-value-container {
   padding: 15px;
   backdrop-filter: blur(10px);
   background-color: rgba(34, 34, 34, 0.2);
   flex: 1;
   display: flex;
   flex-direction: column;
   justify-content: center;
   min-height: 0;

   @media (max-width: 1549px) {
      backdrop-filter: none;
      background-color: transparent;
      padding: 0;
   }
}

.range-input-value-row {
   padding: 15px;
   background-color: rgba(34, 34, 34, 0.5);
   display: flex;
   flex-direction: column;
   justify-content: center;
   flex: 1;

   @media (max-width: 1549px) {
      background-color: transparent;
      padding: 0;
   }
}

.range-input-value-wrapper {
   display: flex;
   align-items: center;
   font-weight: 500;
}

.range-input-value-text {
   font-size: 1rem;
   color: #fff;
   margin-right: 5px;
   text-transform: capitalize;
   letter-spacing: 5px;
}

.range-input-value-number {
   font-size: 1rem;
   color: #fff;
   text-transform: capitalize;
   letter-spacing: 3px;
}

.range-input-wrapper {
   position: relative;
   width: 100%;
   padding-top: 20px;
   padding-bottom: 25px;
}

/* Labels над слайдером */
.range-input-labels-top {
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   display: flex;
   justify-content: flex-end;
   font-size: 0.75rem;
   color: rgba(255, 255, 255, 0.8);
   font-weight: 400;
}

/* Labels под слайдером */
.range-input-labels-bottom {
   position: absolute;
   bottom: 0;
   left: 0;
   right: 0;
   display: flex;
   justify-content: space-between;
   font-size: 0.75rem;
   color: rgba(255, 255, 255, 0.8);
   font-weight: 400;
}

.slider-track-container {
   position: absolute;
   top: 17px;
   left: 0;
   width: 100%;
   z-index: 0;
}

.range-input-slider {
   width: 100%;
   height: 1px;
   border-radius: 2px;
   background: transparent;
   outline: none;
   -webkit-appearance: none;
   appearance: none;
   cursor: pointer;
   position: absolute;
   top: 17px;
   left: 0;
   z-index: 2;
}

.range-input-slider::-webkit-slider-thumb {
   -webkit-appearance: none;
   appearance: none;
   width: v-bind("thumbSizeValue");
   height: v-bind("thumbSizeValue");
   border-radius: 50%;
   background: #fff;
   cursor: pointer;
   border: none;
   box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
   transition: all 0.2s ease;
   margin-top: calc(
      v-bind("thumbOffsetValue") - calc(v-bind("thumbSizeValue") / 2)
   );
}

.range-input-slider::-webkit-slider-thumb:hover {
   transform: scale(1.05);
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.range-input-slider::-moz-range-thumb {
   width: v-bind("thumbSizeValue");
   height: v-bind("thumbSizeValue");
   border-radius: 50%;
   background: #fff;
   cursor: pointer;
   border: none;
   box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
   transition: all 0.2s ease;
}

.range-input-slider::-moz-range-thumb:hover {
   transform: scale(1.05);
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.range-input-slider::-webkit-slider-runnable-track {
   width: 100%;
   height: 1px;
   border-radius: 2px;
   background: transparent;
}

.range-input-slider::-moz-range-track {
   width: 100%;
   height: 1px;
   border-radius: 2px;
   background: transparent;
}
</style>
