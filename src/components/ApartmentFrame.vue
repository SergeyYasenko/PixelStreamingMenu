<template>
   <div class="apartment-frame" :class="{ collapsed: isCollapsed }">
      <div class="apartment-frame-inner">
         <div class="apartment-content">
            <h2 class="apartment-title">Квартира {{ apartmentId }}</h2>
            <div class="apartment-details-wrapper">
               <div class="apartment-details">
                  <div class="apartment-details-row">
                     <div class="apartment-detail-item">
                        <span class="detail-label">Корпус</span>
                        <span class="detail-value">{{ corp }}</span>
                     </div>
                     <div class="apartment-detail-item">
                        <span class="detail-label">Отделка</span>
                        <span class="detail-value">{{ finishing }}</span>
                     </div>
                     <div class="apartment-detail-item">
                        <span class="detail-label">Стоимость</span>
                        <span class="detail-value price">{{ formattedPrice }}</span>
                     </div>
                  </div>
                  <div class="apartment-details-row">
                     <div class="apartment-detail-item">
                        <span class="detail-label">Этаж</span>
                        <span class="detail-value">{{ floor }}</span>
                     </div>
                     <div class="apartment-detail-item">
                        <span class="detail-label">Комнатность</span>
                        <span class="detail-value">{{ rooms }}</span>
                     </div>
                     <div class="apartment-detail-item">
                        <span class="detail-label">Статус</span>
                        <span class="detail-value status" :class="statusClass">{{ statusText }}</span>
                     </div>
                  </div>
               </div>
               <div class="apartment-detail-item detail-item-full-height">
                  <span class="detail-label">Площадь</span>
                  <span class="detail-value area">{{ formattedSurface }}</span>
               </div>
            </div>
            <div class="apartment-actions">
               <div class="apartment-actions-row">
                  <button class="apartment-action-btn reserve-btn" @click="handleReserve">
                     <img :src="homeIcon" alt="Home" class="apartment-action-icon" />
                     <span>Забронировать</span>
                  </button>
                  <button class="apartment-action-btn favorite-btn" :class="{ active: isFavorite }" @click="handleFavorite">
                     <svg class="apartment-action-icon heart-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.80577 6.20659C4.7059 5.30673 5.92658 4.80122 7.19936 4.80122C8.47215 4.80122 9.69283 5.30673 10.593 6.20659L11.9994 7.61179L13.4058 6.20659C13.8485 5.74815 14.3782 5.38247 14.9638 5.13091C15.5494 4.87934 16.1793 4.74693 16.8166 4.74139C17.454 4.73585 18.086 4.8573 18.6759 5.09865C19.2658 5.34 19.8018 5.69641 20.2525 6.1471C20.7031 6.59778 21.0596 7.13371 21.3009 7.72361C21.5423 8.31352 21.6637 8.94558 21.6582 9.58292C21.6526 10.2203 21.5202 10.8501 21.2686 11.4357C21.0171 12.0214 20.6514 12.551 20.193 12.9938L11.9994 21.1886L3.80577 12.9938C2.9059 12.0937 2.40039 10.873 2.40039 9.60019C2.40039 8.32741 2.9059 7.10673 3.80577 6.20659V6.20659Z" stroke="white" stroke-linejoin="round"/>
                     </svg>
                  </button>
               </div>
               <div class="apartment-actions-row apartment-actions-row-full">
                  <button class="apartment-action-btn details-btn" @click="handleDetails">
                     <img :src="infoIcon" alt="Info" class="apartment-action-icon" />
                     <span>Подробнее</span>
                  </button>
               </div>
            </div>
         </div>
         <button class="apartment-collapse-btn" :class="{ collapsed: isCollapsed }" @click="toggleCollapse">
            <img :src="arrowIcon" alt="Toggle" class="apartment-arrow-icon" />
         </button>
      </div>
   </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
   apartmentData: {
      type: Object,
      default: () => ({}),
   },
   isCollapsed: {
      type: Boolean,
      default: false,
   },
});

const emit = defineEmits(["sendToEngine", "toggleCollapse", "reserve", "favorite", "details"]);

const isCollapsed = ref(false);
const isFavorite = ref(false);
const arrowIcon = new URL("../assets/icons/newIcons/Arrow.svg", import.meta.url).href;
const homeIcon = new URL("../assets/icons/newIcons/Home.svg", import.meta.url).href;
const heartIcon = new URL("../assets/icons/newIcons/Hearth.svg", import.meta.url).href;
const infoIcon = new URL("../assets/icons/newIcons/Attention.svg", import.meta.url).href;

const apartmentId = computed(() => props.apartmentData?.ApartmentId || props.apartmentData?.apartmentId || "1");
const corp = computed(() => props.apartmentData?.Corp || props.apartmentData?.corp || "1");
const floor = computed(() => props.apartmentData?.Floor || props.apartmentData?.floor || "1");
const finishing = computed(() => props.apartmentData?.Finishing || props.apartmentData?.finishing || "Whitebox");
const rooms = computed(() => props.apartmentData?.Bedroom || props.apartmentData?.rooms || "1");
const surface = computed(() => props.apartmentData?.Surface || props.apartmentData?.surface || "0");
const price = computed(() => props.apartmentData?.Price || props.apartmentData?.price || "0");
const availability = computed(() => props.apartmentData?.Availability || props.apartmentData?.availability || "AVAILABLE");

const formattedSurface = computed(() => {
   const value = parseFloat(surface.value);
   return `${value.toFixed(1)} м²`;
});

const formattedPrice = computed(() => {
   const value = parseFloat(price.value);
   return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
});

const statusText = computed(() => {
   const statusMap = {
      AVAILABLE: "Свободна",
      RESERVED: "Забронирована",
      SOLD: "Продана",
   };
   return statusMap[availability.value] || "Свободна";
});

const statusClass = computed(() => {
   const classMap = {
      AVAILABLE: "status-available",
      RESERVED: "status-reserved",
      SOLD: "status-sold",
   };
   return classMap[availability.value] || "status-available";
});

const toggleCollapse = () => {
   isCollapsed.value = !isCollapsed.value;
};

const handleReserve = () => {
   emit("reserve", props.apartmentData);
   emit("sendToEngine", { reserve: apartmentId.value });
};

const handleFavorite = () => {
   isFavorite.value = !isFavorite.value;
   emit("favorite", props.apartmentData);
   emit("sendToEngine", { favorite: apartmentId.value });
};

const handleDetails = () => {
   emit("details", props.apartmentData);
   emit("sendToEngine", { details: apartmentId.value });
};
</script>

<style scoped>
.apartment-frame {
   position: absolute;
   bottom: 100%;
   left: 0;
   z-index: 10000;
   pointer-events: auto;
   margin-bottom: 8px;

   @media (max-width: 1549px) {
      position: fixed;
      bottom: auto;
      top: 80px;
      left: 12px;
      margin-bottom: 0;
   }
}

.apartment-frame-inner {
   min-width: 1719px;
   background: var(--color-background);
   backdrop-filter: var(--backdrop-blur);
   border-radius: 12px;
   padding: 20px;
   border: 1px solid rgba(255, 255, 255, 0.08);
   display: flex;
   align-items: stretch;
   gap: 20px;
   transition: all 0.4s ease-in-out;
}

.apartment-frame.collapsed .apartment-frame-inner {
   min-width: 0;
   width: auto;
   padding: 20px;
   gap: 0;
   justify-content: center;
}

.apartment-content {
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 20px;
   flex: 1 1 auto;
   overflow: hidden;
   transition: opacity 0.4s ease-in-out, flex 0.4s ease-in-out, width 0.4s ease-in-out, max-width 0.4s ease-in-out, visibility 0.4s ease-in-out, gap 0.4s ease-in-out;
   opacity: 1;
   visibility: visible;
   min-width: 0;
   align-self: stretch;
}

.apartment-frame.collapsed .apartment-content {
   opacity: 0;
   flex: 0 0 0;
   width: 0;
   max-width: 0;
   visibility: hidden;
   overflow: hidden;
   margin: 0;
   padding: 0;
   gap: 0;
   pointer-events: none;
}

.apartment-title {
   font-weight: 400;
   font-size: 3rem;
   color: #fff;
   margin: 0;
   letter-spacing: 0.5px;
   white-space: nowrap;
   flex-shrink: 0;
   flex: 1 1 auto;
}

.apartment-details-wrapper {
   display: flex;
   gap: 8px;
   flex: 1;
   align-self: stretch;
}

.apartment-details {
   display: flex;
   flex-direction: column;
   gap: 12px;
   flex: 1;
}

.apartment-details-row {
   display: flex;
   gap: 8px;
   align-items: stretch;
}

.apartment-detail-item {
   display: flex;
   justify-content: space-between;
   align-items: center;
   gap: 4px;
   padding: 12px 16px;
   border-radius: 12px;
   background: rgba(23, 23, 23, 0.75);
   min-width: fit-content;
   flex-shrink: 0;
   min-width: 240px;
}

.detail-item-full-height {
   flex: 1 1 auto;
   height: 100%;
   min-height: 100%;
}

.detail-label {
   font-size: 1.1255rem;
   margin-left: 10px;
}

.detail-value {
   font-size: 1.125rem;
   font-weight: 400;
   color: #fff;
}

.status-available {
   color: #4ade80;
}

.status-reserved {
   color: #fbbf24;
}

.status-sold {
   color: #ef4444;
}

.apartment-actions {
   display: flex;
   flex-direction: column;
   gap: 8px;
   flex-shrink: 0;
}

.apartment-actions-row {
   display: flex;
   align-items: center;
   gap: 12px;
}

.apartment-actions-row-full {
   width: 100%;
}

.apartment-actions-row-full .apartment-action-btn {
   width: 100%;
   justify-content: center;
}

.apartment-action-btn {
   display: flex;
   align-items: center;
   gap: 8px;
   padding: 12px 17.5px;
   border-radius: 12px;
   border: none;
   background: rgba(23, 23, 23, 0.75);
   color: #fff;
   font-size: 1.125rem;
   font-weight: 300;
   cursor: pointer;
   transition: all 0.3s ease;
   white-space: nowrap;
}

.apartment-action-btn:hover {
   background: rgba(255, 255, 255, 0.12);
}

.apartment-action-btn.favorite-btn {
   padding: 12px;
   min-width: 48px;
   width: 48px;
   justify-content: center;
}

.heart-icon {
   width: 24px;
   height: 24px;
   flex-shrink: 0;
   transition: fill 0.3s ease;
}

.heart-icon path {
   fill: none;
   stroke: white;
   transition: fill 0.3s ease, stroke 0.3s ease;
}

.apartment-action-btn.favorite-btn.active .heart-icon path {
   fill: #ef4444;
   stroke: #ef4444;
}

.apartment-action-icon {
   width: 24px;
   height: 24px;
   flex-shrink: 0;
}

.apartment-collapse-btn {
   background: transparent;
   border: none;
   width: 40px;
   height: auto;
   cursor: pointer;
   flex-shrink: 0;
   display: flex;
   align-items: center;
   justify-content: center;
   user-select: none;
   padding: 0;
}

.apartment-arrow-icon {
   width: 24px;
   height: 24px;
   transition: transform 0.3s ease-in-out;
   transform: rotate(-90deg);
}

.apartment-collapse-btn.collapsed .apartment-arrow-icon {
   transform: rotate(90deg);
}
</style>
