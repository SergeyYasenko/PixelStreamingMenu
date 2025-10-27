<template>
   <div class="bottom-menu">
      <div class="bottom-menu-content">
         <div
            class="bottom-menu-item"
            v-for="item in menuItems"
            :key="item.id"
            :style="{ alignItems: item.alignItems }"
         >
            <img
               :src="item.icon"
               :alt="item.name"
               :style="{ width: item.width, height: item.height }"
               class="bottom-menu-icon"
            />
            <span class="bottom-menu-text">{{ item.name }}</span>
         </div>
      </div>
      <div class="bottom-menu-company">GOODINI</div>
   </div>
</template>

<script setup>
import { ref } from "vue";

// Данные для нижнего меню
const menuItems = ref([
   {
      id: 1,
      icon: "src/assets/icons/bottomMenu/home.png",
   },
   {
      id: 2,
      name: "Скрыть",
      icon: "src/assets/icons/bottomMenu/hide.png",
   },
   {
      id: 3,
      name: "Погода и время",
      icon: "src/assets/icons/bottomMenu/weather-and-time.png",
   },
   {
      id: 4,
      name: "Сезон",
      icon: "src/assets/icons/bottomMenu/season.png",
   },
   {
      id: 5,
      name: "Внутренний двор",
      icon: "src/assets/icons/bottomMenu/inner-court.png",
   },
   {
      id: 6,
      name: "Инфраструктура",
      icon: "src/assets/icons/bottomMenu/infrastructure.png",
   },
   {
      id: 7,
      name: "Квартиры",
      icon: "src/assets/icons/bottomMenu/season.png",
   },
   {
      id: 8,
      name: "Курсор",
      icon: "src/assets/icons/bottomMenu/cursor.png",
      width: "44px",
      height: "44px",
   },
   {
      id: 9,
      name: "Next mode",
      icon: "src/assets/icons/bottomMenu/cursor.png",
      width: "44px",
      height: "44px",
   },
   {
      id: 10,
      name: "Holo mode",
      icon: "src/assets/icons/bottomMenu/cursor.png",
      width: "44px",
      height: "44px",
   },
]);
</script>

<style scoped>
.bottom-menu {
   position: fixed;
   bottom: 0;
   left: 0;
   width: 100%;
   background-color: rgba(34, 34, 34, 0.9);
   border-top: 1px solid #fff;
   display: flex;
   justify-content: space-between;
   align-items: center;
   z-index: 10;
   pointer-events: auto;
}

.bottom-menu-content {
   display: flex;
   align-items: center;
   justify-content: space-around;
   width: 100%;
   max-width: 1400px;
   overflow-x: auto;
   padding: 0 20px;
}

.bottom-menu-item {
   display: flex;
   height: 45px;
   align-items: center;
   cursor: pointer;
   padding: 0 15px;
   transition: all 0.3s ease;
   border-right: 1px solid rgba(255, 255, 255, 0.3);
}

.bottom-menu-item:last-child {
   border-right: none;
}

.bottom-menu-item:hover {
   background-color: rgba(255, 255, 255, 0.3);
   transform: translateY(-2px);
}

.bottom-menu-icon {
   width: 26px;
   height: 26px;
   filter: brightness(0) invert(1);
   margin-right: 5px;
}

.bottom-menu-text {
   font-size: 12px;
   color: #fff;
   text-align: center;
   letter-spacing: 1px;
   text-wrap: nowrap;
}

.bottom-menu-company {
   font-size: 18px;
   color: #fff;
   text-align: center;
   letter-spacing: 1px;
   text-wrap: nowrap;
   font-family: "Roboto", sans-serif;
   letter-spacing: 10px;
   margin-right: 40px;
}
</style>
