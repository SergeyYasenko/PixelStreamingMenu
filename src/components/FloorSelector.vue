<template>
   <div class="house-body-bottom" v-if="showFloors">
      <div class="house-body-bottom-wrapper" :class="corpColorClass">
         <div class="house-body-bottom-text-wrapper" :class="corpColorClass">
            <div class="house-body-bottom-text">SELECT FLOOR</div>
         </div>
         <div class="house-body-bottom-num-wrapper">
            <div
               class="house-body-bottom-num-row"
               v-for="(row, rowIndex) in floorRows"
               :key="rowIndex"
            >
               <div
                  class="house-body-bottom-num"
                  :class="{ selected: selectedFloor === floor.id }"
                  v-for="floor in row"
                  :key="floor.id"
                  @click="$emit('selectFloor', floor.id)"
               >
                  {{ floor.num }}
               </div>
            </div>
         </div>
         <div class="house-body-name-wrapper" :class="corpColorClass">
            <div class="house-body-name-text">{{ selectedCorpName }}</div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
   floors: {
      type: Array,
      required: true,
   },
   selectedCorp: {
      type: Number,
      default: null,
   },
   selectedCorpName: {
      type: String,
      default: "",
   },
   selectedFloor: {
      type: Number,
      default: null,
   },
   showFloors: {
      type: Boolean,
      default: false,
   },
});

const emit = defineEmits(["selectFloor", "hideFloors"]);

const handleArrowClick = () => {
   emit("hideFloors");
};

// Вычисляемое свойство для разбиения этажей на строки по 3 элемента
const floorRows = computed(() => {
   // Добавляем кнопку ALL в конец массива этажей
   const floorsWithAll = [...props.floors, { id: "all", num: "ALL" }];

   const rows = [];
   for (let i = 0; i < floorsWithAll.length; i += 3) {
      rows.push(floorsWithAll.slice(i, i + 3));
   }
   return rows;
});

// Вычисляемое свойство для динамического класса цвета корпуса
const corpColorClass = computed(() => {
   return `corp-color-${props.selectedCorp}`;
});
</script>

<style scoped>
.house-body-bottom {
   width: 100%;
   min-width: 200px;
   display: flex;
   flex-direction: column;
   align-items: center;
}

.house-body-bottom-text-wrapper {
   width: 100%;
   text-align: center;
   padding: 5px 0px;
   border-bottom: 1px solid #fff;
   transition: background-color 0.3s ease;
}

/* Цвета заголовка для каждого корпуса */
.house-body-bottom-text-wrapper.corp-color-1 {
   background-color: rgba(73, 29, 0, 0.7); /* Коричневый темнее для корпуса 1 */
}

.house-body-bottom-text-wrapper.corp-color-2 {
   background-color: rgba(134, 2, 2, 0.7); /* Зеленый темнее для корпуса 2 */
}

.house-body-bottom-text-wrapper.corp-color-3 {
   background-color: rgba(0, 27, 73, 0.7); /* Синий темнее для корпуса 3 */
}

.house-body-bottom-text {
   font-size: 0.875rem;
   letter-spacing: 1px;
   user-select: none;
}

.house-body-bottom-wrapper {
   width: 100%;
   overflow-y: auto;
   display: flex;
   flex-direction: column;
   align-items: space-between;
   transition: background-color 0.3s ease;

   /* @media (max-width: 1549px) {
      height: 200px;
   } */
}

/* Цвета для каждого корпуса */
.house-body-bottom-wrapper.corp-color-1 {
   background-color: rgba(73, 29, 0, 0.5); /* Коричневый для корпуса 1 */
}

.house-body-bottom-wrapper.corp-color-2 {
   background-color: rgba(134, 2, 2, 0.5); /* Зеленый для корпуса 2 */
}

.house-body-bottom-wrapper.corp-color-3 {
   background-color: rgba(0, 27, 73, 0.5); /* Синий для корпуса 3 */
}

.house-body-bottom-num-wrapper {
   width: 100%;
   display: flex;
   flex-direction: column;
}

.house-body-bottom-num-row {
   width: 100%;
   display: flex;
   justify-content: space-between;
   border-bottom: 1px solid #fff;
}

.house-body-bottom-num-row:last-child {
   border-bottom: none;
}

.house-body-bottom-num {
   font-size: 1.125rem;
   cursor: pointer;
   flex: 1;
   border: 1px solid transparent;
   transition: all 0.3s ease;
   border-radius: 4px;
   text-align: center;
   user-select: none;
}

.house-body-bottom-num:hover {
   background-color: rgba(134, 2, 2, 0.5);
   border: 1px solid #fff;
}

.house-body-bottom-num.selected {
   background-color: rgba(134, 2, 2, 0.5);
   border: 1px solid #fff;
}

.house-body-bottom-arrow-wrapper {
   width: 100%;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   padding: 5px 0px;
}

.house-body-bottom-arrow img {
   height: 30px;
   width: 30px;
   cursor: pointer;
   transform: rotate(180deg);
   transition: all 0.3s ease;
   user-select: none;
   pointer-events: none;
}

.house-body-bottom-arrow:hover img {
   opacity: 0.5;
   transition: all 0.3s ease;
}

.house-body-name-wrapper {
   width: 100%;
   text-align: center;
   padding: 10px 15px;
   border-top: 1px solid #fff;
   margin-top: auto;
   transition: background-color 0.3s ease;
}

/* Цвета названия корпуса */
.house-body-name-wrapper.corp-color-1 {
   background-color: rgba(73, 29, 0, 0.7); /* Коричневый темнее для корпуса 1 */
}

.house-body-name-wrapper.corp-color-2 {
   background-color: rgba(134, 2, 2, 0.7); /* Зеленый темнее для корпуса 2 */
}

.house-body-name-wrapper.corp-color-3 {
   background-color: rgba(0, 27, 73, 0.7); /* Синий темнее для корпуса 3 */
}

.house-body-name-text {
   font-size: 1rem;
   letter-spacing: 1px;
   color: #fff;
   user-select: none;
}
</style>
