<template>
   <div class="house-body-top">
      <div class="house-body-logo-wrapper">
         <img
            class="house-body-logo-img"
            src="../assets/icons/logo.png"
            alt="logo"
         />
         <!-- <div class="house-body-logo-title">PALLADIUM</div>
         <div class="house-body-logo-text">
            prime real estate development L . L . C .
         </div> -->
      </div>
      <div class="house-body-top-title">Select residence</div>
      <div class="house-body-top-num-wrapper">
         <div
            class="house-body-top-num-row"
            v-for="(row, rowIndex) in corpRows"
            :key="rowIndex"
         >
            <div
               class="house-body-top-num"
               :class="{
                  selected: selectedCorp === corp.id,
                  'house-body-top-num-digit': isNumericCorp(corp.name),
                  'house-body-top-num-name': !isNumericCorp(corp.name),
               }"
               v-for="corp in row"
               :key="corp.id"
               @click="$emit('selectCorp', corp.id)"
            >
               {{ corp.name }}
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { computed } from "vue";

// Конфигурация названий корпусов (для проектов с именованными корпусами)
const namedCorpsConfig = {
   "The Royal Yacht": { name: "The Royal Yacht Hotel", id: 1 },
   "MAGNOLIA HOTEL APARTMENTS": { name: "MAGNOLIA HOTEL APARTMENTS", id: 2 },
   coralis: { name: "CORALIS", id: 3 },
};

const props = defineProps({
   corps: {
      type: Array,
      required: true,
   },
   selectedCorp: {
      type: Number,
      default: null,
   },
});

defineEmits(["selectCorp"]);

// Проверка, является ли значение числом
const isNumericCorp = (corpName) => {
   return !isNaN(corpName) && !isNaN(parseFloat(corpName));
};

// Вычисляемое свойство для разбиения корпусов на строки по 4 элемента
const corpRows = computed(() => {
   const rows = [];
   for (let i = 0; i < props.corps.length; i += 4) {
      rows.push(props.corps.slice(i, i + 4));
   }
   return rows;
});
</script>

<style scoped>
.house-body-top {
   min-width: 200px;
   width: 100%;
   display: flex;
   align-items: center;
   flex-direction: column;
   background-color: rgba(34, 34, 34, 0.5);
}

.house-body-logo-wrapper {
   width: 100%;
   display: flex;
   flex-direction: column;
   align-items: center;
   padding-bottom: 5px;
   border-bottom: 1px solid #fff;
}

.house-body-logo-img {
   max-width: 100%;
   margin-bottom: 5px;
   user-select: none;
   pointer-events: none;
}

.house-body-logo-title {
   font-size: 2.5rem;
   letter-spacing: 5px;
   user-select: none;
   @media (max-width: 1549px) {
      font-size: 2rem;
      letter-spacing: 3px;
   }
}

.house-body-logo-text {
   font-size: 0.75rem;
   user-select: none;
   @media (max-width: 1549px) {
      font-size: 0.625rem;
   }
}

.house-body-top-title {
   width: 100%;
   text-align: center;
   padding: 3px 0px;
   letter-spacing: 2px;
   border-bottom: 1px solid #fff;
   user-select: none;
   background-color: rgba(0, 27, 73, 0.5);
}

.house-body-top-num-wrapper {
   width: 100%;
   max-height: 160px;
   overflow-y: auto;
   display: flex;
   flex-direction: column;
   border-bottom: 1px solid #fff;
}

.house-body-top-num-row {
   width: 100%;
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   border-bottom: 1px solid #fff;
}

.house-body-top-num-row:last-child {
   border-bottom: none;
}

.house-body-top-num {
   cursor: pointer;
   flex: 1 1 auto;
   border: 1px solid transparent;
   transition: all 0.3s ease;
   user-select: none;
}

/* Стили для цифровых корпусов */
.house-body-top-num-digit {
   font-size: 1.5rem;
   text-align: center;
   padding: 2px 0;
   font-weight: 500;
}

/* Стили для именованных корпусов */
.house-body-top-num-name {
   font-size: 1.25rem;
   padding: 0 15px;
   text-align: left;
   border-bottom: 1px solid #fff;
   @media (max-width: 1549px) {
      font-size: 1rem;
   }
}

.house-body-top-num-name:last-child {
   border-bottom: none;
}

.house-body-top-num:hover {
   background-color: rgba(134, 2, 2, 0.5);
   border-right: 1px solid #fff;
   border-left: 1px solid #fff;
}

.house-body-top-num.selected {
   background-color: rgba(134, 2, 2, 0.5);
   border-right: 1px solid #fff;
   border-left: 1px solid #fff;
}
</style>
