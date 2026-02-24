<template>
   <div class="corp-frame" :class="{ collapsed: isCollapsed }">
      <div class="corp-frame-inner">
         <div class="corp-content">
            <h2 class="corp-title">Корпус</h2>
            <div class="corp-apartments">
               <span class="corp-apartments-label">Квартир доступно</span>
               <span class="corp-apartments-count">{{ availableApartments }}</span>
            </div>
            <div class="corp-right-section">
               <div class="corp-floor-display">
                  <span class="corp-floor-label">Этаж</span>
                  <span class="corp-floor-value">{{ selectedFloor }}</span>
               </div>
               <button class="corp-floor-plan-btn" @click="handleFloorPlanClick">
                  <img :src="gridIcon" alt="Grid" class="corp-floor-plan-icon" />
                  <span class="corp-floor-plan-text">План этажа</span>
               </button>
            </div>
         </div>
         <button class="corp-collapse-btn" :class="{ collapsed: isCollapsed }" @click="toggleCollapse">
            <img :src="arrowIcon" alt="Toggle" class="corp-arrow-icon" />
         </button>
      </div>
   </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
   availableApartments: {
      type: Number,
      default: 0,
   },
   selectedFloor: {
      type: Number,
      default: 1,
   },
   isCollapsed: {
      type: Boolean,
      default: false,
   },
});

const emit = defineEmits(["sendToEngine", "toggleCollapse"]);

const isCollapsed = ref(false);
const gridIcon = new URL("../assets/icons/newIcons/Map.svg", import.meta.url).href;
const arrowIcon = new URL("../assets/icons/newIcons/Arrow.svg", import.meta.url).href;

const handleFloorPlanClick = () => {
   emit("sendToEngine", { floorPlan: "" });
};

const toggleCollapse = () => {
   isCollapsed.value = !isCollapsed.value;
};
</script>

<style scoped>
.corp-frame {
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

.corp-frame-inner {
   min-width: 772px;
   background: var(--color-background);
   backdrop-filter: var(--backdrop-blur);
   border-radius: 12px;
   padding: 20px;
   border: 1px solid rgba(255, 255, 255, 0.08);
   display: flex;
   align-items: center;
   gap: 20px;
   transition: all 0.4s ease-in-out;
}

.corp-frame.collapsed .corp-frame-inner {
   min-width: 0;
   width: auto;
   padding: 20px;
   gap: 0;
   justify-content: center;
}

.corp-content {
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
}

.corp-frame.collapsed .corp-content {
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

.corp-title {
   font-weight: 400;
   font-size: 3rem;
   flex: 1 1 auto;
   color: #fff;
   margin: 0;
   letter-spacing: 0.5px;
   white-space: nowrap;
   flex-shrink: 0;
}

.corp-apartments {
   display: flex;
   flex-direction: column;
   max-width: fit-content;
   gap: 8px;
   flex: 1;
}

.corp-apartments-label {
   font-size: 1rem;
   font-weight: 300;
   color: rgba(255, 255, 255, 0.85);
}

.corp-apartments-count {
   font-size: 2rem;
   font-weight: 400;
   color: #fff;
}

.corp-right-section {
   display: flex;
   flex-direction: column;
   gap: 8px;
   flex-shrink: 0;
}

.corp-floor-display {
   display: flex;
   align-items: center;
   justify-content: space-between;
   padding: 12px 16px;
   border-radius: 12px;
   background: rgba(23, 23, 23, 0.75);
   min-width: 120px;
   gap: 12px;
}

.corp-floor-label {
   font-size: 1rem;
   font-weight: 300;
   color: rgba(255, 255, 255, 0.85);
}

.corp-floor-value {
   font-size: 1.125rem;
   font-weight: 400;
   color: #fff;
}

.corp-floor-plan-btn {
   display: flex;
   align-items: center;
   gap: 10px;
   padding: 12px 16px;
   border-radius: 12px;
   border: none;
   background: rgba(23, 23, 23, 0.75);
   color: #fff;
   font-size: 1.125rem;
   font-weight: 300;
   cursor: pointer;
   transition: all 0.3s ease;
   text-align: left;
   min-width: 120px;
}

.corp-floor-plan-btn:hover {
   background: rgba(255, 255, 255, 0.12);
}

.corp-floor-plan-icon {
   width: 24px;
   height: 24px;
   flex-shrink: 0;
}

.corp-floor-plan-text {
   white-space: nowrap;
}

.corp-collapse-btn {
   background: transparent;
   border: none;
   width: 40px;
   height: 40px;
   cursor: pointer;
   flex-shrink: 0;
   display: flex;
   align-items: center;
   justify-content: center;
   user-select: none;
   padding: 0;
}

.corp-arrow-icon {
   width: 24px;
   height: 24px;
   transition: transform 0.3s ease-in-out;
   transform: rotate(-90deg);
}

.corp-collapse-btn.collapsed .corp-arrow-icon {
   transform: rotate(90deg);
}
</style>
