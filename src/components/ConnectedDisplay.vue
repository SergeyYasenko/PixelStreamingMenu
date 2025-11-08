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
         <DisplayPositioning @sendToEngine="handleSendToEngine" />
      </div>

      <!-- Карточка квартиры -->
      <ApartmentCard
         :apartment-data="apartmentCardData"
         :is-visible="showApartmentCard"
         @close="handleCloseApartmentCard"
         @apartments="handleFirstPersonView"
      />

      <div class="bottom-menu-wrapper">
         <BottomMenu
            @hide="hideAllMenus"
            @showWeatherTime="showWeatherTimeSelector"
            @showDataBlocks="showDataBlocksSelector"
            @showGoodiniSettings="showGoodiniSettingsSelector"
            @qualitySelected="handleQualitySelected"
            @sendToEngine="handleSendToEngine"
            @showApartments="showApartmentsSelector"
         />
         <ApartmentSelector
            v-show="showApartmentSelector"
            :selected-corp="apartmentSelectedCorp"
            :selected-floor="apartmentSelectedFloor"
            :selected-area-min="selectedAreaMin"
            :selected-rooms="selectedRooms"
            :selected-availability="selectedAvailability"
            :corps="corps"
            @update:selectedCorp="handleApartmentCorpSelect"
            @update:selectedFloor="handleApartmentFloorSelect"
            @update:selectedAreaMin="selectedAreaMin = $event"
            @update:selectedRooms="(value) => (selectedRooms = value)"
            @update:selectedAvailability="
               (value) => (selectedAvailability = value)
            "
            @sendToEngine="handleSendToEngine"
         />
         <WeatherTimeSelector
            v-show="showWeatherTime"
            @close="hideWeatherTimeSelector"
            @sendToEngine="handleSendToEngine"
         />
         <DataBlocksSelector
            v-if="showDataBlocks"
            :selected-type="dataBlocksType"
            :external-data="externalDataBlocks"
            @close="hideDataBlocksSelector"
            @sendToEngine="handleSendToEngine"
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

// Обработка данных из Unreal Engine
watch(
   () => props.lastMessage,
   (newMessage) => {
      if (!newMessage) return;

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

const corps = ref([
   { id: 1, name: "The Royal Yacht", floorsCount: 22 },
   { id: 2, name: "meydan", floorsCount: 16 },
   { id: 3, name: "ramada", floorsCount: 16 },
   { id: 4, name: "Dubai Marina", floorsCount: 22 },
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
   showFloors.value = true;

   // Закрываем другие компоненты над нижним меню
   showWeatherTime.value = false;
   showDataBlocks.value = false;

   apartmentSelectedFloor.value = 13;
   showApartmentSelector.value = true;

   // Закрываем карточку квартиры
   handleCloseApartmentCard();

   // Отправляем данные на Unreal Engine
   emit("sendToEngine", { buildings: String(corpId) });
};

const selectFloor = (floorId) => {
   selectedFloor.value = floorId;
   // Закрываем карточку квартиры
   handleCloseApartmentCard();
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
   // НЕ влияем на верхний CorpSelector
};

const handleApartmentFloorSelect = (floorId) => {
   apartmentSelectedFloor.value = floorId;
   // Закрываем карточку квартиры
   handleCloseApartmentCard();
};

// Метод для скрытия всех меню и сброса значений
const hideAllMenus = () => {
   // Скрываем меню
   showFloors.value = false;
   showApartmentSelector.value = false;
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
   showApartmentSelector.value = false;
   showDataBlocks.value = false;
   // Закрываем карточку квартиры
   handleCloseApartmentCard();
   // Открываем компонент погоды и времени
   showWeatherTime.value = true;
};

const hideWeatherTimeSelector = () => {
   showWeatherTime.value = false;
};

const showDataBlocksSelector = (type) => {
   // Закрываем другие компоненты над нижним меню
   showFloors.value = false;
   showApartmentSelector.value = false;
   showWeatherTime.value = false;
   // Закрываем карточку квартиры
   handleCloseApartmentCard();
   // Очищаем старые данные перед открытием нового типа
   externalDataBlocks.value = [];
   // Устанавливаем тип данных и открываем компонент
   dataBlocksType.value = type;
   showDataBlocks.value = true;
};

const hideDataBlocksSelector = () => {
   showDataBlocks.value = false;
   // Очищаем данные при закрытии
   externalDataBlocks.value = [];
};

const showGoodiniSettingsSelector = () => {
   // Закрываем другие компоненты над нижним меню
   showFloors.value = false;
   showApartmentSelector.value = false;
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
   width: 180px;
   position: absolute;
   top: 0;
   left: 0;
   z-index: 5;
   pointer-events: auto;
}

.bottom-menu-wrapper {
   position: fixed;
   bottom: 0;
   left: 0;
   width: 100%;
   pointer-events: auto; /* КРИТИЧНО: Разрешить взаимодействие с меню */
   z-index: 15; /* Выше чем connected-display */
}
</style>
