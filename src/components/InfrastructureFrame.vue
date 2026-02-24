<template>
   <div class="infrastructure-frame">
      <div class="infrastructure-frame-inner">
         <div class="inffrastructure-left-wrapper">
            <h2 class="infrastructure-title">Инфраструктура</h2>

            <div class="infrastructure-distance">
               <span class="infrastructure-distance-label">Дистанция ходьбы минут/метров</span>
               <RangeInput
                  v-model="distanceValue"
                  :min="0"
                  :max="1500"
                  :step="50"
                  :display-value="`${distanceValue} / 1500 м`"
                  @update:modelValue="handleDistanceChange"
               />
            </div>
         </div>

         <div class="infrastructure-categories">
            <button
               v-for="cat in pinCategories"
               :key="cat.id"
               type="button"
               class="infrastructure-category-btn"
               :class="{ active: cat.active }"
               :data-category="cat.id"
               @click="toggleCategory(cat)"
            >
               <img v-if="cat.icon" :src="cat.icon" :alt="cat.name" class="infrastructure-category-icon" />
               <span class="infrastructure-category-text">{{ cat.name }}</span>
            </button>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref } from "vue";
import RangeInput from "./RangeInput.vue";

const props = defineProps({
   isCollapsed: {
      type: Boolean,
      default: false,
   },
});

const emit = defineEmits(["close", "sendToEngine", "toggleCollapse"]);

const distanceValue = ref(500);

const pinCategories = ref([
   { id: "sport", name: "Спорт", icon: new URL("../assets/icons/newIcons/School.svg", import.meta.url).href, active: false },
   { id: "cafe", name: "Парки и скверы", icon: new URL("../assets/icons/newIcons/School-1.svg", import.meta.url).href, active: false },
   { id: "transport", name: "Кафе и рестораны", icon: new URL("../assets/icons/newIcons/School-2.svg", import.meta.url).href, active: false },
   { id: "medicine", name: "Торговые центры", icon: new URL("../assets/icons/newIcons/School-3.svg", import.meta.url).href, active: false },
   { id: "parks", name: "Транспорт", icon: new URL("../assets/icons/newIcons/School-4.svg", import.meta.url).href, active: false },
   { id: "shopping", name: "Образование", icon: new URL("../assets/icons/newIcons/School-5.svg", import.meta.url).href, active: false },
   { id: "education", name: "Медицина", icon: new URL("../assets/icons/newIcons/Plus.svg", import.meta.url).href, active: false },
   { id: "kindergarten", name: "Детские сады", icon: new URL("../assets/icons/newIcons/School-6.svg", import.meta.url).href, active: false },
]);

function handleDistanceChange(value) {
   distanceValue.value = value;
   emit("sendToEngine", {
      infrastructureDistance: distanceValue.value,
      distanceMeters: distanceValue.value,
   });
}

function toggleCategory(cat) {
   cat.active = !cat.active;
   emit("sendToEngine", {
      infrastructurePin: cat.id,
      visible: cat.active,
   });
}
</script>

<style scoped>
.infrastructure-frame {
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

.infrastructure-frame-inner {
   min-width: 1106px;
   background: var(--color-background);
   backdrop-filter: var(--backdrop-blur);
   border-radius: 12px;
   padding: 20px;
   border: 1px solid rgba(255, 255, 255, 0.08);
   display: flex;
   flex: 1 1 50%;
   gap: 10px;
   align-items: center;
}

.inffrastructure-left-wrapper {
   min-width: 396px;
}

.infrastructure-title {
   font-weight: 400;
   font-size: 3rem;
   color: #fff;
   margin: 0 0 16px 0;
   letter-spacing: 0.5px;
   border-bottom: 1px solid #fff;
}

.infrastructure-distance {
   margin-bottom: 20px;
   display: flex;
   align-items: center;
   gap: 10px;
}

.infrastructure-distance-label {
   min-width: 146px;
   display: block;
   font-size: 1.125rem;
   font-weight: 300;
   color: rgba(255, 255, 255, 0.85);
   margin-bottom: 8px;
}


.infrastructure-categories {
   display: grid;
   grid-template-columns: 1fr 1fr;
   gap: 10px;
   margin-bottom: 20px;
   width: 100%;
}

.infrastructure-category-btn {
   display: flex;
   align-items: center;
   gap: 10px;
   padding: 12px;
   border-radius: 12px;
   border: none;
   background: rgba(23, 23, 23, 0.75);
   color: #fff;
   font-size: 1.125rem;
   cursor: pointer;
   transition: all 0.3s ease;
   text-align: left;
}

.infrastructure-category-icon {
   width: 24px;
   height: 24px;
}

.infrastructure-category-btn:hover {
   background: rgba(255, 255, 255, 0.12);
}

.infrastructure-category-btn.active {
   background: var(--color-hover);
}

.infrastructure-category-text {
   white-space: nowrap;
}
</style>
