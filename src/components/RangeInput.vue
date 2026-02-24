<template>
   <div class="range-input-container">
      <div v-if="title" class="range-input-title">{{ title }}</div>
      <div class="range-input-value-container">
         <div class="range-input-column">
            <input
               type="range"
               :min="min"
               :max="max"
               :step="step"
               :value="modelValue"
               @input="handleInput"
               class="range-input-slider"
            />
            <span v-if="displayValue" class="range-input-value">{{ displayValue }}</span>
            <div v-else-if="valuePrefix || valueSuffix" class="range-input-value-wrapper">
               <span v-if="valuePrefix" class="range-input-value-prefix">{{ valuePrefix }}</span>
               <span class="range-input-value-number">{{ formatValue(modelValue) }}{{ valueSuffix }}</span>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
   title: {
      type: String,
      default: "",
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
   displayValue: {
      type: String,
      default: "",
   },
});

const emit = defineEmits(["update:modelValue"]);

const handleInput = (event) => {
   const value = Number(event.target.value);
   emit("update:modelValue", value);
};
</script>

<style scoped>
.range-input-container {
   display: flex;
   flex-direction: column;
   width: 100%;
}

.range-input-title {
   font-size: 0.875rem;
   font-weight: 500;
   color: #fff;
   margin-bottom: 8px;
   letter-spacing: 1px;
   text-transform: uppercase;
   user-select: none;
}

.range-input-value-container {
   min-width: 100%;
   display: flex;
   flex-direction: column;
}

.range-input-column {
   display: flex;
   flex-direction: column-reverse;
   align-items: center;
   gap: 10px;
}

.range-input-slider {
   flex: 1;
   height: 12px;
   width: 100%;
   -webkit-appearance: none;
   appearance: none;
   background: #fff;
   border-radius: 12px;
   outline: none;
   cursor: pointer;
}

.range-input-slider::-webkit-slider-thumb {
   -webkit-appearance: none;
   width: 20px;
   height: 20px;
   border-radius: 50%;
   background: var(--color-hover);
   cursor: pointer;
   transition: transform 0.2s ease;
   margin-top: -4px;
}

.range-input-slider::-webkit-slider-thumb:hover {
   transform: scale(1.1)
}

.range-input-slider::-moz-range-thumb {
   width: 20px;
   height: 20px;
   border-radius: 50%;
   background: var(--color-hover);
   cursor: pointer;
   border: none;
   transform: translateY(-4px);
}

.range-input-slider::-webkit-slider-runnable-track {
   width: 100%;
   height: 12px;
   border-radius: 12px;
   background: rgba(255, 255, 255, 0.2);
}

.range-input-slider::-moz-range-track {
   width: 100%;
   height: 6px;
   border-radius: 3px;
   background: rgba(255, 255, 255, 0.2);
}

.range-input-value {
   font-size: 1.125rem;
   color: rgba(255, 255, 255, 0.9);
   min-width: 90px;
   white-space: nowrap;
}

.range-input-value-container {
  max-width: fit-content;
}

.range-input-value-wrapper {
   display: flex;
   align-items: center;
   gap: 4px;
   font-size: 0.875rem;
   color: rgba(255, 255, 255, 0.9);
}

.range-input-value-prefix {
   white-space: nowrap;
}

.range-input-value-number {
   white-space: nowrap;
}
</style>
