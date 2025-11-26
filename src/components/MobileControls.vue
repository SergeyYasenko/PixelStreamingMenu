<template>
   <div class="mobile-controls">
      <div class="joystick-circle">
         <!-- Стрелка вверх -->
         <button
            class="control-btn up-btn"
            @touchstart="handleTouchStart('up')"
            @touchend="handleTouchEnd"
            @mousedown="handleMouseDown('up')"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseUp"
         >
            <svg width="40" height="40" viewBox="0 0 20 20" fill="none">
               <path
                  d="M10 7L5 12M10 7L15 12"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
               />
            </svg>
         </button>

         <!-- Стрелка влево -->
         <button
            class="control-btn left-btn"
            @touchstart="handleTouchStart('left')"
            @touchend="handleTouchEnd"
            @mousedown="handleMouseDown('left')"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseUp"
         >
            <svg width="40" height="40" viewBox="0 0 20 20" fill="none">
               <path
                  d="M13 7L8 12M13 17L8 12"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
               />
            </svg>
         </button>

         <!-- Стрелка вниз -->
         <button
            class="control-btn down-btn"
            @touchstart="handleTouchStart('down')"
            @touchend="handleTouchEnd"
            @mousedown="handleMouseDown('down')"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseUp"
         >
            <svg width="40" height="40" viewBox="0 0 20 20" fill="none">
               <path
                  d="M10 13L5 8M10 13L15 8"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
               />
            </svg>
         </button>

         <!-- Стрелка вправо -->
         <button
            class="control-btn right-btn"
            @touchstart="handleTouchStart('right')"
            @touchend="handleTouchEnd"
            @mousedown="handleMouseDown('right')"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseUp"
         >
            <svg width="40" height="40" viewBox="0 0 20 20" fill="none">
               <path
                  d="M7 7L12 12M7 17L12 12"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
               />
            </svg>
         </button>
      </div>
   </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue";

const emit = defineEmits(["sendToEngine"]);

const activeButton = ref(null);
let commandIntervalId = null;
let currentDirection = null;

const sendCommand = (direction) => {
   emit("sendToEngine", { [direction]: "" });
};

// Запуск интервала для периодической отправки команды (15 раз в секунду)
const startCommandInterval = (direction) => {
   // Очищаем существующий интервал, если есть
   if (commandIntervalId) {
      clearInterval(commandIntervalId);
   }

   currentDirection = direction;
   // Отправляем команду 15 раз в секунду (каждые ~66.67ms)
   commandIntervalId = setInterval(() => {
      if (currentDirection) {
         sendCommand(currentDirection);
      }
   }, 1000 / 15);
};

// Остановка интервала
const stopCommandInterval = () => {
   if (commandIntervalId) {
      clearInterval(commandIntervalId);
      commandIntervalId = null;
   }
   currentDirection = null;
};

const handleTouchStart = (direction) => {
   activeButton.value = direction;
   sendCommand(direction); // Немедленная отправка
   startCommandInterval(direction); // Запускаем периодическую отправку
};

const handleTouchEnd = () => {
   activeButton.value = null;
   stopCommandInterval();
};

const handleMouseDown = (direction) => {
   activeButton.value = direction;
   sendCommand(direction); // Немедленная отправка
   startCommandInterval(direction); // Запускаем периодическую отправку
};

const handleMouseUp = () => {
   activeButton.value = null;
   stopCommandInterval();
};

// Очищаем интервал при размонтировании
onBeforeUnmount(() => {
   stopCommandInterval();
});
</script>

<style scoped>
.mobile-controls {
   display: none; /* Скрыто на ПК */

   @media (max-width: 1549px) {
      position: fixed;
      bottom: 135px;
      left: 20px;
      z-index: 20;
      pointer-events: auto;
      display: block;
   }
}

.joystick-circle {
   width: 120px;
   height: 120px;
   border-radius: 50%;
   background: rgba(34, 34, 34, 0.7);
   border: 2px solid rgba(255, 255, 255, 0.3);
   position: relative;
   display: flex;
   align-items: center;
   justify-content: center;
}

.control-btn {
   width: 40px;
   height: 40px;
   background: transparent;
   border: none;
   border-radius: 50%;
   display: flex;
   align-items: center;
   justify-content: center;
   cursor: pointer;
   transition: all 0.15s ease;
   color: #fff;
   touch-action: manipulation;
   -webkit-tap-highlight-color: transparent;
   position: absolute;
   user-select: none;
}

.control-btn:active,
.control-btn.touch-active {
   transform: scale(1.1);
   opacity: 0.7;
}

.control-btn svg {
   width: 36px;
   height: 36px;
   pointer-events: none;
}

/* Позиционирование стрелок по кругу */
.up-btn {
   top: 5px;
   left: 50%;
   transform: translateX(-50%);
}

.up-btn:active,
.up-btn.touch-active {
   transform: translateX(-50%) scale(1.1);
}

.right-btn {
   right: 5px;
   top: 50%;
   transform: translateY(-50%);
}

.right-btn:active,
.right-btn.touch-active {
   transform: translateY(-50%) scale(1.1);
}

.down-btn {
   bottom: 5px;
   left: 50%;
   transform: translateX(-50%);
}

.down-btn:active,
.down-btn.touch-active {
   transform: translateX(-50%) scale(1.1);
}

.left-btn {
   left: 5px;
   top: 50%;
   transform: translateY(-50%);
}

.left-btn:active,
.left-btn.touch-active {
   transform: translateY(-50%) scale(1.1);
}
</style>
