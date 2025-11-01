<template>
   <div class="goodini-settings-popup">
      <button class="close-btn" @click.stop="handleClose">✕</button>
      <div class="settings-list">
         <div class="setting-item">
            <label class="checkbox-label" @click.stop>
               <input
                  type="checkbox"
                  v-model="settings.invertYaw"
                  class="checkbox-input"
               />
               <span class="checkbox-custom"></span>
               <span class="setting-text">INVERT YAW</span>
            </label>
         </div>
         <div class="setting-item">
            <label class="checkbox-label" @click.stop>
               <input
                  type="checkbox"
                  v-model="settings.invertPitch"
                  class="checkbox-input"
               />
               <span class="checkbox-custom"></span>
               <span class="setting-text">INVERT PITCH</span>
            </label>
         </div>
         <div class="setting-item">
            <button
               class="setting-button"
               @click.stop="handleQualityClick('high')"
            >
               HIGH QUALITY
            </button>
         </div>
         <div class="setting-item">
            <button
               class="setting-button"
               @click.stop="handleQualityClick('balance')"
            >
               BALANCE
            </button>
         </div>
         <div class="setting-item">
            <button
               class="setting-button"
               @click.stop="handleQualityClick('performance')"
            >
               PERFORMANCE
            </button>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(["close", "qualitySelected", "sendToEngine"]);

const settings = ref({
   invertYaw: true,
   invertPitch: false,
});

const handleClose = () => {
   emit("close");
};

const handleQualityClick = (quality) => {
   const qualityMap = {
      high: "highsettings",
      balance: "mediumsettings",
      performance: "lowsettings",
   };
   const key = qualityMap[quality];
   if (key) {
      emit("sendToEngine", { [key]: "" });
   }
};

// Watch for checkbox changes
watch(
   () => settings.value.invertYaw,
   (newValue) => {
      emit("sendToEngine", { invertyaw: newValue ? "1" : "0" });
   }
);

watch(
   () => settings.value.invertPitch,
   (newValue) => {
      emit("sendToEngine", { invertpitch: newValue ? "1" : "0" });
   }
);
</script>

<style scoped>
.goodini-settings-popup {
   position: absolute;
   bottom: 100%;
   right: 0;
   background-color: rgba(25, 25, 25, 0.5);
   backdrop-filter: blur(10px);
   border-radius: 4px;
   padding: 25px 25px 0;
   min-width: 200px;
   margin-bottom: 14px;
   pointer-events: auto;
}

.close-btn {
   position: absolute;
   top: 15px;
   right: 15px;
   background: none;
   border: none;
   color: #fff;
   font-size: 1.125rem;
   cursor: pointer;
   width: 10px;
   height: 10px;
   display: flex;
   align-items: center;
   justify-content: center;
   transition: opacity 0.2s ease;
   padding: 0;
   line-height: 1;
   user-select: none;
}

.close-btn:hover {
   opacity: 0.7;
}

.settings-list {
   display: flex;
   flex-direction: column;
   gap: 5px;
   margin-top: 5px;
}

.setting-item {
   display: flex;
   align-items: center;
}

.checkbox-label {
   display: flex;
   align-items: center;
   cursor: pointer;
   width: 100%;
   user-select: none;
}

.checkbox-input {
   position: absolute;
   opacity: 0;
   width: 0;
   height: 0;
}

.checkbox-custom {
   width: 18px;
   height: 18px;
   border: 2px solid rgba(255, 255, 255, 0.4);
   background-color: rgba(255, 255, 255, 0.1);
   border-radius: 3px;
   margin-right: 12px;
   position: relative;
   flex-shrink: 0;
   transition: all 0.2s ease;
}

.checkbox-input:checked + .checkbox-custom {
   background-color: rgba(200, 200, 200, 0.9);
   border-color: rgba(200, 200, 200, 0.9);
}

.checkbox-input:checked + .checkbox-custom::after {
   content: "✓";
   position: absolute;
   top: 50%;
   left: 85%;
   transform: translate(-50%, -50%);
   color: #1a1a1a;
   font-size: 0.875rem;
   font-weight: bold;
}

.setting-text {
   color: #fff;
   font-size: 0.875rem;
   font-family: "Roboto", sans-serif;
   letter-spacing: 0.5px;
   text-transform: uppercase;
   user-select: none;
}

.setting-button {
   background: none;
   border: none;
   color: #fff;
   font-size: 0.875rem;
   font-family: "Roboto", sans-serif;
   letter-spacing: 0.5px;
   text-transform: uppercase;
   cursor: pointer;
   width: 100%;
   text-align: left;
   transition: opacity 0.2s ease;
   user-select: none;
}

.setting-button:hover {
   opacity: 0.7;
}
</style>
