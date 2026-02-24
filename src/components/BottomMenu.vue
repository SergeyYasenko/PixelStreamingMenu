<template>
   <!-- Десктопная версия -->
   <div class="bottom-menu bottom-menu-desktop">
      <div class="bottom-menu-content">
         <div
            class="bottom-menu-item"
            :class="{
               disabled: item.disabled,
               active: (item.id === 'holoMode' && isHoloModeActive) || (item.id === 'genplan' && props.screen === 'genplan') || (item.id === 'infrastructure' && props.isInfrastructureActive),
            }"
            v-for="item in leftMenuItems"
            :key="item.id"
            :style="{ alignItems: item.alignItems }"
            @click="handleItemClick(item)"
         >
            <img
               :src="item.icon"
               :alt="item.name"
               :style="{ width: item.width, height: item.height }"
               class="bottom-menu-icon"
               :class="{ 'bottom-menu-icon-no-text': !item.name || item.showText === false }"
            />
            <span
               class="bottom-menu-text"
               v-if="item.name && item.showText !== false"
               >{{ item.name }}</span
            >
         </div>
      </div>
      <!-- Правая часть: на экране Генплан — Ускорить, Текущее, погода/время; иначе HOLO X -->
      <div v-if="props.screen === 'genplan'" class="bottom-menu-right">
         <div
            class="bottom-menu-item"
            v-for="item in rightMenuItems"
            :key="item.id"
            @click="handleItemClick(item)"
         >
            <img
               :src="item.icon"
               :alt="item.name"
               :style="{ width: item.width || '26px', height: item.height || '26px' }"
               class="bottom-menu-icon"
               :class="{ 'bottom-menu-icon-no-text': !item.name || item.showText === false }"
            />
            <span v-if="item.name && item.showText !== false" class="bottom-menu-text">{{ item.name }}</span>
         </div>
         <button type="button" class="bottom-menu-weather-btn" @click="handleWeatherTimeClick('day')" aria-label="День">
            <img src="@/assets/icons/newIcons/Sun.svg" alt="" class="bottom-menu-weather-icon" />
         </button>
         <button type="button" class="bottom-menu-weather-btn" @click="handleWeatherTimeClick('night')" aria-label="Ночь">
            <img src="@/assets/icons/newIcons/Moon.svg" alt="" class="bottom-menu-weather-icon" />
         </button>
         <div class="bottom-menu-time-wrap" @click="toggleTimePicker">
            <img src="@/assets/icons/newIcons/Sun.svg" alt="" class="bottom-menu-time-icon" />
            <span class="bottom-menu-time">{{ currentTime }}</span>
            <TimePicker
               :show="showTimePicker"
               v-model="selectedTimeMinutes"
               @change="handleTimePickerChange"
            />
         </div>
      </div>
      <div v-else class="bottom-menu-company" @click="handleGoodiniClick">
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

   <!-- Мобильная версия -->
   <div class="bottom-menu bottom-menu-mobile">
      <div class="bottom-menu-content-mobile">
         <div
            class="bottom-menu-item"
            :class="{
               disabled: item.disabled,
               active: (item.id === 'holoMode' && isHoloModeActive) || (item.id === 'genplan' && props.screen === 'genplan') || (item.id === 'infrastructure' && props.isInfrastructureActive),
            }"
            v-for="item in mobileLeftMenuItems"
            :key="item.id"
            :style="{ alignItems: item.alignItems }"
            @click="handleItemClick(item)"
         >
            <img
               :src="item.icon"
               :alt="item.name"
               :style="{ width: item.width, height: item.height }"
               class="bottom-menu-icon"
               :class="{ 'bottom-menu-icon-no-text': !item.name || item.showText === false }"
            />
            <span
               class="bottom-menu-text"
               v-if="item.name && item.showText !== false"
               >{{ item.name }}</span
            >
         </div>
      </div>
      <div class="bottom-menu-bottom-mobile">
         <div v-if="homeItem" class="bottom-menu-item">
            <div
               class="bottom-menu-item-icon"
               @click="handleItemClick(homeItem)"
            >
               <img
                  :src="homeItem.icon"
                  :alt="homeItem.name"
                  class="bottom-menu-icon bottom-menu-icon-no-text"
               />
            </div>
         </div>
         <div v-if="props.screen === 'genplan'" class="bottom-menu-right bottom-menu-right-mobile">
            <div
               class="bottom-menu-item"
               v-for="item in rightMenuItems"
               :key="item.id"
               @click="handleItemClick(item)"
            >
               <img
                  :src="item.icon"
                  :alt="item.name"
                  :style="{ width: item.width || '26px', height: item.height || '26px' }"
                  class="bottom-menu-icon"
                  :class="{ 'bottom-menu-icon-no-text': !item.name || item.showText === false }"
               />
               <span v-if="item.name && item.showText !== false" class="bottom-menu-text">{{ item.name }}</span>
            </div>
            <button type="button" class="bottom-menu-weather-btn" @click="handleWeatherTimeClick('day')" aria-label="День">
               <img src="@/assets/icons/newIcons/Sun.svg" alt="" class="bottom-menu-weather-icon" />
            </button>
            <button type="button" class="bottom-menu-weather-btn" @click="handleWeatherTimeClick('night')" aria-label="Ночь">
               <img src="@/assets/icons/newIcons/Moon.svg" alt="" class="bottom-menu-weather-icon" />
            </button>
            <div class="bottom-menu-time-wrap" @click="toggleTimePicker">
               <img src="@/assets/icons/newIcons/Sun.svg" alt="" class="bottom-menu-time-icon" />
               <span class="bottom-menu-time">{{ currentTime }}</span>
               <TimePicker
                  :show="showTimePicker"
                  v-model="selectedTimeMinutes"
                  @change="handleTimePickerChange"
               />
            </div>
         </div>
         <div v-else class="bottom-menu-company" @click="handleGoodiniClick">
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
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import GoodiniSettings from "./GoodiniSettings.vue";
import TimePicker from "./TimePicker.vue";
import { getMenuItemsForScreen } from "@/config/bottomMenuConfig.js";

const props = defineProps({
   /** id экрана для переключения набора кнопок (например 'main', 'avatar') */
   screen: {
      type: String,
      default: "main",
   },
   /** Активна ли вкладка Инфраструктура */
   isInfrastructureActive: {
      type: Boolean,
      default: false,
   },
});

const emit = defineEmits([
   "hide",
   "switchScreen",
   "showDataBlocks",
   "showGoodiniSettings",
   "qualitySelected",
   "sendToEngine",
   "toggleHoloMode",
   "timeOfDay",
   "showWelcome",
]);

const showSettings = ref(false);
const isHoloModeActive = ref(false);

// Кнопки из конфига для текущего экрана
const menuItems = computed(() => getMenuItemsForScreen(props.screen));

// Левая часть: кнопки без rightSide (Ускорить, Текущее — в правой части)
const leftMenuItems = computed(() =>
   menuItems.value.filter((item) => !item.rightSide)
);

// Правая часть на экране Генплан: Ускорить, Текущее
const rightMenuItems = computed(() =>
   menuItems.value.filter((item) => item.rightSide === true)
);

// Мобильная версия: левые кнопки без Home (Home вынесен отдельно)
const mobileLeftMenuItems = computed(() =>
   leftMenuItems.value.filter((item) => item.id !== "home")
);

const homeItem = computed(() => leftMenuItems.value.find((i) => i.id === "home"));

// Текущее время для блока погода/время
const currentTime = ref("");
function updateTime() {
   const now = new Date();
   currentTime.value = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}
let timeIntervalId = null;
function handleDocumentClick(e) {
   if (showTimePicker.value) {
      const wrap = document.querySelector(".bottom-menu-time-wrap");
      if (wrap && !wrap.contains(e.target)) {
         showTimePicker.value = false;
      }
   }
}

onMounted(() => {
   updateTime();
   timeIntervalId = setInterval(updateTime, 1000);
   document.addEventListener("click", handleDocumentClick);
});
onBeforeUnmount(() => {
   if (timeIntervalId) clearInterval(timeIntervalId);
   document.removeEventListener("click", handleDocumentClick);
});

/** Выполнить действия по клику из конфига */
function runItemActions(item) {
   if (!item.actions) return;
   for (const action of item.actions) {
      if (action.type === "sendToEngine") {
         emit("sendToEngine", action.payload);
      } else if (action.type === "emit") {
         emit(action.event, action.payload);
      }
   }
}

const handleItemClick = (item) => {
   if (!item || item.disabled) return;

   if (item.special === "toggleHoloMode") {
      const wasActive = isHoloModeActive.value;
      isHoloModeActive.value = !isHoloModeActive.value;
      emit("toggleHoloMode", {
         wasActive,
         isNowActive: isHoloModeActive.value,
      });
      return;
   }

   runItemActions(item);
};

const handleGoodiniClick = () => {
   showSettings.value = !showSettings.value;
   emit("showGoodiniSettings");
};

/** Клик по иконке солнца (день) или луны (ночь) */
function handleWeatherTimeClick(mode) {
   emit("timeOfDay", mode);
   emit("sendToEngine", { timeOfDay: mode });
}

const showTimePicker = ref(false);
const selectedTimeMinutes = ref(540);

function toggleTimePicker() {
   showTimePicker.value = !showTimePicker.value;
}

function handleTimePickerChange(minutes) {
   const hours = Math.floor(minutes / 60);
   const mins = minutes % 60;
   const timeStr = `${hours}:${String(mins).padStart(2, "0")}`;
   emit("sendToEngine", { time: timeStr });
}

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
   width: 100%;
   overflow-x: auto;
}

.bottom-menu-item {
   display: flex;
   align-items: center;
   cursor: pointer;
   padding: 12px;
   transition: all 0.3s ease;
   background-color: var(--color-background);
   backdrop-filter: var(--backdrop-blur);
   border-radius: 12px;
   user-select: none;
   margin-right: 12px;
   transition: all 0.3s ease;
   @media (max-width: 1549px) {
      height: 40px;
   }
   &:last-child {
      margin-right: 0;
   }
   &:hover {
      background-color: var(--color-hover);
   }
   &.active {
      background-color: var(--color-hover);
   }
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

.bottom-menu-icon {
   width: 26px;
   height: 26px;
   filter: brightness(0) invert(1);
   margin-right: 12px;
   user-select: none;
   pointer-events: none;
}

.bottom-menu-icon-no-text {
   margin-right: 0;
}

.bottom-menu-text {
   font-size: 1.125rem;
   /* font-weight: 300; */
   color: #fff;
   text-align: center;
   letter-spacing: 1px;
   text-wrap: nowrap;
   user-select: none;
}

.bottom-menu-right {
   display: flex;
   align-items: center;
   gap: 12px;
   flex-shrink: 0;
}

.bottom-menu-right .bottom-menu-item {
   margin-right: 0;
}

.bottom-menu-weather-btn {
   display: flex;
   align-items: center;
   justify-content: center;
   width: 44px;
   height: 44px;
   padding: 0;
   border: none;
   border-radius: 12px;
   background-color: var(--color-background);
   backdrop-filter: var(--backdrop-blur);
   cursor: pointer;
   transition: background-color 0.3s ease;
}

.bottom-menu-weather-btn:hover {
   background-color: var(--color-hover);
}

.bottom-menu-weather-icon {
   width: 22px;
   height: 22px;
   filter: brightness(0) invert(1);
   opacity: 0.9;
   pointer-events: none;
}

.bottom-menu-time-wrap {
   position: relative;
   display: flex;
   align-items: center;
   gap: 8px;
   padding: 8px 12px;
   background-color: var(--color-background);
   backdrop-filter: var(--backdrop-blur);
   border-radius: 12px;
   font-size: 1.125rem;
   color: #fff;
   font-family: "Jost", sans-serif;
   cursor: pointer;
   transition: background-color 0.3s ease;
}

.bottom-menu-time-wrap:hover {
   background-color: var(--color-hover);
}

.bottom-menu-time-icon {
   width: 22px;
   height: 22px;
   filter: brightness(0) invert(1);
   opacity: 0.9;
   flex-shrink: 0;
}

.bottom-menu-time {
   /* font-weight: 300; */
   letter-spacing: 1px;
   user-select: none;
}

.bottom-menu-right-mobile {
   flex-wrap: wrap;
   gap: 8px;
}

.bottom-menu-company {
   position: relative;
   font-size: 1.125rem;
   /* font-weight: 300; */
   color: #fff;
   text-align: center;
   letter-spacing: 10px;
   text-wrap: nowrap;
   font-family: "Jost", sans-serif;
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
