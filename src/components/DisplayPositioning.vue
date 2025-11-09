<template>
   <div
      class="display-positioning"
      :class="{
         'menu-open': isMenuOpen,
         'has-open-menus': hasOpenMenus,
         'has-collapsed-menus': hasCollapsedMenus,
      }"
   >
      <div class="display-positioning-wrapper">
         <div class="display-positioning-btn" @click="toggleMenu">
            <img
               class="display-positioning-btn-img"
               src="../assets/icons/bottomMenu/camera.png"
               alt="camera"
            />
         </div>
         <div
            class="display-positioning-btn-items"
            :class="{ open: isMenuOpen }"
         >
            <div
               class="display-positioning-btn-item"
               v-for="item in menuItems"
               :key="item.id"
               :class="{ centered: !item.icon }"
               @click="handleItemClick(item.name)"
            >
               <img
                  v-if="item.icon"
                  :src="item.icon"
                  :alt="item.name"
                  class="display-positioning-btn-item-icon"
               />
               <span class="display-positioning-btn-item-text">{{
                  item.name
               }}</span>
            </div>
         </div>
      </div>

      <!-- Стрелки навигации для 1st person и drone -->
      <div v-if="showArrows" class="navigation-arrows">
         <div class="arrow arrow-left" @click="handleArrowClick('left')">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
               <path
                  d="M6 2L3 5L6 8"
                  stroke="currentColor"
                  stroke-width="1"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
               />
            </svg>
         </div>
         <div class="arrow arrow-right" @click="handleArrowClick('right')">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
               <path
                  d="M4 2L7 5L4 8"
                  stroke="currentColor"
                  stroke-width="1"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
               />
            </svg>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
   hasOpenMenus: {
      type: Boolean,
      default: false,
   },
   hasCollapsedMenus: {
      type: Boolean,
      default: false,
   },
});

const emit = defineEmits(["sendToEngine"]);

// Реактивные данные
const isMenuOpen = ref(false);
const showArrows = ref(false);

// Данные элементов меню
const menuItems = ref([
   {
      id: 1,
      name: "presentation",
      icon: "src/assets/icons/displayPositioning/presentation.png",
   },
   {
      id: 2,
      name: "drone",
      icon: "src/assets/icons/displayPositioning/drone.png",
   },
   {
      id: 3,
      name: "1st person",
      icon: "src/assets/icons/displayPositioning/person.png",
   },
   {
      id: 4,
      name: "Car Camera",
      icon: "src/assets/icons/displayPositioning/car.png",
   },
   {
      id: 5,
      name: "Rotation",
      icon: null,
   },
   {
      id: 6,
      name: "Shake",
      icon: "src/assets/icons/displayPositioning/shake.png",
   },
]);

// Методы
const toggleMenu = () => {
   isMenuOpen.value = !isMenuOpen.value;
};

const handleItemClick = (itemName) => {
   // Маппинг названий кнопок на команды для Unreal Engine
   const commandMap = {
      presentation: "presentation",
      "1st person": "fpc",
      drone: "drone",
      "Car Camera": "car",
      Rotation: "rotation",
      Shake: "shake",
   };

   const command = commandMap[itemName];
   if (command) {
      emit("sendToEngine", { [command]: "" });
   }

   if (itemName === "1st person" || itemName === "drone") {
      showArrows.value = true;
      isMenuOpen.value = false;
   } else {
      // При клике на другие элементы убираем стрелки
      showArrows.value = false;
      isMenuOpen.value = false;
   }
};

const handleArrowClick = (direction) => {
   if (direction === "left") {
      emit("sendToEngine", { prevtarget: "" });
   } else if (direction === "right") {
      emit("sendToEngine", { nexttarget: "" });
   }
};
</script>

<style scoped>
.display-positioning {
   position: absolute;
   top: 40px;
   right: 0;
   z-index: 15;
   pointer-events: auto;
   transition: z-index 0s;

   @media (max-width: 1549px) {
      top: 75px;
      z-index: 15;
   }
}

.display-positioning.has-open-menus {
   z-index: 10;
   transition: z-index 0s;

   @media (max-width: 1549px) {
      z-index: 10;
   }
}

.display-positioning.has-collapsed-menus:not(.has-open-menus) {
   z-index: 150;
   transition: z-index 0s 0.4s;

   @media (max-width: 1549px) {
      z-index: 150;
   }
}

.display-positioning.menu-open {
   z-index: 10001;
   transition: z-index 0s;

   @media (max-width: 1549px) {
      z-index: 10001;
   }
}

.display-positioning-wrapper {
   display: flex;
   align-items: flex-start;
   flex-direction: row-reverse;
}

.display-positioning-btn {
   cursor: pointer;
   width: 36px;
   height: 36px;
   transition: transform 0.3s ease;
   user-select: none;
}

.display-positioning-btn:hover {
   transform: scale(1.1);
}

.display-positioning-btn-img {
   width: 36px;
   height: 36px;
   padding: 10px;
   background-color: rgba(0, 0, 0, 0.3);
   border-radius: 4px;
   user-select: none;
   pointer-events: none;
}

.display-positioning-btn-items {
   min-width: 100%;
   position: absolute;
   top: 90px;
   right: 0;
   display: flex;
   gap: 8px;
   margin-right: 10px;
   overflow: hidden;
   opacity: 0;
   transform: translateX(100%);
   transition: all 0.4s ease;

   @media (max-width: 1549px) {
      top: -200%;
      margin-right: 0;
   }
}

.display-positioning-btn-items.open {
   opacity: 1;
   transform: translateX(0);
}

.display-positioning-btn-item {
   min-width: 90px;
   min-height: 60px;
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: 8px;
   background-color: rgba(34, 34, 34, 0.9);
   border: 1px solid rgba(255, 255, 255, 0.2);
   border-radius: 6px;
   cursor: pointer;
   transition: all 0.3s ease;
   white-space: nowrap;
   user-select: none;
}

.display-positioning-btn-item:hover {
   opacity: 0.8;
}

.display-positioning-btn-item.centered {
   justify-content: center;
}

.display-positioning-btn-item-icon {
   width: 40px;
   height: 40px;
   filter: brightness(0) invert(1);
   user-select: none;
   pointer-events: none;
}

.display-positioning-btn-item-text {
   width: 100%;
   text-align: center;
   color: #fff;
   font-size: 0.75rem;
   letter-spacing: 1px;
   background-color: rgba(0, 0, 0);
   padding: 0 5px;
   user-select: none;
}

/* Навигационные стрелки */
.navigation-arrows {
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   display: flex;
   justify-content: space-between;
   align-items: center;
   pointer-events: none;
   z-index: 1000;
}

.arrow {
   width: 10px;
   height: 10px;
   cursor: pointer;
   pointer-events: auto;
   color: #fff;
   transition: opacity 0.3s ease;
   user-select: none;
}

.arrow:hover {
   opacity: 0.7;
}

.arrow-left {
   margin-left: 20px;
}

.arrow-right {
   margin-right: 20px;
}
</style>
