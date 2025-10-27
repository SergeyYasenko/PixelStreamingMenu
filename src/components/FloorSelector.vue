<template>
   <div class="house-body-bottom" v-if="showFloors">
      <div class="house-body-bottom-title-wrapper">
         <div class="house-body-bottom-title">КОРПУС {{ selectedCorp }}</div>
      </div>
      <div class="house-body-bottom-wrapper">
         <div class="house-body-bottom-text-wrapper">
            <div class="house-body-bottom-text">Выберите этаж</div>
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
         <div class="house-body-bottom-arrow-wrapper">
            <div class="house-body-bottom-arrow">
               <img src="../assets/icons/arrow.png" alt="arrow-left" />
            </div>
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
   selectedFloor: {
      type: Number,
      default: null,
   },
   showFloors: {
      type: Boolean,
      default: false,
   },
});

defineEmits(["selectFloor"]);

// Вычисляемое свойство для разбиения этажей на строки по 3 элемента
const floorRows = computed(() => {
   const rows = [];
   for (let i = 0; i < props.floors.length; i += 3) {
      rows.push(props.floors.slice(i, i + 3));
   }
   return rows;
});
</script>

<style scoped>
.house-body-bottom {
   width: 100%;
   display: flex;
   flex-direction: column;
   align-items: center;
   background-color: rgba(34, 34, 34, 0.5);
}

.house-body-bottom-title-wrapper {
   width: 100%;
   text-align: center;
   padding: 5px 0px;
   border-bottom: 1px solid #fff;
}

.house-body-bottom-title {
   font-size: 18px;
   letter-spacing: 2px;
}

.house-body-bottom-text-wrapper {
   width: 100%;
   text-align: center;
   padding: 5px 0px;
   border-bottom: 1px solid #fff;
}

.house-body-bottom-text {
   font-size: 14px;
   letter-spacing: 1px;
}

.house-body-bottom-wrapper {
   width: 100%;
   height: 300px;
   overflow-y: auto;
   display: flex;
   flex-direction: column;
   align-items: space-between;
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

.house-body-bottom-num {
   font-size: 18px;
   cursor: pointer;
   flex: 1;
   border: 1px solid transparent;
   transition: all 0.3s ease;
   border-radius: 4px;
   text-align: center;
}

.house-body-bottom-num:hover {
   background-color: rgba(134, 2, 2, 0.5);
   border: 1px solid #fff;
}

.house-body-bottom-num.selected {
   background-color: rgba(134, 2, 2, 0.8);
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
}
</style>
