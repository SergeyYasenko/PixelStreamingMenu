<template>
   <div class="apartment-selector">
      <div class="apartment-selector-header">
         <div class="apartment-selector-title">КВАРТИРЫ</div>
         <div class="apartment-selector-gradient-line"></div>
      </div>
      <div class="apartment-selector-content">
         <!-- ВЫБОР КОРПУСА -->
         <GridSelector
            title="ВЫБОР КОРПУСА"
            :items="corpItems"
            :selected-value="selectedCorp"
            :columns="2"
            @select="handleCorpSelect"
            @itemClick="handleCorpClick"
         />

         <!-- ВЫБОР ЭТАЖА -->
         <RangeInput
            v-model="floorValue"
            title="ВЫБОР ЭТАЖА"
            :min="2"
            :max="maxFloor"
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
            @itemClick="handleRoomClick"
         />

         <!-- ДОСТУПНОСТЬ -->
         <GridSelector
            title="ДОСТУПНОСТЬ"
            :items="availabilityItems"
            :selected-value="selectedAvailability"
            :columns="3"
            multiple
            @select="handleAvailabilitySelect"
            @itemClick="handleAvailabilityClick"
            class="availability-selector"
         />
      </div>
   </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
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
   corps: {
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
   "sendToEngine",
]);

// Данные для корпусов
const corpItems = computed(() => {
   return props.corps.map((corp) => ({
      value: corp.id,
      label: corp.name,
   }));
});

// Максимальное количество этажей на основе выбранного корпуса
const maxFloor = computed(() => {
   const selectedCorpData = props.corps.find(
      (corp) => corp.id === props.selectedCorp
   );
   return selectedCorpData ? selectedCorpData.floorsCount : 22;
});

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

// Watch для отправки на Unreal Engine при изменении этажа
watch(
   () => props.selectedFloor,
   (newValue) => {
      emit("sendToEngine", { budget: String(newValue) });
   }
);

// Watch для отправки на Unreal Engine при изменении площади
watch(
   () => props.selectedAreaMin,
   (newValue) => {
      emit("sendToEngine", { surface: String(newValue) });
   }
);

// Обработчики событий
const handleCorpSelect = (value) => {
   emit("update:selectedCorp", value);
};

const handleCorpClick = (value) => {
   // Отправляем на Unreal Engine в формате "build1": ""
   emit("sendToEngine", { [`build${value}`]: "" });
};

const handleRoomsSelect = (values) => {
   emit("update:selectedRooms", values);
};

const handleRoomClick = (value) => {
   // Отправляем на Unreal Engine в формате "room1": ""
   emit("sendToEngine", { [`room${value}`]: "" });
};

const handleAvailabilitySelect = (values) => {
   emit("update:selectedAvailability", values);
};

const handleAvailabilityClick = (value) => {
   // Маппинг значений доступности на команды для Unreal Engine
   const availabilityMap = {
      A: "available",
      R: "reserved",
      S: "sold",
   };

   const command = availabilityMap[value];
   if (command) {
      emit("sendToEngine", { [command]: "" });
   }
};
</script>

<style scoped>
.apartment-selector {
   position: absolute;
   bottom: 100%;
   left: 0;
   right: 0;
   z-index: 9;
   pointer-events: auto;
   padding: 0 40px;
   margin-bottom: 5px;

   @media (max-width: 1549px) {
      padding: 0;
   }
}

.apartment-selector-header {
   width: 100%;
}

.apartment-selector-title {
   font-size: 2.375rem;
   color: #fff;
   font-weight: bold;
   letter-spacing: 4px;
   text-transform: uppercase;
   font-family: "PF Stamps Pro Solid", sans-serif;
   margin-bottom: 10px;

   @media (max-width: 1549px) {
      margin-bottom: 5px;
      margin-left: 25px;
   }
}

.apartment-selector-gradient-line {
   width: 100%;
   height: 1px;
   background: linear-gradient(
      to right,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0) 100%
   );
   margin-bottom: 10px;

   @media (max-width: 1549px) {
      display: none;
   }
}

.apartment-selector-content {
   display: flex;
   gap: 25px;
   align-items: stretch;
   flex-wrap: wrap;
   max-width: 1400px;
}

.apartment-selector-content > * {
   flex: 0 1 auto;
   align-self: stretch;
}

.availability-selector {
   min-width: 180px;
}

@media (max-width: 1200px) {
   .apartment-selector-content {
      justify-content: flex-start;
      overflow-x: auto;
   }
}

/* На экранах ниже 1550px объединяем фоны и делаем wrap с gap 20px */
@media (max-width: 1549px) {
   .apartment-selector-content {
      gap: 20px;
      padding: 15px;
      background-color: rgba(34, 34, 34, 0.5);
      backdrop-filter: blur(10px);
      border-radius: 4px;
   }

   .apartment-selector-content > * {
      border-radius: 0;
   }

   .apartment-selector-content > * .grid-selector-title,
   .apartment-selector-content > * .range-input-title {
      background-color: transparent;
   }

   .apartment-selector-content > * .grid-selector-wrapper,
   .apartment-selector-content > * .range-input-value-container {
      background-color: transparent;
      backdrop-filter: none;
   }

   .apartment-selector-content > * .grid-selector-item,
   .apartment-selector-content > * .range-input-value-row {
      background-color: rgba(34, 34, 34, 0.8);
   }
}
</style>
