<template>
   <Transition name="timepicker-fade">
      <div v-if="show" class="time-picker" @click.stop>
         <div
            class="tp-track"
            ref="trackRef"
            @mousedown="startDrag"
            @touchstart.prevent="startDrag"
         >
            <template v-for="item in trackItemsDesc" :key="item.minutes">
               <div v-if="item.type === 'label'" class="tp-label">
                  {{ item.label }}
               </div>
               <div
                  v-else
                  class="tp-tick"
                  :class="{ 'tp-tick-wide': item.wide }"
               ></div>
            </template>

            <div
               class="tp-indicator"
               :style="{ bottom: indicatorPercent + '%' }"
            >
               <div class="tp-ind"></div>
               <div class="tp-ind"></div>
            </div>
         </div>
      </div>
   </Transition>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from "vue";

const props = defineProps({
   show: { type: Boolean, default: false },
   modelValue: { type: Number, default: 540 },
});

const emit = defineEmits(["update:modelValue", "change"]);

const MIN_MINUTES = 0;
const MAX_MINUTES = 20 * 60;
const STEP = 20;

const trackRef = ref(null);
const selectedMinutes = ref(props.modelValue);

watch(() => props.modelValue, (v) => { selectedMinutes.value = v; });

const indicatorPercent = computed(() => {
   return ((selectedMinutes.value - MIN_MINUTES) / (MAX_MINUTES - MIN_MINUTES)) * 100;
});

const trackItemsAsc = computed(() => {
   const result = [];
   for (let m = MIN_MINUTES; m <= MAX_MINUTES; m += STEP) {
      const isLabel = m % 120 === 0;
      if (isLabel) {
         const hours = Math.floor(m / 60);
         result.push({
            minutes: m,
            type: "label",
            label: `${hours}:${String(m % 60).padStart(2, "0")}`,
         });
      } else {
         result.push({
            minutes: m,
            type: "tick",
            wide: m % 60 === 0,
         });
      }
   }
   return result;
});

const trackItemsDesc = computed(() => [...trackItemsAsc.value].reverse());

function minutesFromPosition(clientY) {
   const track = trackRef.value;
   if (!track) return selectedMinutes.value;
   const rect = track.getBoundingClientRect();
   const ratio = 1 - (clientY - rect.top) / rect.height;
   const clamped = Math.max(0, Math.min(1, ratio));
   const raw = MIN_MINUTES + clamped * (MAX_MINUTES - MIN_MINUTES);
   return Math.round(raw / STEP) * STEP;
}

function applyTime(clientY) {
   const m = minutesFromPosition(clientY);
   selectedMinutes.value = m;
   emit("update:modelValue", m);
   emit("change", m);
}

let dragging = false;

function startDrag(e) {
   dragging = true;
   const clientY = e.touches ? e.touches[0].clientY : e.clientY;
   applyTime(clientY);
   document.addEventListener("mousemove", onDrag);
   document.addEventListener("mouseup", stopDrag);
   document.addEventListener("touchmove", onDrag, { passive: false });
   document.addEventListener("touchend", stopDrag);
}

function onDrag(e) {
   if (!dragging) return;
   e.preventDefault();
   const clientY = e.touches ? e.touches[0].clientY : e.clientY;
   applyTime(clientY);
}

function stopDrag() {
   dragging = false;
   document.removeEventListener("mousemove", onDrag);
   document.removeEventListener("mouseup", stopDrag);
   document.removeEventListener("touchmove", onDrag);
   document.removeEventListener("touchend", stopDrag);
}

onBeforeUnmount(() => {
   stopDrag();
});
</script>

<style scoped>
.time-picker {
   position: absolute;
   bottom: 100%;
   right: 0;
   margin-bottom: 12px;
   padding: 16px 34px;
   background: rgba(23, 23, 23, 0.75);
   backdrop-filter: blur(16px);
   border-radius: 12px;
   z-index: 100;
   user-select: none;
   max-height: calc(100vh - 120px);
   overflow-y: auto;
   scrollbar-width: thin;
   scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.time-picker::-webkit-scrollbar {
   width: 4px;
}

.time-picker::-webkit-scrollbar-track {
   background: transparent;
}

.time-picker::-webkit-scrollbar-thumb {
   background: rgba(255, 255, 255, 0.2);
   border-radius: 4px;
}

.time-picker::-webkit-scrollbar-thumb:hover {
   background: rgba(255, 255, 255, 0.35);
}

.tp-track {
   position: relative;
   display: flex;
   flex-direction: column;
   gap: 12px;
   cursor: pointer;
   align-items: center;
}

.tp-tick {
   width: 22px;
   height: 1px;
   background: #fff;
   flex-shrink: 0;
}

.tp-tick-wide {
   width: 30px;
}

.tp-label {
   font-size: 0.95rem;
   color: #fff;
   font-family: "Jost", sans-serif;
   letter-spacing: 0.5px;
   line-height: 1;
   flex-shrink: 0;
   text-align: center;
}

.tp-indicator {
   position: absolute;
   left: -10px;
   right: -10px;
   transform: translateY(50%);
   pointer-events: none;
   display: flex;
   justify-content: space-between;
}

.tp-ind {
   width: 7px;
   height: 18px;
   background: var(--color-accent, #3b82f6);
   border-radius: 2px;
}

.timepicker-fade-enter-active,
.timepicker-fade-leave-active {
   transition: opacity 0.2s ease, transform 0.2s ease;
}
.timepicker-fade-enter-from,
.timepicker-fade-leave-to {
   opacity: 0;
   transform: translateY(8px);
}
</style>
