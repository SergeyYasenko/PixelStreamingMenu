<template>
   <div class="apartment-selector">
      <div class="apartment-selector-header">
         <div class="apartment-selector-title">КВАРТИРЫ</div>
      </div>
      <div class="apartment-selector-divider"></div>
      <div class="apartment-selector-content">
         <!-- ВЫБОР КОРПУСА -->
         <GridSelector
            title="ВЫБОР КОРПУСА"
            :items="corpItems"
            :selected-value="selectedCorp"
            :columns="2"
            @select="handleCorpSelect"
         />

         <!-- ВЫБОР ЭТАЖА -->
         <RangeInput
            v-model="floorValue"
            title="ВЫБОР ЭТАЖА"
            :min="2"
            :max="22"
            :step="1"
            :format-value="formatFloor"
            value-prefix="ЭТАЖ"
            value-suffix="-Й"
         />

         <!-- ПЛОЩАДЬ -->
         <RangeInput
            v-model="areaValue"
            title="ПЛОЩАДЬ"
            :min="0"
            :max="120"
            :step="1"
            :format-value="formatArea"
            value-prefix="Min:"
            value-suffix=" м.кв."
         />

         <!-- КОЛ-ВО КОМНАТ -->
         <GridSelector
            title="КОЛ-ВО КОМНАТ"
            :items="roomItems"
            :selected-value="selectedRooms"
            :columns="2"
            multiple
            @select="handleRoomsSelect"
         />

         <!-- ДОСТУПНОСТЬ -->
         <GridSelector
            title="ДОСТУПНОСТЬ"
            :items="availabilityItems"
            :selected-value="selectedAvailability"
            :columns="3"
            multiple
            @select="handleAvailabilitySelect"
         />
      </div>
   </div>
</template>

<script setup>
import { ref, computed } from "vue";
import GridSelector from "./GridSelector.vue";
import RangeInput from "./RangeInput.vue";

const props = defineProps({
   selectedCorp: {
      type: Number,
      default: null,
   },
   selectedFloor: {
      type: Number,
      default: 13,
   },
   selectedAreaMin: {
      type: Number,
      default: 0,
   },
   selectedRooms: {
      type: Array,
      default: () => [],
   },
   selectedAvailability: {
      type: Array,
      default: () => [],
   },
});

const emit = defineEmits([
   "update:selectedCorp",
   "update:selectedFloor",
   "update:selectedAreaMin",
   "update:selectedRooms",
   "update:selectedAvailability",
]);

// Данные для корпусов
const corpItems = [
   { value: 1, label: "1" },
   { value: 2, label: "2" },
   { value: 3, label: "3" },
   { value: 4, label: "4" },
];

// Данные для комнат
const roomItems = [
   { value: 1, label: "1" },
   { value: 2, label: "2" },
   { value: 3, label: "3" },
   { value: 4, label: "4" },
];

// Данные для доступности
const availabilityItems = [
   { value: "A", label: "A" },
   { value: "R", label: "R" },
   { value: "S", label: "S" },
];

// Значения для range inputs
const floorValue = computed({
   get: () => props.selectedFloor,
   set: (value) => emit("update:selectedFloor", value),
});

const areaValue = computed({
   get: () => props.selectedAreaMin,
   set: (value) => emit("update:selectedAreaMin", value),
});

// Функции форматирования
const formatFloor = (value) => {
   return value;
};

const formatArea = (value) => {
   return value;
};

// Обработчики событий
const handleCorpSelect = (value) => {
   emit("update:selectedCorp", value);
};

const handleRoomsSelect = (values) => {
   emit("update:selectedRooms", values);
};

const handleAvailabilitySelect = (values) => {
   emit("update:selectedAvailability", values);
};
</script>

<style scoped>
.apartment-selector {
   position: fixed;
   bottom: 50px;
   left: 0;
   right: 0;
   z-index: 9;
   pointer-events: auto;
   padding: 0 40px;
}

.apartment-selector-header {
   width: 100%;
}

.apartment-selector-title {
   font-size: 34px;
   color: #fff;
   font-weight: bold;
   letter-spacing: 4px;
   text-transform: uppercase;
   font-family: "Wow Games Sans", sans-serif;
}

.apartment-selector-divider {
   width: 100%;
   height: 1px;
   background-color: #fff;
   margin: 10px 0;
}

.apartment-selector-content {
   display: flex;
   gap: 25px;
   align-items: stretch;
   padding: 25px 30px 25px 0;
   flex-wrap: wrap;
   max-width: 1400px;
}

.apartment-selector-content > * {
   display: flex;
   flex-direction: column;
   justify-content: center;
}

@media (max-width: 1200px) {
   .apartment-selector-content {
      justify-content: flex-start;
      overflow-x: auto;
   }
}
</style>
