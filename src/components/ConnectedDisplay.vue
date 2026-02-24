<template>
   <div class="connected-display">
      <!-- Основной интерфейс (скрыт в режиме видео аватара) -->
      <Transition name="interface-fade">
      <div v-show="!showAvatarVideoMode" key="main" class="connected-display-main">
      <div class="connected-display-main-inner">
      <div class="hous-wrapper">
         <div class="house-body">
            <div class="house-body-wrapper">
               <div class="left-logo">
                  <img
                     class="left-logo-img"
                     src="@/assets/icons/logo.svg"
                     alt="Logo"
                  />
               </div>
            </div>
         </div>
      </div>

      <!-- Модальное окно AI Avatar -->
      <AIAvatarModal
         :is-visible="showAIAvatarModal"
         @close="handleAIAvatarModalClose"
         @select="handleAIAvatarSelect"
      />

      <!-- Фрейм "Добро пожаловать" -->
      <WelcomeFrame
         v-if="showWelcomeFrame"
         @close="handleCloseWelcomeFrame"
         @continue="handleWelcomeContinue"
         @sendToEngine="handleSendToEngine"
      />

      <!-- Крестик для выхода -->
      <div v-if="showExitCross" class="exit-cross" @click="handleExitCross">
         <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
         >
            <line
               x1="10"
               y1="10"
               x2="30"
               y2="30"
               stroke="white"
               stroke-width="3"
               stroke-linecap="round"
            />
            <line
               x1="30"
               y1="10"
               x2="10"
               y2="30"
               stroke="white"
               stroke-width="3"
               stroke-linecap="round"
            />
         </svg>
      </div>

      <!-- Мобильные элементы управления -->
      <MobileControls @sendToEngine="handleSendToEngine" />

      <div class="bottom-menu-wrapper">
         <BottomMenu
            :screen="currentScreen"
            :is-infrastructure-active="showDataBlocks && dataBlocksType === 'infrastructure'"
            @hide="hideAllMenus"
            @switchScreen="currentScreen = $event"
            @showDataBlocks="showDataBlocksSelector"
            @showGoodiniSettings="showGoodiniSettingsSelector"
            @qualitySelected="handleQualitySelected"
            @sendToEngine="handleSendToEngine"
            @toggleHoloMode="handleToggleHoloMode"
            @showWelcome="showWelcomeFrameSelector"
         />
         <InfrastructureFrame
            v-if="showDataBlocks && dataBlocksType === 'infrastructure'"
            :is-collapsed="menusCollapsed.datablocks"
            @close="hideDataBlocksSelector"
            @sendToEngine="handleSendToEngine"
            @toggleCollapse="toggleMenuCollapse('datablocks')"
         />
         <CorpFrame
            v-if="showCorpFrame"
            :available-apartments="availableApartments"
            :selected-floor="selectedFloor"
            :is-collapsed="menusCollapsed.corpFrame"
            @sendToEngine="handleSendToEngine"
            @toggleCollapse="toggleMenuCollapse('corpFrame')"
         />
         <ApartmentFrame
            v-if="showApartmentFrame"
            :apartment-data="apartmentFrameData"
            :is-collapsed="menusCollapsed.apartmentFrame"
            @sendToEngine="handleSendToEngine"
            @toggleCollapse="toggleMenuCollapse('apartmentFrame')"
            @reserve="handleApartmentReserve"
            @favorite="handleApartmentFavorite"
            @details="handleApartmentDetails"
         />
      </div>
      </div>
      </div>
      </Transition>

      <!-- Минимальный интерфейс для режима видео аватара -->
      <Transition name="interface-fade">
      <div
         v-show="showAvatarVideoMode"
         key="avatar"
         class="avatar-video-overlay"
         @mouseenter="handleVideoOverlayEnter"
         @mousemove="handleVideoOverlayMove"
         @mouseleave="handleVideoOverlayLeave"
      >
         <!-- Play/Stop overlay — триггер на весь экран, иконка 80x80 по центру -->
         <div
            class="avatar-video-play-overlay"
            :class="{ visible: showVideoPlayOverlay }"
            @click="handleVideoPlayStopClick"
         >
            <div class="avatar-video-play-icon">
               <svg v-if="!isVideoPlaying" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
               </svg>
               <svg v-else viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
               </svg>
            </div>
         </div>
         <div class="avatar-video-close" @click="handleAvatarVideoClose" aria-label="Закрыть">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
               <line x1="10" y1="10" x2="30" y2="30" stroke="white" stroke-width="3" stroke-linecap="round" />
               <line x1="30" y1="10" x2="10" y2="30" stroke="white" stroke-width="3" stroke-linecap="round" />
            </svg>
         </div>
         <div class="avatar-video-buttons-left">
            <button class="avatar-video-btn" @click="handleAvatarVideoBtn('yacht')">The Royal Yacht</button>
            <button class="avatar-video-btn" @click="handleAvatarVideoBtn('magnolia')">MAGNOLIA HOTEL APARTMENTS</button>
            <button class="avatar-video-btn" @click="handleAvatarVideoBtn('coralis')">CORALIS</button>
         </div>
         <div class="avatar-video-buttons-right">
            <button class="avatar-video-btn" @click="handleAvatarVideoBtn('holox')">HOLO X</button>
         </div>
      </div>
      </Transition>
   </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import BottomMenu from "./BottomMenu.vue";
import InfrastructureFrame from "./InfrastructureFrame.vue";
import MobileControls from "./MobileControls.vue";
import AIAvatarModal from "./AIAvatarModal.vue";
import CorpFrame from "./CorpFrame.vue";
import ApartmentFrame from "./ApartmentFrame.vue";
import WelcomeFrame from "./WelcomeFrame.vue";

const props = defineProps({
   lastMessage: {
      type: String,
      default: "",
   },
   receivedMessages: {
      type: Array,
      default: () => [],
   },
});

const emit = defineEmits([
   "disconnect",
   "sendData",
   "clearMessages",
   "sendToEngine",
]);

// Показ крестика для выхода
const showExitCross = ref(false);

// Модальное окно AI Avatar
const showAIAvatarModal = ref(false);

// Режим видео аватара (скрыт весь интерфейс, только кнопки)
const showAvatarVideoMode = ref(false);
const selectedAvatarName = ref(null);

// Play/Stop overlay — показ по наведению, скрытие через 2 сек после ухода
const showVideoPlayOverlay = ref(false);
const isVideoPlaying = ref(true); // true = играет, false = пауза
let videoOverlayHideTimeout = null;

// Обработка данных из Unreal Engine
watch(
   () => props.lastMessage,
   (newMessage) => {
      if (!newMessage) return;

      // Проверяем на простое сообщение "first"
      if (newMessage === "first") {
         showExitCross.value = true;
         return;
      }

      try {
         const data = JSON.parse(newMessage);

         // Проверка данных квартиры для фрейма
         if (
            data.ApartmentId !== undefined ||
            data.apartmentId !== undefined ||
            (data.Surface !== undefined && data.Price !== undefined && !data.Img)
         ) {
            apartmentFrameData.value = data;
            showApartmentFrame.value = true;
            showCorpFrame.value = false;
            return;
         }


         if (data.showCorpFrame !== undefined || data.corpFrame !== undefined) {
            showCorpFrame.value = true;
            showApartmentFrame.value = false;
            if (data.availableApartments !== undefined) {
               availableApartments.value = data.availableApartments;
            }
            return;
         }

         if (data.hideCorpFrame !== undefined) {
            showCorpFrame.value = false;
            return;
         }

         if (data.availableApartments !== undefined && showCorpFrame.value) {
            availableApartments.value = data.availableApartments;
         }

         if (data.showApartmentFrame !== undefined || data.apartmentFrame !== undefined) {
            showApartmentFrame.value = true;
            showCorpFrame.value = false;
            if (data.apartmentData) {
               apartmentFrameData.value = data.apartmentData;
            }
            return;
         }

         if (data.hideApartmentFrame !== undefined) {
            showApartmentFrame.value = false;
            return;
         }

         // Проверяем команду для показа фрейма "Добро пожаловать"
         if (data.showWelcomeFrame !== undefined || data.welcomeFrame !== undefined) {
            showWelcomeFrame.value = true;
            // Закрываем другие фреймы при открытии WelcomeFrame
            showApartmentFrame.value = false;
            showCorpFrame.value = false;
            showDataBlocks.value = false;
            return;
         }

         // Проверяем команду для скрытия фрейма "Добро пожаловать"
         if (data.hideWelcomeFrame !== undefined) {
            showWelcomeFrame.value = false;
            return;
         }

      } catch (error) {
         // Игнорируем ошибки парсинга
      }
   }
);

// Состояния для верхнего левого меню
const selectedCorp = ref(1);
const selectedFloor = ref(13);
const showCorpFrame = ref(false);
const showApartmentFrame = ref(false);
const availableApartments = ref(0);
const apartmentFrameData = ref({
   ApartmentId: "1",
   Corp: "1",
   Floor: "1",
   Finishing: "Whitebox",
   Bedroom: "1",
   Surface: "45.3",
   Price: "19263940",
   Availability: "AVAILABLE",
});

// Состояния для нижнего меню
const currentScreen = ref("main"); // 'main' | 'genplan'
const showDataBlocks = ref(false);
const dataBlocksType = ref("infrastructure");

// Состояние для фрейма "Добро пожаловать"
const showWelcomeFrame = ref(false);

// Состояния сворачивания меню для управления z-index камеры
const menusCollapsed = ref({
   datablocks: false,
   leftMenu: false,
   corpFrame: false,
   apartmentFrame: false,
   welcomeFrame: false,
});

// Проверка открытых и развернутых меню для управления z-index камеры
const hasOpenExpandedMenus = computed(() => {
   const datablocksOpen =
      showDataBlocks.value && !menusCollapsed.value.datablocks;
   return datablocksOpen;
});

// Есть ли хотя бы одно свернутое меню (для поднятия z-index камеры)
const hasCollapsedMenus = computed(() => {
   const datablocksCollapsed =
      showDataBlocks.value && menusCollapsed.value.datablocks;
   return datablocksCollapsed;
});

// Обработчик сворачивания меню (сохраняем состояние)
const handleMenuCollapsed = (menuName, isCollapsed) => {
   menusCollapsed.value[menuName] = isCollapsed;
};

// Методы для управления состоянием сворачивания
const toggleMenuCollapse = (menuName) => {
   menusCollapsed.value[menuName] = !menusCollapsed.value[menuName];
   handleMenuCollapsed(menuName, menusCollapsed.value[menuName]);
};

const corps = ref([
   { id: 1, name: "The Royal Yacht", floorsCount: 6 },
   { id: 2, name: "MAGNOLIA HOTEL", floorsCount: 6 },
   { id: 3, name: "CORALIS RESIDENCES", floorsCount: 6 },
]);

const floors = computed(() => {
   const selectedCorpData = corps.value.find(
      (corp) => corp.id === selectedCorp.value
   );
   if (!selectedCorpData) return [];

   const floorsArray = [];
   for (let i = 2; i <= selectedCorpData.floorsCount; i++) {
      floorsArray.push({ id: i, num: i.toString() });
   }
   return floorsArray;
});

const selectedCorpName = computed(() => {
   const selectedCorpData = corps.value.find(
      (corp) => corp.id === selectedCorp.value
   );
   return selectedCorpData ? selectedCorpData.name : "";
});

// Методы для верхнего левого меню
const selectCorp = (corpId) => {
   selectedCorp.value = corpId;
   selectedFloor.value = null;
   showCorpFrame.value = false;
   showApartmentFrame.value = false;
   showDataBlocks.value = false;

   // Скрываем крестик при выборе корпуса
   showExitCross.value = false;

   // Отправляем данные на Unreal Engine
   emit("sendToEngine", { buildings: String(corpId) });
};

const selectFloor = (floorId) => {
   selectedFloor.value = floorId;
   showExitCross.value = false;
   emit("sendToEngine", { floor: String(floorId) });
};

// Метод для скрытия всех меню и сброса значений
const hideAllMenus = () => {
   showDataBlocks.value = false;
   selectedCorp.value = 1;
   selectedFloor.value = 13;
};

const showDataBlocksSelector = (type) => {
   // Если кликнули на уже открытую инфраструктуру - закрываем её (toggle)
   if (type === 'infrastructure' && showDataBlocks.value && dataBlocksType.value === 'infrastructure') {
      hideDataBlocksSelector();
      return;
   }
   
   showExitCross.value = false;
   // Устанавливаем тип данных и открываем компонент
   dataBlocksType.value = type;
   showDataBlocks.value = true;
};

const hideDataBlocksSelector = () => {
   showDataBlocks.value = false;
};

// Обработка переключения Holo mode
const handleToggleHoloMode = ({ wasActive, isNowActive }) => {
   // Проверяем, выключается ли Holo mode И открыто ли окно инфраструктуры
   const infrastructureIsOpen =
      showDataBlocks.value && dataBlocksType.value === "infrastructure";

   if (wasActive && !isNowActive) {
      // Holo mode выключается
      if (infrastructureIsOpen) {
         // Инфраструктура открыта - закрываем и отправляем home + holomode
         hideDataBlocksSelector();
         emit("sendToEngine", { home: "" });
         emit("sendToEngine", { holomode: "" });
      } else {
         // Инфраструктура не открыта - отправляем только holomode
         emit("sendToEngine", { holomode: "" });
      }
   } else {
      // Holo mode включается - отправляем только holomode
      emit("sendToEngine", { holomode: "" });
   }
};

const showGoodiniSettingsSelector = () => {
   showDataBlocks.value = false;
};

// Методы для фрейма "Добро пожаловать"
const showWelcomeFrameSelector = () => {
   // Закрываем все другие фреймы и меню
   showApartmentFrame.value = false;
   showCorpFrame.value = false;
   showDataBlocks.value = false;
   showExitCross.value = false;
   // Открываем WelcomeFrame
   showWelcomeFrame.value = true;
};

const handleCloseWelcomeFrame = () => {
   showWelcomeFrame.value = false;
};

const handleWelcomeContinue = (phoneNumber) => {
   console.log("Welcome continue with phone:", phoneNumber);
   // Закрываем WelcomeFrame
   showWelcomeFrame.value = false;
   // Здесь можно добавить логику для перехода на следующий экран
   // Например, переключение на экран "genplan" или отправка команды в UE
   // emit("sendToEngine", { phoneNumber: phoneNumber });
};

const handleQualitySelected = (quality) => {
   // Позже будем передавать на Unreal Engine через Pixel Streaming
   // Здесь можно добавить отправку данных в Unreal Engine
};

const handleSendToEngine = (data) => {
   // Скрываем крестик для всех команд КРОМЕ hide, weather, holomode и настроек GoodiniSettings
   const commandsToKeepCross = [
      "hide",
      "weather",
      "time",
      "holomode",
      "invertyaw",
      "invertpitch",
      "highsettings",
      "mediumsettings",
      "lowsettings",
   ];
   const hasCommandToKeep = Object.keys(data).some((key) =>
      commandsToKeepCross.includes(key)
   );

   if (!hasCommandToKeep) {
      showExitCross.value = false;
   }

   emit("sendToEngine", data);
};

const handleApartmentReserve = (apartmentData) => {
   console.log("Reserve apartment:", apartmentData);
};

const handleApartmentFavorite = (apartmentData) => {
   console.log("Favorite apartment:", apartmentData);
};

const handleApartmentDetails = (apartmentData) => {
   console.log("Details apartment:", apartmentData);
};

// Клик по кнопке AI Avatar — открыть модалку и отправить "avatar" в UE
const handleAIAvatarButtonClick = () => {
   showAIAvatarModal.value = true;
   emit("sendToEngine", { avatar: "" });
};

// Обработчик выбора аватара в AI Avatar (видео запускается в UE)
const handleAIAvatarSelect = (name) => {
   showAIAvatarModal.value = false;
   showAvatarVideoMode.value = true;
   selectedAvatarName.value = name;
   emit("sendToEngine", { AIAvatar: name });
};

// Закрытие модального окна AI Avatar
const handleAIAvatarModalClose = () => {
   showAIAvatarModal.value = false;
   emit("sendToEngine", { close: "" });
};

// Закрытие режима видео аватара
const handleAvatarVideoClose = () => {
   if (videoOverlayHideTimeout) {
      clearTimeout(videoOverlayHideTimeout);
      videoOverlayHideTimeout = null;
   }
   showAvatarVideoMode.value = false;
   selectedAvatarName.value = null;
   emit("sendToEngine", { close: "" });
};

// Кнопки в режиме видео аватара — отправляем название кнопки в UE
const handleAvatarVideoBtn = (name) => {
   emit("sendToEngine", { AIAvatarBtn: name });
};

// Play/Stop overlay — показ при наведении
const handleVideoOverlayEnter = () => {
   if (videoOverlayHideTimeout) {
      clearTimeout(videoOverlayHideTimeout);
      videoOverlayHideTimeout = null;
   }
   showVideoPlayOverlay.value = true;
   scheduleVideoOverlayHide(3000); // скрыть через 3 сек без движения
};

// Play/Stop overlay — при движении курсора сбрасываем таймер неактивности
const handleVideoOverlayMove = () => {
   if (videoOverlayHideTimeout) {
      clearTimeout(videoOverlayHideTimeout);
      videoOverlayHideTimeout = null;
   }
   showVideoPlayOverlay.value = true;
   scheduleVideoOverlayHide(3000); // скрыть через 3 сек без движения
};

// Play/Stop overlay — скрытие через 2 сек после ухода курсора
const handleVideoOverlayLeave = () => {
   scheduleVideoOverlayHide(2000);
};

const scheduleVideoOverlayHide = (delay) => {
   if (videoOverlayHideTimeout) clearTimeout(videoOverlayHideTimeout);
   videoOverlayHideTimeout = setTimeout(() => {
      showVideoPlayOverlay.value = false;
      videoOverlayHideTimeout = null;
   }, delay);
};

// Клик Play/Stop — отправляем playVideo или stopVideo в UE
const handleVideoPlayStopClick = () => {
   if (isVideoPlaying.value) {
      emit("sendToEngine", { stopVideo: "" });
      isVideoPlaying.value = false;
   } else {
      emit("sendToEngine", { playVideo: "" });
      isVideoPlaying.value = true;
   }
};

// Обработчик клика на крестик
const handleExitCross = () => {
   showExitCross.value = false;
   emit("sendToEngine", { exit: "" });
};

// Очищаем таймеры при размонтировании
onBeforeUnmount(() => {
   if (videoOverlayHideTimeout) {
      clearTimeout(videoOverlayHideTimeout);
   }
});

</script>

<style scoped>
.connected-display {
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   pointer-events: none;
   z-index: 10;
}

.connected-display-main {
   position: absolute;
   inset: 0;
}

.connected-display-main-inner {
   position: absolute;
   top: 12px;
   right: 12px;
   bottom: 12px;
   left: 12px;
}

/* Переход скрытия/появления при клике на персонажа */
.interface-fade-enter-active,
.interface-fade-leave-active {
   transition: opacity 0.3s ease;
}

.interface-fade-enter-from,
.interface-fade-leave-to {
   opacity: 0;
}

.interface-fade-enter-to,
.interface-fade-leave-from {
   opacity: 1;
}

.hous-wrapper {
   position: relative;
   width: 100%;
   height: 100%;
}

.house-body {
   min-width: 180px;
   width: 100%;
   position: absolute;
   top: 0;
   left: 0;
   z-index: 5;
   pointer-events: auto;
   @media (max-width: 1549px) {
      max-width: 250px;
   }
}

.house-body-wrapper {
   display: flex;
   align-items: flex-start;
   gap: 15px;

   @media (max-width: 1549px) {
      flex-direction: column;
   }
}

.left-logo{
   display: flex;
   align-items: center;
   justify-content: center;
}

.left-logo-img {
   max-width: 113px;
   max-height: 119px;
   width: auto;
   height: auto;
   object-fit: contain;
   user-select: none;
   pointer-events: none;
}

/* Left menu wrapper для мобильной версии (не используется) */
.left-menu-wrapper {
   max-width: 250px;
   @media (max-width: 1549px) {
      max-width: none;
      display: flex;
      align-items: flex-start;
      transition: transform 0.4s ease-in-out;
      transform: translateX(0);
   }
}

.left-menu-wrapper.collapsed {
   @media (max-width: 1549px) {
      transform: translateX(
         calc(-100% + 135px)
      ); /* Уезжает влево, оставляя только кнопку сворачивания и AI Avatar */
   }
}

.house-body-buttons-row {
   display: none; /* Скрыты на ПК версии */

   @media (max-width: 1549px) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 10px;
      order: 2;
   }
}

.left-menu-toggle-btn {
   display: none;

   @media (max-width: 1549px) {
      display: block;
      position: sticky;
      top: 0;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: #fff;
      font-size: 1.2rem;
      width: 40px;
      height: 40px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s ease;
      z-index: 50;
      user-select: none;
      flex-shrink: 0;
   }
}

.left-menu-toggle-btn:hover {
   @media (max-width: 1549px) {
      background: rgba(255, 255, 255, 0.3);
   }
}

.left-menu-buttons {
   display: none; /* Скрыты на ПК версии */

   @media (max-width: 1549px) {
      display: flex;
      gap: 10px;
      order: 3; /* Кнопки справа от стрелки сворачивания */
      margin-left: 10px;
   }
}

.left-menu-info-buttons-desktop {
   display: flex;
   gap: 10px;
   padding-top: 10px;

   @media (max-width: 1549px) {
      display: none; /* Скрываем на мобильной версии, там кнопки в другом месте */
   }
}

.left-menu-info-btn {
   display: block;
   background: rgba(255, 255, 255, 0.2);
   border: none;
   color: #fff;
   font-size: 0.75rem;
   padding: 8px 12px;
   border-radius: 4px;
   cursor: pointer;
   transition: background 0.3s ease;
   white-space: nowrap;
   user-select: none;
   font-family: inherit;
   text-transform: uppercase;
}

.left-menu-info-btn:hover {
   background: rgba(255, 255, 255, 0.3);
}

.left-menu-inner {
   @media (max-width: 1549px) {
      display: flex;
      flex-direction: column;
      order: 1; /* Контент слева от кнопки */
   }
}

.bottom-menu-wrapper {
   position: absolute;
   bottom: 0;
   left: 0;
   right: 0;
   pointer-events: auto;
   z-index: 15;
}

.exit-cross {
   position: absolute;
   top: 0;
   right: 0;
   width: 40px;
   height: 40px;
   cursor: pointer;
   pointer-events: auto;
   z-index: 10;
   transition: all 0.3s ease;
   opacity: 0.8;
}

.exit-cross svg {
   filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

/* Режим видео аватара — минимальный интерфейс */
.avatar-video-overlay {
   position: fixed;
   inset: 0;
   pointer-events: auto;
   z-index: 20;
}

.avatar-video-overlay > * {
   pointer-events: auto;
}

/* Play/Stop overlay — на весь экран, иконка 80x80 по центру */
.avatar-video-play-overlay {
   position: fixed;
   inset: 0;
   display: flex;
   align-items: center;
   justify-content: center;
   cursor: pointer;
   opacity: 0;
   transition: opacity 0.3s ease;
   z-index: 1;
}

.avatar-video-play-overlay.visible {
   opacity: 1;
}

.avatar-video-play-icon {
   width: 80px;
   height: 80px;
   display: flex;
   align-items: center;
   justify-content: center;
   background: rgba(0, 0, 0, 0.5);
   border-radius: 50%;
   color: #fff;
}

.avatar-video-play-icon svg {
   width: 40px;
   height: 40px;
}

.avatar-video-close {
   position: fixed;
   top: 38px;
   right: 40px;
   z-index: 10;
   width: 40px;
   height: 40px;
   cursor: pointer;
   opacity: 0.8;
   transition: opacity 0.3s ease;
   @media (max-width: 1549px) {
      top: 20px;
      right: 20px;
   }
}

.avatar-video-close:hover {
   opacity: 1;
}

.avatar-video-close svg {
   filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.avatar-video-buttons-left {
   position: fixed;
   bottom: 20px;
   left: 20px;
   z-index: 10;
   display: flex;
   gap: 10px;
   @media (max-width: 1549px) {
      bottom: 15px;
      left: 15px;
   }
}

.avatar-video-buttons-right {
   position: fixed;
   bottom: 20px;
   right: 20px;
   z-index: 10;
   @media (max-width: 1549px) {
      bottom: 15px;
      right: 15px;
   }
}

.avatar-video-btn {
   background: rgba(255, 255, 255, 0.2);
   border: none;
   color: #fff;
   font-size: 0.875rem;
   padding: 10px 16px;
   border-radius: 4px;
   cursor: pointer;
   transition: background 0.3s ease;
   font-family: inherit;
   letter-spacing: 1px;
}

.avatar-video-btn:hover {
   background: rgba(255, 255, 255, 0.3);
}
</style>
