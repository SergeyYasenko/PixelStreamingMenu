<template>
   <div class="weather-time-selector">
      <div
         class="weather-time-wrapper"
         :class="{ collapsed: props.isCollapsed }"
      >
         <button class="collapse-toggle-btn" @click="toggleCollapse">
            {{ props.isCollapsed ? "◀" : "▶" }}
         </button>
         <div class="weather-time-content">
            <div class="section">
               <div class="section-title-wrapper">
                  <div class="section-title-line-left"></div>
                  <div class="section-title">TIME</div>
                  <div class="section-title-line-right"></div>
               </div>
               <div class="time-display">
                  <div class="time-value">{{ currentTime }}</div>
                  <div class="time-controls">
                     <div class="time-arrow left" @click="decreaseTime">
                        <svg
                           width="12"
                           height="12"
                           viewBox="0 0 12 12"
                           fill="currentColor"
                        >
                           <path
                              d="M7.5 3L4.5 6L7.5 9"
                              stroke="currentColor"
                              stroke-width="1.5"
                              fill="none"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                           />
                        </svg>
                     </div>
                     <div class="time-arrow right" @click="increaseTime">
                        <svg
                           width="12"
                           height="12"
                           viewBox="0 0 12 12"
                           fill="currentColor"
                        >
                           <path
                              d="M4.5 3L7.5 6L4.5 9"
                              stroke="currentColor"
                              stroke-width="1.5"
                              fill="none"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                           />
                        </svg>
                     </div>
                  </div>
               </div>
               <div class="time-slider-container">
                  <input
                     type="range"
                     min="0"
                     max="100"
                     :value="timeSliderPosition"
                     @input="handleSliderChange"
                     class="time-slider-input"
                  />
                  <div class="time-slider-track">
                     <div
                        class="time-slider-handle"
                        :style="{ left: timeSliderPosition + '%' }"
                     ></div>
                  </div>
               </div>
            </div>

            <!-- DATE Section -->
            <div class="section">
               <div class="section-title-wrapper">
                  <div class="section-title-line-left"></div>
                  <div class="section-title">DATE</div>
                  <div class="section-title-line-right"></div>
               </div>
               <div class="date-controls">
                  <div class="date-field-container">
                     <div
                        class="date-field"
                        @click="showMonthDropdown = !showMonthDropdown"
                     >
                        {{ currentMonth }}
                        <div class="dropdown-arrow">▼</div>
                     </div>
                     <div v-if="showMonthDropdown" class="dropdown-menu">
                        <div
                           v-for="month in months"
                           :key="month"
                           class="dropdown-item"
                           @click="selectMonth(month)"
                        >
                           {{ month }}
                        </div>
                     </div>
                  </div>
                  <div class="date-field-container">
                     <div
                        class="date-field"
                        @click="showDayDropdown = !showDayDropdown"
                     >
                        {{ currentDay }}
                        <div class="dropdown-arrow">▼</div>
                     </div>
                     <div v-if="showDayDropdown" class="dropdown-menu">
                        <div
                           v-for="day in days"
                           :key="day"
                           class="dropdown-item"
                           @click="selectDay(day)"
                        >
                           {{ day }}
                        </div>
                     </div>
                  </div>
                  <div class="date-field-container">
                     <div
                        class="date-field"
                        @click="showYearDropdown = !showYearDropdown"
                     >
                        {{ currentYear }}
                        <div class="dropdown-arrow">▼</div>
                     </div>
                     <div v-if="showYearDropdown" class="dropdown-menu">
                        <div
                           v-for="year in years"
                           :key="year"
                           class="dropdown-item"
                           @click="selectYear(year)"
                        >
                           {{ year }}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <!-- LOCATION Section -->
            <div class="section">
               <div class="section-title-wrapper">
                  <div class="section-title-line-left"></div>
                  <div class="section-title">LOCATION</div>
                  <div class="section-title-line-right"></div>
               </div>
               <div class="location-controls">
                  <div class="location-field">
                     <span class="field-label">Lat:</span>
                     <div
                        class="draggable-input-container"
                        @mousedown="startDrag('lat', $event)"
                     >
                        <input
                           type="text"
                           v-model="latitude"
                           class="draggable-input"
                           min="-180"
                           max="180"
                           @keydown="handleKeydown('lat', $event)"
                           @blur="validateInput('lat')"
                        />
                     </div>
                  </div>
                  <div class="location-field">
                     <span class="field-label">Long:</span>
                     <div
                        class="draggable-input-container"
                        @mousedown="startDrag('long', $event)"
                     >
                        <input
                           type="text"
                           v-model="longitude"
                           class="draggable-input"
                           min="-180"
                           max="180"
                           @keydown="handleKeydown('long', $event)"
                           @blur="validateInput('long')"
                        />
                     </div>
                  </div>
               </div>
               <div class="globe-icon">
                  <svg
                     width="24"
                     height="24"
                     viewBox="0 0 24 24"
                     fill="currentColor"
                  >
                     <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                     />
                  </svg>
               </div>
               <div class="timezone-field">
                  <span class="field-label">Time Zone:</span>
                  <div
                     class="draggable-input-container"
                     @mousedown="startDrag('timezone', $event)"
                  >
                     <input
                        type="text"
                        v-model="timeZone"
                        class="draggable-input field-value"
                        min="-12"
                        max="12"
                        @keydown="handleKeydown('timezone', $event)"
                        @blur="validateInput('timezone')"
                     />
                  </div>
               </div>
            </div>

            <!-- WEATHER Section -->
            <div class="section">
               <div class="section-title-wrapper">
                  <div class="section-title-line-left"></div>
                  <div class="section-title">WEATHER</div>
                  <div class="section-title-line-right"></div>
               </div>
               <div class="weather-display-container">
                  <div
                     class="weather-display"
                     @click="showWeatherDropdown = !showWeatherDropdown"
                  >
                     <div class="weather-text">
                        <img
                           :src="getCurrentWeatherImage()"
                           alt="weather"
                           class="weather-icon"
                        />
                        {{ currentWeather }}
                     </div>
                     <div class="weather-arrow">
                        <svg
                           width="12"
                           height="12"
                           viewBox="0 0 12 12"
                           fill="currentColor"
                        >
                           <path
                              d="M3 4.5L6 7.5L9 4.5"
                              stroke="currentColor"
                              stroke-width="1.5"
                              fill="none"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                           />
                        </svg>
                     </div>
                  </div>
                  <div
                     v-if="showWeatherDropdown"
                     class="dropdown-menu weather-dropdown weather-dropdown-up"
                  >
                     <div
                        v-for="(weather, index) in weatherOptions"
                        :key="index"
                        class="dropdown-item"
                        @click="selectWeather(weather)"
                     >
                        <img
                           :src="weather.image"
                           alt="weather"
                           class="weather-icon"
                        />
                        {{ weather.name }}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
   isCollapsed: {
      type: Boolean,
      default: false,
   },
});

const emit = defineEmits(["close", "sendToEngine", "toggleCollapse"]);

// Обработчик клика по кнопке сворачивания
const toggleCollapse = () => {
   emit("toggleCollapse");
};

// Time state
const currentTime = ref("3:00 PM");
const timeSliderPosition = ref(55);
const currentHour = ref(15);
const currentMinute = ref(0);
const timeOnly = ref("3:00");
const ampmIndex = ref(1);

// Date state
const currentMonth = ref("OCTOBER");
const currentDay = ref("3");
const currentYear = ref("2021");
const showMonthDropdown = ref(false);
const showDayDropdown = ref(false);
const showYearDropdown = ref(false);

// Location state
const latitude = ref("43.000");
const longitude = ref("43.000");
const timeZone = ref("3.0");

// Drag state
const isDragging = ref(false);
const dragType = ref(null);
const dragStartX = ref(0);
const dragStartValue = ref(0);

// Weather state
const currentWeather = ref("CLEAR SKIES");
const showWeatherDropdown = ref(false);

// Available options
const months = [
   "JANUARY",
   "FEBRUARY",
   "MARCH",
   "APRIL",
   "MAY",
   "JUNE",
   "JULY",
   "AUGUST",
   "SEPTEMBER",
   "OCTOBER",
   "NOVEMBER",
   "DECEMBER",
];

const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

const years = Array.from({ length: 10 }, (_, i) => (2021 + i).toString());

const weatherOptions = [
   {
      name: "CLEAR SKIES",
      image: "/src/assets/icons/weather/Clear_Skies.png",
   },
   {
      name: "PARTLY CLOUDY",
      image: "/src/assets/icons/weather/PartlyCloudy.png",
   },
   {
      name: "CLOUDY",
      image: "/src/assets/icons/weather/Cloudy.png",
   },
   {
      name: "OVERCAST",
      image: "/src/assets/icons/weather/Overcast.png",
   },
   {
      name: "FOGGY",
      image: "/src/assets/icons/weather/Foggy.png",
   },
   {
      name: "RAIN LIGHT",
      image: "/src/assets/icons/weather/LightRain.png",
   },
   {
      name: "RAIN",
      image: "/src/assets/icons/weather/Rain.png",
   },
   {
      name: "RAIN THUNDERSTORM",
      image: "/src/assets/icons/weather/Thunderstorms.png",
   },
   {
      name: "SNOW LIGHT",
      image: "/src/assets/icons/weather/Light_Snow.png",
   },
   {
      name: "SNOW",
      image: "/src/assets/icons/weather/Snow.png",
   },
   {
      name: "SNOW BLIZZARD",
      image: "/src/assets/icons/weather/Blizzard.png",
   },
   {
      name: "SAND DUST CALM",
      image: "/src/assets/icons/weather/Dust.png",
   },
   {
      name: "SAND DUST STORM",
      image: "/src/assets/icons/weather/DustStorm.png",
   },
];

// Time methods
const increaseTime = () => {
   currentHour.value = (currentHour.value + 1) % 24;
   updateTimeDisplay();
};

const decreaseTime = () => {
   currentHour.value = currentHour.value === 0 ? 23 : currentHour.value - 1;
   updateTimeDisplay();
};

const updateTimeDisplay = () => {
   const hour12 =
      currentHour.value === 0
         ? 12
         : currentHour.value > 12
         ? currentHour.value - 12
         : currentHour.value;
   const ampm = currentHour.value >= 12 ? "PM" : "AM";
   currentTime.value = `${hour12}:${currentMinute.value
      .toString()
      .padStart(2, "0")} ${ampm}`;

   // Update time only and AM/PM index
   timeOnly.value = `${hour12}:${currentMinute.value
      .toString()
      .padStart(2, "0")}`;
   ampmIndex.value = currentHour.value >= 12 ? 1 : 0;

   // Update slider position based on hour
   timeSliderPosition.value = (currentHour.value / 24) * 100;
};

const handleSliderChange = (event) => {
   const percentage = parseFloat(event.target.value);
   currentHour.value = Math.round((percentage / 100) * 24);
   updateTimeDisplay();
};

// Date methods
const selectMonth = (month) => {
   currentMonth.value = month;
   showMonthDropdown.value = false;
};

const selectDay = (day) => {
   currentDay.value = day;
   showDayDropdown.value = false;
};

const selectYear = (year) => {
   currentYear.value = year;
   showYearDropdown.value = false;
};

// Weather methods
const selectWeather = (weather) => {
   currentWeather.value = weather.name;
   showWeatherDropdown.value = false;
};

const getCurrentWeatherImage = () => {
   const weather = weatherOptions.find((w) => w.name === currentWeather.value);
   return weather
      ? weather.image
      : "/src/assets/icons/weather/weather-plug.png";
};

// Drag methods
const startDrag = (type, event) => {
   // Only start drag if it's not a text selection
   if (event.target.selectionStart !== event.target.selectionEnd) {
      return;
   }

   event.preventDefault();
   event.stopPropagation();

   isDragging.value = true;
   dragType.value = type;
   dragStartX.value = event.clientX;

   // Get initial value based on type
   if (type === "lat") {
      dragStartValue.value = parseFloat(latitude.value) || 0;
   } else if (type === "long") {
      dragStartValue.value = parseFloat(longitude.value) || 0;
   } else if (type === "timezone") {
      dragStartValue.value = parseFloat(timeZone.value) || 0;
   }

   console.log("Drag started:", type, dragStartValue.value);

   document.addEventListener("mousemove", handleDrag);
   document.addEventListener("mouseup", stopDrag);
};

const handleDrag = (event) => {
   if (!isDragging.value) return;

   const deltaX = event.clientX - dragStartX.value;
   const sensitivity = 0.1; // Step size for all fields
   const deltaValue = deltaX * sensitivity;
   const newValue = dragStartValue.value + deltaValue;

   // Clamp values based on type
   let clampedValue;
   if (dragType.value === "timezone") {
      clampedValue = Math.max(-12, Math.min(12, newValue));
   } else {
      clampedValue = Math.max(-180, Math.min(180, newValue));
   }

   if (dragType.value === "lat") {
      latitude.value = clampedValue.toFixed(3);
   } else if (dragType.value === "long") {
      longitude.value = clampedValue.toFixed(3);
   } else if (dragType.value === "timezone") {
      timeZone.value = clampedValue.toFixed(1);
   }
};

const stopDrag = () => {
   isDragging.value = false;
   dragType.value = null;
   document.removeEventListener("mousemove", handleDrag);
   document.removeEventListener("mouseup", stopDrag);
};

const handleKeydown = (type, event) => {
   // Allow normal text input but prevent default for arrow keys when dragging
   if (isDragging.value && ["ArrowLeft", "ArrowRight"].includes(event.key)) {
      event.preventDefault();
   }
};

const validateInput = (type) => {
   let value, clampedValue;

   if (type === "timezone") {
      value = parseFloat(timeZone.value);
      clampedValue = Math.max(-12, Math.min(12, value));
      timeZone.value = clampedValue.toFixed(1);
   } else {
      value = parseFloat(type === "lat" ? latitude.value : longitude.value);
      clampedValue = Math.max(-180, Math.min(180, value));

      if (type === "lat") {
         latitude.value = clampedValue.toFixed(3);
      } else {
         longitude.value = clampedValue.toFixed(3);
      }
   }
};

// Cleanup on unmount
onUnmounted(() => {
   document.removeEventListener("mousemove", handleDrag);
   document.removeEventListener("mouseup", stopDrag);
});

// Function to send single weather data field to engine
const sendSingleWeatherField = (key, value) => {
   const weatherData = {
      weather: {
         [key]: value,
      },
   };
   emit("sendToEngine", weatherData);
};

// Watch each field separately and send changes
watch([currentHour, currentMinute], () => {
   const timeValue = currentHour.value + currentMinute.value / 60;
   sendSingleWeatherField("time", Math.floor(timeValue * 100));
});

watch(ampmIndex, (newValue) => {
   sendSingleWeatherField("ampm", String(newValue));
});

watch(currentMonth, (newValue) => {
   const index = months.indexOf(newValue);
   sendSingleWeatherField("monthchange", String(index));
});

watch(currentDay, (newValue) => {
   sendSingleWeatherField("daychange", newValue);
});

watch(currentYear, (newValue) => {
   sendSingleWeatherField("yearchange", newValue);
});

watch(latitude, (newValue) => {
   sendSingleWeatherField("latitudechange", newValue);
});

watch(longitude, (newValue) => {
   sendSingleWeatherField("longitudechange", newValue);
});

watch(currentWeather, (newValue) => {
   const index = weatherOptions.findIndex((w) => w.name === newValue);
   sendSingleWeatherField("weathertype", String(index));
});

watch(timeZone, (newValue) => {
   sendSingleWeatherField("timezone", newValue);
});

// Send initial values on mount
onMounted(() => {
   const timeValue = currentHour.value + currentMinute.value / 60;
   sendSingleWeatherField("time", Math.floor(timeValue * 100));
   sendSingleWeatherField("ampm", String(ampmIndex.value));
   sendSingleWeatherField(
      "monthchange",
      String(months.indexOf(currentMonth.value))
   );
   sendSingleWeatherField("daychange", currentDay.value);
   sendSingleWeatherField("yearchange", currentYear.value);
   sendSingleWeatherField("latitudechange", latitude.value);
   sendSingleWeatherField("longitudechange", longitude.value);
   sendSingleWeatherField(
      "weathertype",
      String(weatherOptions.findIndex((w) => w.name === currentWeather.value))
   );
   sendSingleWeatherField("timezone", timeZone.value);
});
</script>

<style scoped>
.weather-time-selector {
   position: absolute;
   bottom: 100%;
   left: 30px;
   width: 300px;
   background-color: rgba(34, 34, 34, 0.5);
   border-radius: 8px;
   padding: 0 20px;
   z-index: 10000;
   pointer-events: auto;
   margin-bottom: 5px;

   @media (max-width: 1549px) {
      position: fixed;
      top: 0;
      right: 0;
      bottom: auto;
      left: auto;
      width: auto;
      height: auto;
      z-index: 10000;
      overflow: visible;
      padding: 0;
      margin-bottom: 0;
      background-color: transparent;
   }
}

.weather-time-wrapper {
   @media (max-width: 1549px) {
      position: relative;
      display: flex;
      align-items: flex-end;
      gap: 10px;
      transition: transform 0.4s ease-in-out;
      transform: translateX(0);
   }
}

.weather-time-wrapper.collapsed {
   @media (max-width: 1549px) {
      transform: translateX(
         calc(100% - 50px)
      ); /* Уезжает, оставляя только кнопку */
   }
}

/* Кнопка сворачивания для мобильных */
.collapse-toggle-btn {
   display: none;

   @media (max-width: 1549px) {
      display: block;
      position: sticky;
      bottom: 10px;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: #fff;
      font-size: 1.2rem;
      width: 40px;
      height: 40px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s ease;
      z-index: 50; /* Ниже камеры elevated (150) */
      user-select: none;
      flex-shrink: 0;
   }
}

.collapse-toggle-btn:hover {
   @media (max-width: 1549px) {
      background: rgba(255, 255, 255, 0.3);
   }
}

/* Контент для мобильных */
.weather-time-content {
   @media (max-width: 1549px) {
      background-color: rgba(34, 34, 34, 0.5);
      backdrop-filter: blur(10px);
      border-radius: 6px;
      padding: 15px;
      max-width: 280px;
      max-height: calc(100vh - 140px);
      overflow-y: auto;
   }
}

.section {
   margin-bottom: 5px;
}

.section:first-child {
   margin-bottom: 15px;
}

.section:last-child {
   margin-bottom: 0;
}

.section-title-wrapper {
   position: relative;
   margin-bottom: 8px;
   text-align: center;
   display: flex;
   align-items: center;
   justify-content: center;
}

.section-title {
   font-size: 0.875rem;
   color: #fff;
   letter-spacing: 1px;
   text-transform: uppercase;
   font-weight: 500;
   position: relative;
   z-index: 2;
   padding: 0 10px;
   flex-shrink: 0;
   user-select: none;
}

.section-title-line-left,
.section-title-line-right {
   flex: 1;
   height: 1px;
   background-color: rgba(255, 255, 255, 0.3);
}

/* TIME Section */
.time-display {
   display: flex;
   align-items: center;
   justify-content: center;
   margin-bottom: 15px;
   position: relative;
}

.time-value {
   font-size: 1.5rem;
   font-weight: bold;
   color: #fff;
   margin: 0 20px;
   user-select: none;
}

.time-controls {
   position: absolute;
   width: 100%;
   display: flex;
   justify-content: space-between;
   pointer-events: none;
}

.time-arrow {
   width: 20px;
   height: 20px;
   cursor: pointer;
   color: rgba(255, 255, 255, 0.7);
   pointer-events: auto;
   transition: all 0.3s ease;
   user-select: none;
}

.time-arrow:hover {
   color: #fff;
   transform: scale(1.1);
}

.time-slider-container {
   width: 100%;
   height: 4px;
   position: relative;
}

.time-slider-input {
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   opacity: 0;
   cursor: pointer;
   z-index: 2;
}

.time-slider-track {
   width: 100%;
   height: 2px;
   background-color: rgba(255, 255, 255, 0.3);
   border-radius: 1px;
   position: relative;
}

.time-slider-handle {
   position: absolute;
   top: -7px;
   width: 16px;
   height: 16px;
   background-color: #ffffff;
   border-radius: 50%;
   cursor: pointer;
   transition: all 0.3s ease;
   pointer-events: none;
}

.time-slider-handle:hover {
   background-color: #fff;
   transform: scale(1.1);
}

/* DATE Section */
.date-controls {
   display: flex;
   gap: 10px;
   justify-content: center;
}

.date-field-container {
   position: relative;
}

.date-field {
   background-color: rgba(255, 255, 255, 0.1);
   border: 1px solid rgba(255, 255, 255, 0.2);
   border-radius: 4px;
   padding: 0 12px;
   color: rgba(255, 255, 255, 0.8);
   cursor: pointer;
   transition: all 0.3s ease;
   min-width: 60px;
   text-align: center;
   display: flex;
   align-items: center;
   justify-content: space-between;
   gap: 5px;
   user-select: none;
}

.date-field:hover {
   background-color: rgba(255, 255, 255, 0.2);
   border-color: rgba(255, 255, 255, 0.4);
}

.dropdown-arrow {
   font-size: 0.625rem;
   color: rgba(255, 255, 255, 0.6);
   user-select: none;
}

.dropdown-menu {
   position: absolute;
   top: 100%;
   left: 0;
   right: 0;
   background-color: rgba(34, 34, 34, 0.95);
   border: 1px solid rgba(255, 255, 255, 0.2);
   border-radius: 4px;
   max-height: 150px;
   overflow-y: auto;
   z-index: 1000;
   margin-top: 2px;
}

.dropdown-item {
   display: flex;
   align-items: center;
   gap: 5px;
   cursor: pointer;
   padding: 5px 5px 5px 15px;
   border-radius: 4px;
   transition: all 0.3s ease;
   user-select: none;
}

.dropdown-item:hover {
   background-color: rgba(255, 255, 255, 0.1);
}

/* LOCATION Section */
.location-controls {
   display: flex;
   gap: 15px;
   justify-content: center;
   margin-bottom: 5px;
}

.location-field {
   background-color: rgba(255, 255, 255, 0.1);
   border: 1px solid rgba(255, 255, 255, 0.2);
   border-radius: 4px;
   padding: 0 12px;
   color: rgba(255, 255, 255, 0.8);
   display: flex;
   align-items: center;
   gap: 5px;
}

.draggable-input-container {
   position: relative;
   display: flex;
   align-items: center;
   gap: 5px;
   cursor: ew-resize;
   padding: 2px;
   border-radius: 2px;
   transition: background-color 0.2s ease;
}

.draggable-input-container:hover {
   background-color: rgba(255, 255, 255, 0.05);
}

.draggable-input {
   background: transparent;
   border: none;
   color: rgba(255, 255, 255, 0.8);
   font-weight: 500;
   font-size: 0.875rem;
   outline: none;
   cursor: ew-resize;
   user-select: none;
   text-align: center;
   padding: 2px 4px;
   border-radius: 2px;
   transition: background-color 0.2s ease;
   width: 100%;
}

.draggable-input:hover {
   background-color: rgba(255, 255, 255, 0.1);
}

.draggable-input:focus {
   background-color: rgba(255, 255, 255, 0.15);
   user-select: text;
   cursor: text;
}

.drag-indicator {
   font-size: 0.75rem;
   color: rgba(255, 255, 255, 0.4);
   cursor: ew-resize;
   user-select: none;
   transition: color 0.2s ease;
}

.draggable-input-container:hover .drag-indicator {
   color: rgba(255, 255, 255, 0.7);
}

.field-label {
   font-size: 0.75rem;
   color: rgba(255, 255, 255, 0.6);
   text-wrap: nowrap;
   user-select: none;
}

.field-value {
   width: 100%;
   font-weight: 500;
   background-color: rgba(255, 255, 255, 0.1);
   border: 1px solid rgba(255, 255, 255, 0.2);
   border-radius: 4px;
   color: rgba(255, 255, 255, 0.8);
   padding: 0 12px;
}

.globe-icon {
   display: flex;
   justify-content: center;
   margin-bottom: 5px;
   color: rgba(255, 255, 255, 0.7);
}

.timezone-field {
   color: rgba(255, 255, 255, 0.8);
   display: flex;
   align-items: center;
   gap: 5px;
   justify-content: center;
}

/* WEATHER Section */
.weather-display-container {
   position: relative;
}

.weather-display {
   background-color: rgba(255, 255, 255, 0.1);
   border: 1px solid rgba(255, 255, 255, 0.2);
   border-radius: 4px;
   padding: 0 12px;
   display: flex;
   align-items: center;
   gap: 10px;
   cursor: pointer;
   transition: all 0.3s ease;
   margin-bottom: 20px;
   user-select: none;
}

.weather-display:hover {
   background-color: rgba(255, 255, 255, 0.2);
   border-color: rgba(255, 255, 255, 0.4);
}

.weather-text {
   flex: 1;
   color: rgba(255, 255, 255, 0.8);
   font-weight: 500;
   display: flex;
   align-items: center;
   gap: 8px;
   user-select: none;
}

.weather-arrow {
   color: rgba(255, 255, 255, 0.6);
   flex-shrink: 0;
   user-select: none;
}

.weather-dropdown {
   width: 100%;
   max-height: 300px;
}

.weather-dropdown-up {
   top: auto;
   bottom: 100%;
   margin-top: 0;
   margin-bottom: 2px;
}

.weather-icon {
   width: 50px;
   height: 50px;
   user-select: none;
   pointer-events: none;
}
</style>
