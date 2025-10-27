<template>
   <div class="display-positioning">
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
   </div>
</template>

<script setup>
import { ref } from "vue";

// Реактивные данные
const isMenuOpen = ref(false);

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
</script>

<style scoped>
.display-positioning {
   position: absolute;
   top: 40px;
   right: 0;
   z-index: 15;
   pointer-events: auto;
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
}

.display-positioning-btn-item-text {
   width: 100%;
   text-align: center;
   color: #fff;
   font-size: 12px;
   letter-spacing: 1px;
   background-color: rgba(0, 0, 0);
   padding: 0 5px;
}
</style>
