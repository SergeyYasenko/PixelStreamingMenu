<template>
   <div class="connected-display">
      <!-- Основной интерфейс (скрыт в режиме видео аватара). v-show чтобы не перемонтировать — иначе WeatherTimeSelector при монтировании отправляет погоду/время -->
      <Transition name="interface-fade">
      <div v-show="!showAvatarVideoMode" key="main" class="connected-display-main">
      <div class="hous-wrapper">
         <div class="house-body">
            <div class="house-body-wrapper">
               <div
                  class="left-menu-wrapper"
                  :class="{ collapsed: menusCollapsed.leftMenu }"
               >
               <div class="house-body-buttons-row">
                  <button
                     class="left-menu-toggle-btn"
                     @click="toggleMenuCollapse('leftMenu')"
                  >
                     {{ menusCollapsed.leftMenu ? "▶" : "◀" }}
                  </button>
               </div>
                  <div class="left-menu-inner">
                     <CorpSelector
                        :corps="corps"
                        :selectedCorp="selectedCorp"
                        @selectCorp="selectCorp"
                     />
                     <FloorSelector
                        :floors="floors"
                        :selectedCorp="selectedCorp"
                        :selectedCorpName="selectedCorpName"
                        :selectedFloor="selectedFloor"
                        :showFloors="showFloors"
                        @selectFloor="selectFloor"
                        @hideFloors="hideFloors"
                     />
                  </div>
               </div>
            </div>
            <WeatherTimeSelector
               v-show="showWeatherTime"
               :is-collapsed="menusCollapsed.weather"
               @close="hideWeatherTimeSelector"
               @sendToEngine="handleSendToEngine"
               @toggleCollapse="toggleMenuCollapse('weather')"
            />
         </div>
         <DisplayPositioning
            :has-open-menus="hasOpenExpandedMenus"
            :has-collapsed-menus="hasCollapsedMenus"
            @sendToEngine="handleSendToEngine"
         />
      </div>

      <!-- Карточка квартиры -->
      <ApartmentCard
         :apartment-data="apartmentCardData"
         :is-visible="showApartmentCard"
         :is-collapsed="menusCollapsed.apartmentCard"
         @close="handleCloseApartmentCard"
         @apartments="handleFirstPersonView"
         @toggleCollapse="toggleMenuCollapse('apartmentCard')"
      />

      <!-- Модальное окно AI Avatar -->
      <AIAvatarModal
         :is-visible="showAIAvatarModal"
         @close="handleAIAvatarModalClose"
         @select="handleAIAvatarSelect"
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

      <!-- Вертикальный range input в правой части -->
      <VerticalRangeInput
         v-model="verticalRangeValue"
         :has-open-menus="hasOpenExpandedMenus"
         :has-collapsed-menus="hasCollapsedMenus"
         @update:modelValue="handleVerticalRangeChange"
      />

      <!-- Мобильные элементы управления -->
      <MobileControls @sendToEngine="handleSendToEngine" />

      <div class="bottom-menu-wrapper">
         <BottomMenu
            @hide="hideAllMenus"
            @showWeatherTime="showWeatherTimeSelector"
            @showDataBlocks="showDataBlocksSelector"
            @showGoodiniSettings="showGoodiniSettingsSelector"
            @qualitySelected="handleQualitySelected"
            @sendToEngine="handleSendToEngine"
            @showApartments="showApartmentsSelector"
            @toggleHoloMode="handleToggleHoloMode"
         />
         <ApartmentSelector
            v-show="showApartmentSelector"
            :selected-corp="apartmentSelectedCorp"
            :selected-floor="apartmentSelectedFloor"
            :selected-area-min="selectedAreaMin"
            :selected-rooms="selectedRooms"
            :selected-availability="selectedAvailability"
            :corps="corps"
            :is-collapsed="menusCollapsed.apartment"
            @update:selectedCorp="handleApartmentCorpSelect"
            @update:selectedFloor="handleApartmentFloorSelect"
            @update:selectedAreaMin="selectedAreaMin = $event"
            @update:selectedRooms="(value) => (selectedRooms = value)"
            @update:selectedAvailability="
               (value) => (selectedAvailability = value)
            "
            @sendToEngine="handleSendToEngine"
            @toggleCollapse="toggleMenuCollapse('apartment')"
         />
         <DataBlocksSelector
            v-if="showDataBlocks"
            :selected-type="dataBlocksType"
            :external-data="externalDataBlocks"
            :is-collapsed="menusCollapsed.datablocks"
            @close="hideDataBlocksSelector"
            @sendToEngine="handleSendToEngine"
            @toggleCollapse="toggleMenuCollapse('datablocks')"
         />
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
import CorpSelector from "./CorpSelector.vue";
import FloorSelector from "./FloorSelector.vue";
import BottomMenu from "./BottomMenu.vue";
import DisplayPositioning from "./DisplayPositioning.vue";
import ApartmentSelector from "./ApartmentSelector.vue";
import WeatherTimeSelector from "./WeatherTimeSelector.vue";
import DataBlocksSelector from "./DataBlocksSelector.vue";
import ApartmentCard from "./ApartmentCard.vue";
import VerticalRangeInput from "./VerticalRangeInput.vue";
import MobileControls from "./MobileControls.vue";
import AIAvatarModal from "./AIAvatarModal.vue";

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

// Данные из Unreal Engine для DataBlocksSelector
const externalDataBlocks = ref([]);

// Данные карточки квартиры
const apartmentCardData = ref(null);
const showApartmentCard = ref(false);

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

         // Проверка данных квартиры
         // Если есть Img и хотя бы одно поле данных (Surface или Price)
         if (
            data.Img !== undefined &&
            (data.Surface !== undefined || data.Price !== undefined)
         ) {
            apartmentCardData.value = data;
            showApartmentCard.value = true;
            return;
         }

         // Проверяем, содержит ли сообщение структуру с list и items
         if (data.list && data.items && Array.isArray(data.items)) {
            externalDataBlocks.value.push({
               list: data.list,
               items: data.items,
            });
         }
      } catch (error) {
         // Игнорируем ошибки парсинга
      }
   }
);

// Состояния для верхнего левого меню
const selectedCorp = ref(1); // Корпус 1 выбран по умолчанию
const selectedFloor = ref(13);
const showFloors = ref(true); // Открыт, так как корпус выбран по умолчанию

// Состояния для нижнего меню
const showApartmentSelector = ref(false);
const showWeatherTime = ref(true); // Открыт по умолчанию
const showDataBlocks = ref(false);
const dataBlocksType = ref("infrastructure");
const apartmentSelectedCorp = ref(null);
const apartmentSelectedFloor = ref(13);
const selectedAreaMin = ref(0);
const selectedRooms = ref([]);
const selectedAvailability = ref([]);

// Состояния сворачивания меню для управления z-index камеры
const menusCollapsed = ref({
   apartment: false,
   weather: false,
   datablocks: false,
   apartmentCard: false,
   leftMenu: false,
});

// Значение вертикального range input (от -1 до 1, по умолчанию 0)
const verticalRangeValue = ref(0);

// Интервал для периодической отправки значения (15 раз в секунду)
let valueIntervalId = null;

// Проверка открытых и развернутых меню для управления z-index камеры
const hasOpenExpandedMenus = computed(() => {
   // Меню открыто И развернуто (не свернуто)
   const apartmentOpen =
      showApartmentSelector.value && !menusCollapsed.value.apartment;
   const weatherOpen = showWeatherTime.value && !menusCollapsed.value.weather;
   const datablocksOpen =
      showDataBlocks.value && !menusCollapsed.value.datablocks;
   const cardOpen =
      showApartmentCard.value && !menusCollapsed.value.apartmentCard;

   return apartmentOpen || weatherOpen || datablocksOpen || cardOpen;
});

// Есть ли хотя бы одно свернутое меню (для поднятия z-index камеры)
const hasCollapsedMenus = computed(() => {
   // Меню открыто И свернуто
   const apartmentCollapsed =
      showApartmentSelector.value && menusCollapsed.value.apartment;
   const weatherCollapsed =
      showWeatherTime.value && menusCollapsed.value.weather;
   const datablocksCollapsed =
      showDataBlocks.value && menusCollapsed.value.datablocks;
   const cardCollapsed =
      showApartmentCard.value && menusCollapsed.value.apartmentCard;

   return (
      apartmentCollapsed ||
      weatherCollapsed ||
      datablocksCollapsed ||
      cardCollapsed
   );
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
   showFloors.value = true;

   // Закрываем другие компоненты над нижним меню
   // showWeatherTime.value = false; // Погода всегда открыта
   showDataBlocks.value = false;

   apartmentSelectedFloor.value = 13;
   // showApartmentSelector.value = true; // ЗАКОММЕНТИРОВАНО: не показываем блок квартиры

   // Закрываем карточку квартиры
   handleCloseApartmentCard();

   // Скрываем крестик при выборе корпуса
   showExitCross.value = false;

   // Отправляем данные на Unreal Engine
   emit("sendToEngine", { buildings: String(corpId) });
};

const selectFloor = (floorId) => {
   selectedFloor.value = floorId;
   // Закрываем карточку квартиры
   handleCloseApartmentCard();
   // Скрываем крестик при выборе этажа
   showExitCross.value = false;
   // Отправляем данные на Unreal Engine
   emit("sendToEngine", { floor: String(floorId) });
};

const hideFloors = () => {
   // showFloors.value = false; // Этажи всегда открыты
};

// Методы для нижнего меню
const handleApartmentCorpSelect = (corpId) => {
   // Закрываем другие компоненты над нижним меню
   // showWeatherTime.value = false; // Погода всегда открыта
   // Выбираем корпус только в ApartmentSelector
   apartmentSelectedCorp.value = corpId;
   apartmentSelectedFloor.value = 13;
   showApartmentSelector.value = true;
   // Закрываем карточку квартиры
   handleCloseApartmentCard();
   // Скрываем крестик при выборе корпуса в квартирах
   showExitCross.value = false;
   // НЕ влияем на верхний CorpSelector
};

const handleApartmentFloorSelect = (floorId) => {
   apartmentSelectedFloor.value = floorId;
   // Закрываем карточку квартиры
   handleCloseApartmentCard();
   // Скрываем крестик при выборе этажа в квартирах
   showExitCross.value = false;
};

// Метод для скрытия всех меню и сброса значений
const hideAllMenus = () => {
   // Скрываем меню
   // showFloors.value = false; // Этажи всегда открыты
   hideApartmentSelector();
   // showWeatherTime.value = false; // Погода всегда открыта
   showDataBlocks.value = false;

   // Закрываем карточку квартиры
   handleCloseApartmentCard();

   // Сбрасываем значения на дефолтные независимо
   // Верхний CorpSelector
   selectedCorp.value = 1; // Корпус 1 по умолчанию
   selectedFloor.value = 13;

   // Нижний ApartmentSelector
   apartmentSelectedCorp.value = null;
   apartmentSelectedFloor.value = 13;
   selectedAreaMin.value = 0;
   selectedRooms.value = [];
   selectedAvailability.value = [];
};

const showWeatherTimeSelector = () => {
   // Закрываем другие компоненты над нижним меню
   // showFloors.value = false; // Этажи всегда открыты
   hideApartmentSelector();
   showDataBlocks.value = false;
   // Закрываем карточку квартиры
   handleCloseApartmentCard();
   // Открываем компонент погоды и времени
   showWeatherTime.value = true;
};

const hideWeatherTimeSelector = () => {
   // showWeatherTime.value = false; // Погода всегда открыта
   // НЕ сбрасываем menusCollapsed.value.weather - сохраняем состояние
};

const hideApartmentSelector = () => {
   showApartmentSelector.value = false;
   // НЕ сбрасываем menusCollapsed.value.apartment - сохраняем состояние
};

const showDataBlocksSelector = (type) => {
   // Закрываем другие компоненты над нижним меню
   // showFloors.value = false; // Этажи всегда открыты
   hideApartmentSelector();
   // showWeatherTime.value = false; // Погода всегда открыта
   // Закрываем карточку квартиры
   handleCloseApartmentCard();
   // Скрываем крестик при открытии data blocks
   showExitCross.value = false;
   // Очищаем старые данные перед открытием нового типа
   externalDataBlocks.value = [];
   // Устанавливаем тип данных и открываем компонент
   dataBlocksType.value = type;
   // showDataBlocks.value = true;
};

const hideDataBlocksSelector = () => {
   showDataBlocks.value = false;
   // Очищаем данные при закрытии
   externalDataBlocks.value = [];
   // НЕ сбрасываем menusCollapsed.value.datablocks - сохраняем состояние
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
   // Закрываем другие компоненты над нижним меню
   // showFloors.value = false; // Этажи всегда открыты
   hideApartmentSelector();
   // showWeatherTime.value = false; // Погода всегда открыта
   showDataBlocks.value = false;
   // Закрываем карточку квартиры
   handleCloseApartmentCard();
};

const showApartmentsSelector = () => {
   // Закрываем другие компоненты над нижним меню
   // showFloors.value = false; // Этажи всегда открыты
   // showWeatherTime.value = false; // Погода всегда открыта
   showDataBlocks.value = false;
   // Закрываем карточку квартиры
   handleCloseApartmentCard();
   // Скрываем крестик при открытии селектора квартир
   showExitCross.value = false;
   // Открываем ApartmentSelector
   showApartmentSelector.value = true;
};

const handleQualitySelected = (quality) => {
   // Позже будем передавать на Unreal Engine через Pixel Streaming
   // Здесь можно добавить отправку данных в Unreal Engine
};

const handleSendToEngine = (data) => {
   // Закрываем карточку квартиры при любом взаимодействии с другими элементами
   // (кроме apartments, так как это обрабатывается отдельно в handleFirstPersonView)
   if (showApartmentCard.value && !data.hasOwnProperty("apartments")) {
      handleCloseApartmentCard();
   }

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

// Обработчики для карточки квартиры
const handleCloseApartmentCard = () => {
   showApartmentCard.value = false;
   setTimeout(() => {
      apartmentCardData.value = null;
   }, 300);
};

const handleFirstPersonView = (data) => {
   console.log("🚀 handleFirstPersonView вызван, данные:", data);
   const payload = { apartments: "" };
   console.log("📤 Отправляем в UE:", payload);
   // Закрываем карточку после перехода в режим первого лица
   handleCloseApartmentCard();
   emit("sendToEngine", payload);
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

// Функция отправки значения на UE (как строка)
const sendVerticalRangeValue = () => {
   emit("sendToEngine", { value: verticalRangeValue.value.toFixed(1) });
};

// Запуск интервала для периодической отправки значения (только если значение != 0)
const startValueInterval = () => {
   // Не запускаем интервал, если значение равно 0
   if (verticalRangeValue.value === 0) {
      return;
   }

   // Очищаем существующий интервал, если есть
   if (valueIntervalId) {
      clearInterval(valueIntervalId);
   }

   // Отправляем значение 15 раз в секунду (каждые ~66.67ms)
   valueIntervalId = setInterval(() => {
      // Проверяем, не стало ли значение 0 - если да, останавливаем интервал
      if (verticalRangeValue.value === 0) {
         stopValueInterval();
         return;
      }
      sendVerticalRangeValue();
   }, 1000 / 15);
};

// Остановка интервала
const stopValueInterval = () => {
   if (valueIntervalId) {
      clearInterval(valueIntervalId);
      valueIntervalId = null;
   }
};

// Обработчик изменения вертикального range input
const handleVerticalRangeChange = (value) => {
   verticalRangeValue.value = value;

   // Если значение равно 0, отправляем один раз и останавливаем интервал
   if (value === 0) {
      stopValueInterval();
      sendVerticalRangeValue(); // Отправляем 0 один раз
   } else {
      // Если значение не равно 0, запускаем/продолжаем интервал
      sendVerticalRangeValue(); // Немедленная отправка при изменении
      startValueInterval(); // Запускаем периодическую отправку
   }
};

// Очищаем интервал и таймеры при размонтировании
onBeforeUnmount(() => {
   stopValueInterval();
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
   width: fit-content;
   max-width: 100%;
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

/* Left menu wrapper для мобильной версии */
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
         calc(-100% + 40px)
      ); /* Уезжает влево, оставляя только кнопку сворачивания */
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

.left-menu-inner {
   @media (max-width: 1549px) {
      display: flex;
      flex-direction: column;
      order: 1; /* Контент слева от кнопки */
   }
}

.bottom-menu-wrapper {
   position: fixed;
   bottom: 0;
   left: 0;
   width: 100%;
   pointer-events: auto; /* КРИТИЧНО: Разрешить взаимодействие с меню */
   z-index: 15; /* Выше чем connected-display */
}

.exit-cross {
   position: fixed;
   top: 38px;
   right: 40px;
   width: 40px;
   height: 40px;
   cursor: pointer;
   pointer-events: auto;
   z-index: 10;
   transition: all 0.3s ease;
   opacity: 0.8;
   @media (max-width: 1549px) {
      top: 73px;
   }
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
