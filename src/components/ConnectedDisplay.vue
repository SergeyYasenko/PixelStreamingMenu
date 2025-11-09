<template>
   <div class="connected-display">
      <div class="hous-wrapper">
         <div class="house-body">
            <CorpSelector
               :corps="corps"
               :selectedCorp="selectedCorp"
               @selectCorp="selectCorp"
            />
            <FloorSelector
               :floors="floors"
               :selectedCorp="selectedCorp"
               :selectedFloor="selectedFloor"
               :showFloors="showFloors"
               @selectFloor="selectFloor"
               @hideFloors="hideFloors"
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
         <WeatherTimeSelector
            v-show="showWeatherTime"
            :is-collapsed="menusCollapsed.weather"
            @close="hideWeatherTimeSelector"
            @sendToEngine="handleSendToEngine"
            @toggleCollapse="toggleMenuCollapse('weather')"
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
</template>

<script setup>
import { ref, computed, watch } from "vue";
import CorpSelector from "./CorpSelector.vue";
import FloorSelector from "./FloorSelector.vue";
import BottomMenu from "./BottomMenu.vue";
import DisplayPositioning from "./DisplayPositioning.vue";
import ApartmentSelector from "./ApartmentSelector.vue";
import WeatherTimeSelector from "./WeatherTimeSelector.vue";
import DataBlocksSelector from "./DataBlocksSelector.vue";
import ApartmentCard from "./ApartmentCard.vue";

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
const selectedCorp = ref(null);
const selectedFloor = ref(13);
const showFloors = ref(false);

// Состояния для нижнего меню
const showApartmentSelector = ref(false);
const showWeatherTime = ref(false);
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
});

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
   { id: 1, name: "The Royal Yacht Hotel", floorsCount: 16 },
   { id: 2, name: "MAGNOLIA HOTEL APARTMENTS", floorsCount: 22 },
   { id: 3, name: "CORALIS", floorsCount: 16 },
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

// Методы для верхнего левого меню
const selectCorp = (corpId) => {
   selectedCorp.value = corpId;
   selectedFloor.value = null;
   // showFloors.value = true; // ЗАКОММЕНТИРОВАНО: не показываем этажи

   // Закрываем другие компоненты над нижним меню
   showWeatherTime.value = false;
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
   showFloors.value = false;
};

// Методы для нижнего меню
const handleApartmentCorpSelect = (corpId) => {
   // Закрываем другие компоненты над нижним меню
   showWeatherTime.value = false;
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
   showFloors.value = false;
   hideApartmentSelector();
   showWeatherTime.value = false;
   showDataBlocks.value = false;

   // Закрываем карточку квартиры
   handleCloseApartmentCard();

   // Сбрасываем значения на дефолтные независимо
   // Верхний CorpSelector
   selectedCorp.value = null;
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
   showFloors.value = false;
   hideApartmentSelector();
   showDataBlocks.value = false;
   // Закрываем карточку квартиры
   handleCloseApartmentCard();
   // Открываем компонент погоды и времени
   showWeatherTime.value = true;
};

const hideWeatherTimeSelector = () => {
   showWeatherTime.value = false;
   // НЕ сбрасываем menusCollapsed.value.weather - сохраняем состояние
};

const hideApartmentSelector = () => {
   showApartmentSelector.value = false;
   // НЕ сбрасываем menusCollapsed.value.apartment - сохраняем состояние
};

const showDataBlocksSelector = (type) => {
   // Закрываем другие компоненты над нижним меню
   showFloors.value = false;
   hideApartmentSelector();
   showWeatherTime.value = false;
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
   showFloors.value = false;
   hideApartmentSelector();
   showWeatherTime.value = false;
   showDataBlocks.value = false;
   // Закрываем карточку квартиры
   handleCloseApartmentCard();
};

const showApartmentsSelector = () => {
   // Закрываем другие компоненты над нижним меню
   showFloors.value = false;
   showWeatherTime.value = false;
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

// Обработчик клика на крестик
const handleExitCross = () => {
   showExitCross.value = false;
   emit("sendToEngine", { exit: "" });
};
</script>

<style scoped>
.connected-display {
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   pointer-events: none;
   z-index: 10; /* КРИТИЧНО: UI должен быть поверх video (z-index: 0) */
}

.hous-wrapper {
   position: relative;
   width: 100%;
   height: 100%;
}

.house-body {
   min-width: 180px;
   max-width: 250px;
   width: 100%;
   position: absolute;
   top: 0;
   left: 0;
   z-index: 5;
   pointer-events: auto;
   @media (max-width: 1549px) {
      display: flex;
      gap: 15px;
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
</style>
