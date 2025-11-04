<template>
   <transition name="fade">
      <div
         v-if="isVisible"
         class="apartment-card-overlay"
         @click="handleOverlayClick"
      >
         <div class="apartment-card" @click.stop>
            <!-- Кнопка закрытия -->
            <button class="apartment-card-close" @click="handleClose">
               <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     d="M18 6L6 18M6 6L18 18"
                     stroke="white"
                     stroke-width="2"
                     stroke-linecap="round"
                     stroke-linejoin="round"
                  />
               </svg>
            </button>

            <!-- Изображение планировки -->
            <div class="apartment-card-image-container">
               <img
                  v-if="imageUrl"
                  :src="imageUrl"
                  alt="Планировка квартиры"
                  class="apartment-card-image"
               />
               <div v-else class="apartment-card-image-placeholder">
                  <span>Изображение не доступно</span>
               </div>
            </div>

            <!-- Информация о квартире -->
            <div class="apartment-card-info">
               <!-- ID квартиры -->
               <h2 v-if="apartmentData?.ApartmentId" class="apartment-card-id">
                  {{ apartmentData.ApartmentId }}
               </h2>

               <div class="apartment-card-details">
                  <!-- SURFACE -->
                  <div
                     v-if="apartmentData?.Surface"
                     class="apartment-card-detail"
                  >
                     <span class="detail-label">SURFACE</span>
                     <span class="detail-value">{{ formattedSurface }}</span>
                  </div>

                  <!-- PRICE -->
                  <div
                     v-if="apartmentData?.Price"
                     class="apartment-card-detail"
                  >
                     <span class="detail-label">PRICE</span>
                     <span class="detail-value">{{ formattedPrice }}</span>
                  </div>

                  <!-- BEDROOM COUNT -->
                  <div
                     v-if="apartmentData?.Bedroom"
                     class="apartment-card-detail"
                  >
                     <span class="detail-label">BEDROOM COUNT</span>
                     <span class="detail-value">{{
                        apartmentData.Bedroom
                     }}</span>
                  </div>

                  <!-- BATHROOM COUNT -->
                  <div
                     v-if="apartmentData?.Bathroom"
                     class="apartment-card-detail"
                  >
                     <span class="detail-label">BATHROOM COUNT</span>
                     <span class="detail-value">{{
                        apartmentData.Bathroom
                     }}</span>
                  </div>

                  <!-- ORIENTATION -->
                  <div
                     v-if="orientations.length > 0"
                     class="apartment-card-detail"
                  >
                     <span class="detail-label">ORIENTATION</span>
                     <span class="detail-value">{{
                        orientations.join(", ")
                     }}</span>
                  </div>

                  <!-- AVAILABILITY STATUS -->
                  <div v-if="availabilityStatus" class="apartment-card-detail">
                     <span class="detail-label">STATUS</span>
                     <span
                        class="detail-value"
                        :class="getStatusClass(availabilityStatus)"
                     >
                        {{ availabilityStatus }}
                     </span>
                  </div>
               </div>

               <!-- Кнопка First Person View -->
               <div class="first-person-view-btn-container">
                  <button
                     class="first-person-view-btn"
                     @click="handleFirstPersonView"
                  >
                     First Person View
                  </button>
               </div>
            </div>
         </div>
      </div>
   </transition>
</template>

<script setup>
import { computed, watch } from "vue";

// Импорт изображений планировок
import view01 from "../assets/icons/apartmentView/view01.PNG";
import view02 from "../assets/icons/apartmentView/view02.PNG";
import view03 from "../assets/icons/apartmentView/view03.PNG";
import view04 from "../assets/icons/apartmentView/view04.PNG";
import view05 from "../assets/icons/apartmentView/view05.PNG";
import view06 from "../assets/icons/apartmentView/view06.PNG";
import view07 from "../assets/icons/apartmentView/view07.PNG";
import view08 from "../assets/icons/apartmentView/view08.PNG";
import view09 from "../assets/icons/apartmentView/view09.PNG";
import view10 from "../assets/icons/apartmentView/view10.PNG";
import view11 from "../assets/icons/apartmentView/view11.PNG";
import view12 from "../assets/icons/apartmentView/view12.PNG";

// Маппинг ID изображений
const apartmentImages = {
   "01": view01,
   "02": view02,
   "03": view03,
   "04": view04,
   "05": view05,
   "06": view06,
   "07": view07,
   "08": view08,
   "09": view09,
   10: view10,
   11: view11,
   12: view12,
   1: view01,
   2: view02,
   3: view03,
   4: view04,
   5: view05,
   6: view06,
   7: view07,
   8: view08,
   9: view09,
   10: view10,
   11: view11,
   12: view12,
};

const props = defineProps({
   apartmentData: {
      type: Object,
      default: null,
      // Ожидаемая структура из Unreal Engine:
      // {
      //    Img: String,          // Изображение планировки:
      //                          //   - base64: "data:image/png;base64,iVBORw0KG..."
      //                          //   - URL: "http://localhost:8080/apartment01.jpg"
      //                          //   - ID: "01", "02"..."12" (для локальных файлов)
      //    Surface: String,      // "51" - площадь в м²
      //    Price: String,        // "21" - цена в тысячах долларов
      //    Bedroom: String,      // "1" - количество спален
      //    Bathroom: String,     // "1" - количество ванных
      //    Orientation: String,  // "N,S,W,E" - ориентация
      //    Availability: String, // "AVAILABLE,RESERVED,SOLD" - доступность
      //    ApartmentId: String,  // "2105" - ID квартиры (опционально)
      // }
   },
   isVisible: {
      type: Boolean,
      default: false,
   },
   imageBasePath: {
      type: String,
      default: "/apartments/plans/", // Базовый путь к изображениям планировок
   },
});

const emit = defineEmits(["close", "apartments"]);

// Получение URL изображения по ID или напрямую
const imageUrl = computed(() => {
   if (!props.apartmentData?.Img) return "";

   const imgValue = props.apartmentData.Img;

   // Проверяем, это base64 изображение?
   if (imgValue.startsWith("data:image/")) {
      return imgValue;
   }

   // Проверяем, это URL?
   if (imgValue.startsWith("http://") || imgValue.startsWith("https://")) {
      return imgValue;
   }

   // Проверяем, есть ли изображение в локальном маппинге
   if (apartmentImages[imgValue]) {
      return apartmentImages[imgValue];
   }

   // Иначе считаем это ID и формируем путь к файлу
   return `${props.imageBasePath}${imgValue}.jpg`;
});

// Форматирование площади
const formattedSurface = computed(() => {
   if (!props.apartmentData?.Surface) return "";
   return `${props.apartmentData.Surface} m²`;
});

// Форматирование цены
const formattedPrice = computed(() => {
   if (!props.apartmentData?.Price) return "";
   return `$${props.apartmentData.Price}K`;
});

// Парсинг ориентации
const orientations = computed(() => {
   if (!props.apartmentData?.Orientation) return [];
   return props.apartmentData.Orientation.split(",").filter((o) => o.trim());
});

// Определение статуса (берем первый из списка)
const availabilityStatus = computed(() => {
   if (!props.apartmentData?.Availability) return "";
   const statuses = props.apartmentData.Availability.split(",").filter((s) =>
      s.trim()
   );
   return statuses[0] || "";
});

// Получение класса для статуса
const getStatusClass = (status) => {
   const classMap = {
      AVAILABLE: "status-available",
      RESERVED: "status-reserved",
      SOLD: "status-sold",
   };
   return classMap[status] || "";
};

// Закрытие карточки
const handleClose = () => {
   emit("close");
};

// Закрытие по клику на оверлей
const handleOverlayClick = () => {
   emit("close");
};

// Переход в режим первого лица
const handleFirstPersonView = () => {
   console.log(
      "🎯 Клик на кнопку First Person View, данные:",
      props.apartmentData
   );
   emit("apartments", props.apartmentData);
};
</script>

<style scoped>
/* Применяем Fira Sans Condensed ко всей карточке */
.apartment-card-overlay,
.apartment-card,
.apartment-card * {
   font-family: "Fira Sans Condensed", sans-serif;
}

.apartment-card-overlay {
   position: fixed;
   top: 0;
   right: 15px;
   bottom: 0;
   z-index: 10;
   display: flex;
   align-items: center;
   justify-content: center;
   pointer-events: auto;
}

.apartment-card {
   position: relative;
   max-width: 250px;
   width: 100%;
   border-radius: 12px;
   overflow: hidden;
   display: flex;
   flex-direction: column;
   max-height: 90vh;
}

.apartment-card-close {
   position: absolute;
   top: 5px;
   right: 5px;
   width: 20px;
   height: 20px;
   background-color: rgba(0, 0, 0, 0.6);
   backdrop-filter: blur(10px);
   border: 1px solid rgba(255, 255, 255, 0.2);
   border-radius: 50%;
   display: flex;
   align-items: center;
   justify-content: center;
   cursor: pointer;
   transition: all 0.3s ease;
   z-index: 10;
   padding: 0;
}

.apartment-card-close:hover {
   opacity: 0.8;
}

.apartment-card-image-container {
   width: 100%;
   background-color: rgba(0, 0, 0, 0.5);
   display: flex;
   align-items: center;
   justify-content: center;
   overflow: hidden;
}

.apartment-card-image {
   width: 100%;
   height: 100%;
   max-width: 250px;
   max-height: 250px;
   object-fit: contain;
   display: block;
}

.apartment-card-image-placeholder {
   display: flex;
   align-items: center;
   justify-content: center;
   width: 100%;
   height: 300px;
   color: rgba(255, 255, 255, 0.5);
   font-size: 0.75rem;
   user-select: none;
}

.apartment-card-info {
   background-color: rgba(34, 34, 34, 0.5);
   backdrop-filter: blur(5px);
   overflow-y: auto;
   padding-bottom: 15px;
}

.apartment-card-id {
   width: 100%;
   background-color: rgba(0, 0, 0, 0.3);
   font-size: 1.125rem;
   font-weight: bold;
   color: #fff;
   padding-left: 15px;
   margin-bottom: 20px;
   letter-spacing: 1px;
   user-select: none;
   text-align: left;
}

.apartment-card-details {
   max-height: 200px;
   overflow-y: auto;
   padding: 0 15px;
}

.apartment-card-detail {
   display: flex;
   flex-direction: column;
   margin-bottom: 5px;
}

.apartment-card-detail:last-child {
   margin-bottom: 0;
}

.detail-label {
   font-size: 0.75rem;
   color: rgba(255, 255, 255, 0.7);
   font-weight: 500;
   user-select: none;
   text-transform: uppercase;
   letter-spacing: 0.5px;
}

.detail-value {
   font-size: 0.75rem;
   color: #fff;
   font-weight: 500;
}
.first-person-view-btn-container {
   display: flex;
   justify-content: center;
   align-items: center;
   margin: 20px 5px 0 5px;
}

.first-person-view-btn {
   width: 100%;
   padding: 5px 10px;
   color: #fff;
   font-size: 0.75rem;
   font-weight: 600;
   cursor: pointer;
   text-transform: none;
   user-select: none;
   background-color: rgba(0, 0, 0, 0.3);
   border: 1px solid rgba(255, 255, 255, 0.2);
   transition: all 0.3s ease;
}

.first-person-view-btn:hover {
   background-color: rgba(255, 255, 255, 0.1);
   border-color: rgba(255, 255, 255, 0.4);
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.first-person-view-btn:active {
   transform: translateY(0);
}

/* Анимации */
.fade-enter-active,
.fade-leave-active {
   transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
   opacity: 0;
}

.fade-enter-active .apartment-card {
   animation: slideUp 0.3s ease;
}

@keyframes slideUp {
   from {
      transform: translateY(30px);
      opacity: 0;
   }
   to {
      transform: translateY(0);
      opacity: 1;
   }
}
</style>
