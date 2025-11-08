<template>
   <div class="grid-selector">
      <div class="grid-selector-title">{{ title }}</div>
      <div class="grid-selector-wrapper">
         <div
            class="grid-selector-row"
            v-for="(row, rowIndex) in gridRows"
            :key="rowIndex"
         >
            <div
               class="grid-selector-item"
               :class="{
                  selected: isSelected(item.value),
               }"
               v-for="item in row"
               :key="item.value"
               @click="handleSelect(item.value)"
            >
               {{ item.label }}
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
      required: true,
   },
   items: {
      type: Array,
      required: true,
   },
   selectedValue: {
      type: [String, Number, Array],
      default: null,
   },
   columns: {
      type: Number,
      default: 2,
   },
   multiple: {
      type: Boolean,
      default: false,
   },
});

const emit = defineEmits(["update:selectedValue", "select", "itemClick"]);

const gridRows = computed(() => {
   const rows = [];
   for (let i = 0; i < props.items.length; i += props.columns) {
      rows.push(props.items.slice(i, i + props.columns));
   }
   return rows;
});

const isSelected = (value) => {
   if (props.multiple) {
      if (!Array.isArray(props.selectedValue)) return false;
      return props.selectedValue.includes(value);
   } else {
      return props.selectedValue === value;
   }
};

const handleSelect = (value) => {
   // Emit для клика на отдельный элемент
   emit("itemClick", value);

   if (props.multiple) {
      const currentValues = Array.isArray(props.selectedValue)
         ? [...props.selectedValue]
         : [];
      const index = currentValues.indexOf(value);

      if (index > -1) {
         // Удаляем из выбранных
         currentValues.splice(index, 1);
      } else {
         // Добавляем к выбранным
         currentValues.push(value);
      }

      emit("update:selectedValue", currentValues);
      emit("select", currentValues);
   } else {
      emit("update:selectedValue", value);
      emit("select", value);
   }
};
</script>

<style scoped>
.grid-selector {
   border-radius: 4px;
   min-width: 150px;
   display: flex;
   flex-direction: column;
   align-self: stretch;
}

.grid-selector-title {
   width: 100%;
   background-color: rgba(34, 34, 34, 0.8);
   font-size: 0.875rem;
   color: #fff;
   text-align: center;
   padding-left: 15px;
   letter-spacing: 1px;
   text-transform: uppercase;
   font-weight: 500;
   user-select: none;

   @media (max-width: 1549px) {
      background-color: transparent;
      text-align: left;
   }
}

.grid-selector-wrapper {
   padding: 15px;
   backdrop-filter: blur(10px);
   background-color: rgba(34, 34, 34, 0.2);
   display: flex;
   flex-direction: column;
   gap: 8px;
   flex: 1;
   justify-content: center;
   min-height: 0;

   @media (max-width: 1549px) {
      padding: 10px;
      backdrop-filter: none;
      background-color: transparent;
   }
}

.grid-selector-row {
   display: flex;
   gap: 8px;
   justify-content: space-between;
}

.grid-selector-item {
   min-height: 30px;
   flex: 1;
   background-color: rgba(34, 34, 34, 0.8);
   border: 1px solid rgba(255, 255, 255, 0.3);
   border-radius: 4px;
   color: #fff;
   text-align: center;
   cursor: pointer;
   transition: all 0.3s ease;
   display: flex;
   align-items: center;
   justify-content: center;
   padding: 0 30px;
   user-select: none;

   @media (max-width: 1549px) {
      width: 100%;
   }
}

.grid-selector-item:hover {
   background-color: rgba(255, 255, 255, 0.1);
   border-color: #fff;
}

.grid-selector-item.selected {
   background-color: rgba(134, 2, 2, 0.8);
   border-color: #fff;
}

/* На экранах ниже 1550px элементы выстраиваются в 1 ряд */
@media (max-width: 1549px) {
   .grid-selector-wrapper {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 8px;
   }

   .grid-selector-row {
      flex: 1 1 100%;
      display: contents;
   }

   .grid-selector-item {
      flex: 0 1 auto;
   }
}
</style>
