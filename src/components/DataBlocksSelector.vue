<template>
   <div class="data-blocks-selector">
      <div class="data-blocks-header">
         <div class="data-blocks-title">{{ currentData.title }}</div>
         <div class="data-blocks-gradient-line"></div>
      </div>
      <div class="data-blocks-content">
         <div
            v-for="block in currentData.blocks"
            :key="block.id"
            class="data-block"
         >
            <div class="data-block-header">
               <div class="data-block-title">{{ block.title }}</div>
               <div class="data-block-icon">☐</div>
            </div>
            <div class="data-block-items">
               <div
                  v-for="item in block.items"
                  :key="item.id"
                  class="data-block-item"
               >
                  {{ item.name }}
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
   selectedType: {
      type: String,
      default: "infrastructure",
   },
   externalData: {
      type: Array,
      default: () => [],
   },
});

// Данные для разных типов блоков
const dataTypes = {
   infrastructure: {
      title: "3D ЭКСПЛИКАЦИЯ",
      blocks: [
         {
            id: 1,
            title: "Building entrances",
            items: [
               { id: 1, name: "Спорт" },
               { id: 2, name: "Игровая" },
               { id: 3, name: "Отдых" },
            ],
         },
         {
            id: 2,
            title: "Public areas",
            items: [
               { id: 1, name: "Корпус 1" },
               { id: 2, name: "Корпус 2" },
               { id: 3, name: "Корпус 3" },
               { id: 4, name: "Корпус 4" },
               { id: 5, name: "Корпус 5" },
            ],
         },
         {
            id: 3,
            title: "Spaces for rent",
            items: [],
         },
         {
            id: 4,
            title: "Parking zones",
            items: [
               { id: 1, name: "ул. Мечникова" },
               { id: 2, name: "ул. Курская" },
               { id: 3, name: "ул. Зоологическая" },
               { id: 4, name: "ул. Пушкина" },
               { id: 5, name: "ул. Ленина" },
            ],
         },
      ],
   },
   courtyard: {
      title: "ВНУТРЕННИЙ ДВОР",
      blocks: [
         {
            id: 1,
            title: "Детские площадки",
            items: [
               { id: 1, name: "Площадка для малышей" },
               { id: 2, name: "Спортивная площадка" },
               { id: 3, name: "Игровая зона" },
            ],
         },
         {
            id: 2,
            title: "Зоны отдыха",
            items: [
               { id: 1, name: "Беседки" },
               { id: 2, name: "Скамейки" },
               { id: 3, name: "Зеленые зоны" },
            ],
         },
         {
            id: 3,
            title: "Спортивные объекты",
            items: [
               { id: 1, name: "Тренажеры" },
               { id: 2, name: "Футбольное поле" },
               { id: 3, name: "Баскетбольная площадка" },
            ],
         },
         {
            id: 4,
            title: "Парковка",
            items: [
               { id: 1, name: "Гостевые места" },
               { id: 2, name: "Места для инвалидов" },
               { id: 3, name: "Электромобили" },
            ],
         },
      ],
   },
};

// Вычисляемое свойство для получения текущих данных
const currentData = computed(() => {
   // Если есть внешние данные из Unreal Engine, используем их
   if (props.externalData && props.externalData.length > 0) {
      return {
         blocks: props.externalData.map((block, index) => ({
            id: index,
            title: block.list,
            items: block.items.map((item) => ({
               id: item.id,
               name: item.item,
            })),
         })),
      };
   }
   return dataTypes[props.selectedType] || dataTypes.infrastructure;
});

defineEmits(["close"]);
</script>

<style scoped>
.data-blocks-selector {
   position: absolute;
   bottom: 100%;
   left: 30px;
   width: 100%;
   z-index: 10000;
   pointer-events: auto;
   margin-bottom: 5px;
}

.data-blocks-header {
   width: 100%;
   margin-bottom: 20px;
   position: relative;
}

.data-blocks-title {
   font-family: "Roboto", sans-serif;
   font-weight: normal;
   font-size: 2.375rem;
   color: #fff;
   letter-spacing: 2px;
   text-transform: uppercase;
}

.data-blocks-gradient-line {
   width: 100%;
   height: 1px;
   background: linear-gradient(
      to right,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0) 100%
   );
}

.data-blocks-content {
   display: flex;
   flex-wrap: wrap;
   gap: 45px;
}

.data-block {
   width: 250px;
   background-color: rgba(34, 34, 34, 0.5);
   border: 1px solid rgba(255, 255, 255, 0.1);
   border-radius: 6px;
   transition: all 0.3s ease;
}

.data-block-header {
   background-color: rgba(34, 34, 34, 0.8);
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 0 5px 0 10px;
   border-left: 3px solid #fff;
}

.data-block-title {
   font-size: 0.875rem;
   color: #fff;
   font-weight: 500;
   text-transform: uppercase;
   letter-spacing: 1px;
}

.data-block-icon {
   font-size: 0.75rem;
   color: rgba(255, 255, 255, 0.6);
   cursor: pointer;
   transition: color 0.3s ease;
}

.data-block-icon:hover {
   color: rgba(255, 255, 255, 0.9);
}

.data-block-items {
   display: flex;
   flex-direction: column;
   max-height: 80px;
   overflow-y: auto;
   padding: 0 15px;
}

.data-block-item {
   font-size: 0.75rem;
   color: rgba(255, 255, 255, 0.8);
   padding: 3px 0;
   cursor: pointer;
   transition: color 0.3s ease;
   border-radius: 3px;
   padding-left: 5px;
}

.data-block-item:hover {
   background-color: rgba(255, 255, 255, 0.2);
}

/* Стили для скроллбара */
.data-block-items::-webkit-scrollbar {
   width: 4px;
}

.data-block-items::-webkit-scrollbar-track {
   background: rgba(255, 255, 255, 0.1);
   border-radius: 2px;
}

.data-block-items::-webkit-scrollbar-thumb {
   background: rgba(255, 255, 255, 0.3);
   border-radius: 2px;
}

.data-block-items::-webkit-scrollbar-thumb:hover {
   background: rgba(255, 255, 255, 0.5);
}
</style>
