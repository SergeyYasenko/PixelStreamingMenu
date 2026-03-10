<template>
   <!-- Десктопная версия -->
   <div class="bottom-menu bottom-menu-desktop">
      <div class="bottom-menu-content">
         <div
            class="bottom-menu-item"
            :class="{
               disabled: item.disabled,
               active: item.name === 'Holo mode' && isHoloModeActive,
            }"
            v-for="item in desktopMenuItems"
            :key="item.id"
            :style="{ alignItems: item.alignItems }"
            @click="handleItemClick(item)"
         >
            <img
               :src="item.icon"
               :alt="item.name"
               :style="{ width: item.width, height: item.height }"
               :class="['bottom-menu-icon', { 'bottom-menu-icon-reset': item.name === 'Reset' }]"
            />
            <span
               class="bottom-menu-text"
               v-if="item.name && item.showText !== false"
               >{{ item.name }}</span
            >
         </div>
      </div>
      <!-- Кнопка Reset отдельным блоком между левым меню и правыми кнопками -->
      <button class="bottom-menu-small-btn" @click="handleResetClick">
         <img
            src="../assets/icons/bottomMenu/reset.svg"
            alt="Reset"
            class="bottom-menu-icon bottom-menu-icon-reset"
         />
      </button>
      <!-- Правая группа: Demo + HOLO X -->
      <div class="bottom-menu-right-group">
         <button class="bottom-menu-small-btn" @click="handleDemoModeClick">
            <img
               src="../assets/icons/bottomMenu/DemoMode.svg"
               alt="Demo"
               class="bottom-menu-icon"
            />
            <span class="bottom-menu-text">Demo</span>
         </button>
         <div class="bottom-menu-company" @click="handleGoodiniClick">
            HOLO X
            <div
               class="goodini-settings-container"
               v-if="showSettings"
               @click.stop
            >
               <GoodiniSettings
                  @close="hideSettings"
                  @qualitySelected="handleQualitySelected"
                  @sendToEngine="handleGoodiniSendToEngine"
               />
            </div>
         </div>
      </div>
   </div>

   <!-- Мобильная версия -->
   <div class="bottom-menu bottom-menu-mobile">
      <div class="bottom-menu-content-mobile">
         <div
            class="bottom-menu-item"
            :class="{
               disabled: item.disabled,
               active: item.name === 'Holo mode' && isHoloModeActive,
            }"
            v-for="item in mobileMenuItems"
            :key="item.id"
            :style="{ alignItems: item.alignItems }"
            @click="handleItemClick(item)"
         >
            <img
               :src="item.icon"
               :alt="item.name"
               :style="{ width: item.width, height: item.height }"
               :class="['bottom-menu-icon', { 'bottom-menu-icon-reset': item.name === 'Reset' }]"
            />
            <span
               class="bottom-menu-text"
               v-if="item.name && item.showText !== false"
               >{{ item.name }}</span
            >
         </div>
      </div>
      <div class="bottom-menu-bottom-mobile">
         <div class="bottom-menu-item">
            <div
               class="bottom-menu-item-icon"
               @click="handleItemClick({ name: 'Home' })"
            >
               <img
                  src="../assets/icons/bottomMenu/home.png"
                  alt="Home"
                  class="bottom-menu-icon"
               />
            </div>
         </div>
         <div class="bottom-menu-company" @click="handleGoodiniClick">
            HOLO X
            <div
               class="goodini-settings-container"
               v-if="showSettings"
               @click.stop
            >
               <GoodiniSettings
                  @close="hideSettings"
                  @qualitySelected="handleQualitySelected"
                  @sendToEngine="handleGoodiniSendToEngine"
               />
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed } from "vue";
import GoodiniSettings from "./GoodiniSettings.vue";

const emit = defineEmits([
   "hide",
   "showWeatherTime",
   "showDataBlocks",
   "showGoodiniSettings",
   "qualitySelected",
   "sendToEngine",
   "showApartments",
   "toggleHoloMode", // Переключение Holo mode с проверкой инфраструктуры
]);

const showSettings = ref(false);
const isHoloModeActive = ref(false); // Состояние Holo mode

// Данные для нижнего меню - используем computed для динамического disabled
const menuItems = computed(() => [
   {
      id: 1,
      name: "Home",
      icon: "src/assets/icons/bottomMenu/home.png",
      showText: false,
   },
   {
      id: 2,
      name: "Hide",
      icon: "src/assets/icons/bottomMenu/hide.png",
   },
   {
      id: 5,
      name: "Environment",
      icon: "src/assets/icons/bottomMenu/inner-court.png",
   },
   {
      id: 6,
      name: "Infrastructure",
      icon: "src/assets/icons/bottomMenu/infrastructure.png",
   },
   {
      id: 7,
      name: "Album",
      icon: "src/assets/icons/bottomMenu/album.svg",
   },
   {
      id: 8,
      name: "Photo mode",
      icon: "src/assets/icons/bottomMenu/photomode.svg",
   },
   {
      id: 9,
      name: "Reset",
      icon: "src/assets/icons/bottomMenu/reset.svg",
      width: "35px",
      height: "35px",
      showText: false,
   },
   {
      id: 10,
      name: "Demo",
      icon: "src/assets/icons/bottomMenu/DemoMode.svg",
      width: "35px",
      height: "35px",
   },
]);

// Для десктопной версии скрываем Reset и Demo в основной линейке (они остаются только справа у HOLO X)
const desktopMenuItems = computed(() =>
   menuItems.value.filter((item) => item.name !== "Reset" && item.name !== "Demo")
);

// Для мобильной версии исключаем кнопку Home (id: 1), оставляем Reset и Demo с текстом
const mobileMenuItems = computed(() =>
   menuItems.value.filter((item) => item.id !== 1)
);

const handleItemClick = (item) => {
   // Игнорируем клики на неактивных кнопках
   if (item.disabled) {
      return;
   }

   if (item.name === "Home") {
      emit("sendToEngine", { home: "" });
   } else if (item.name === "Hide") {
      emit("hide");
      emit("sendToEngine", { hide: "" });
   } else if (item.name === "Time") {
      emit("showWeatherTime");
   } else if (item.name === "Сезон") {
      emit("sendToEngine", { season: "" });
   } else if (item.name === "Infrastructure") {
      emit("showDataBlocks", "infrastructure");
      emit("sendToEngine", { infrastructure: "" });
   } else if (item.name === "Environment") {
      emit("showDataBlocks", "courtyard");
      emit("sendToEngine", { courtyard: "" });
   } else if (item.name === "Квартиры") {
      emit("showApartments");
      emit("sendToEngine", { rooms: "" });
   } else if (item.name === "Курсор") {
      emit("sendToEngine", { cursor: "" });
   } else if (item.name === "Album") {
      emit("sendToEngine", { album: "" });
   } else if (item.name === "Photo mode") {
      emit("sendToEngine", { PhotoMode: "" });
   }
};

const handleHoloModeClick = () => {
   const wasActive = isHoloModeActive.value;
   isHoloModeActive.value = !isHoloModeActive.value;
   emit("toggleHoloMode", {
      wasActive,
      isNowActive: isHoloModeActive.value,
   });
};

const handleDemoModeClick = () => {
   emit("sendToEngine", { DemoMode: "" });
};

const handleResetClick = () => {
   emit("sendToEngine", { reset: "" });
};

const handleGoodiniClick = () => {
   showSettings.value = !showSettings.value;
   emit("showGoodiniSettings");
};

const hideSettings = () => {
   showSettings.value = false;
};

const handleQualitySelected = (quality) => {
   emit("qualitySelected", quality);
};

const handleGoodiniSendToEngine = (data) => {
   emit("sendToEngine", data);
};
</script>

<style scoped>
.bottom-menu {
   position: relative;
   width: 100%;
   background-color: rgba(34, 34, 34, 0.9);
   z-index: 10;
   pointer-events: auto;
}

/* Десктопная версия */
.bottom-menu-desktop {
   display: flex;
   justify-content: space-between;
   align-items: center;
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
   flex: 1 1 auto;
   height: 50px;
   align-items: center;
   cursor: pointer;
   padding: 0 15px;
   transition: all 0.3s ease;
   border-right: 1px solid rgba(255, 255, 255, 0.3);
   user-select: none;
   @media (max-width: 1549px) {
      height: 40px;
   }
}

.bottom-menu-item:last-child {
   border-right: none;
}

.bottom-menu-item:hover {
   background-color: rgba(255, 255, 255, 0.3);
   transform: translateY(-2px);
}

/* Стили для неактивных кнопок */
.bottom-menu-item.disabled {
   opacity: 0.4;
   cursor: not-allowed;
   pointer-events: none;
}

.bottom-menu-item.disabled:hover {
   background-color: transparent;
   transform: none;
}

.bottom-menu-item.disabled .bottom-menu-icon {
   opacity: 0.5;
}

.bottom-menu-item.disabled .bottom-menu-text {
   opacity: 0.5;
}

.bottom-menu-right-group {
   display: flex;
   align-items: center;
   gap: 12px;
   padding-right: 20px;
}

.bottom-menu-right-group {
   display: flex;
   align-items: center;
   gap: 12px;
   padding-right: 20px;
}

.bottom-menu-icon {
   width: 26px;
   height: 26px;
   filter: brightness(0) invert(1);
   margin-right: 5px;
   user-select: none;
   pointer-events: none;
}

.bottom-menu-icon-reset {
   transform: rotate(45deg);
}

.bottom-menu-small-btn {
   display: flex;
   align-items: center;
   gap: 6px;
   height: 50px;
   padding: 0 15px;
   border-left: 1px solid rgba(255, 255, 255, 0.3);
   border-right: 1px solid rgba(255, 255, 255, 0.3);
   border-top: none;
   border-bottom: none;
   background: transparent;
   cursor: pointer;
}

.bottom-menu-small-btn:hover {
   background-color: rgba(255, 255, 255, 0.3);
}

.bottom-menu-text {
   font-size: 0.75rem;
   color: #fff;
   text-align: center;
   letter-spacing: 1px;
   text-wrap: nowrap;
   user-select: none;
}

.bottom-menu-company {
   position: relative;
   font-size: 1.125rem;
   color: #fff;
   text-align: center;
   letter-spacing: 1px;
   text-wrap: nowrap;
   font-family: "Roboto", sans-serif;
   letter-spacing: 10px;
   margin-right: 40px;
   cursor: pointer;
   transition: opacity 0.3s ease;
   user-select: none;
}

.goodini-settings-container {
   position: absolute;
   top: 0;
   right: 0;
   z-index: 10001;
}

/* Мобильная версия */
.bottom-menu-mobile {
   display: none;
   flex-direction: column;
}

.bottom-menu-content-mobile {
   display: flex;
   flex-wrap: wrap;
   padding: 15px;
   gap: 5px;
}

.bottom-menu-content-mobile .bottom-menu-item {
   border-right: none;
   border: 1px solid rgba(255, 255, 255, 0.3);
   padding: 8px 12px;
   border-radius: 4px;
   flex: 0 1 auto;
}

.bottom-menu-bottom-mobile {
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 10px 20px;
   border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.bottom-menu-bottom-mobile .bottom-menu-item {
   border: none;
   padding: 5px 10px;
}

.bottom-menu-bottom-mobile .bottom-menu-company {
   margin-right: 0;
}


/* Показываем мобильную версию только на экранах < 1550px */
@media (max-width: 1549px) {
   .bottom-menu-desktop {
      display: none;
   }
   .bottom-menu-mobile {
      display: flex;
   }
}

/* Показываем десктопную версию только на экранах >= 1550px */
@media (min-width: 1550px) {
   .bottom-menu-desktop {
      display: flex;
   }
   .bottom-menu-mobile {
      display: none;
   }
}
</style>
