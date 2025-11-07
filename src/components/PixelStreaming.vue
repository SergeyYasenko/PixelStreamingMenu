<template>
   <div class="pixel-streaming-container">
      <div class="video-wrapper">
         <div ref="videoContainer" class="video-container"></div>

         <div v-if="!isConnected" class="overlay">
            <div class="connection-panel">
               <h2>Pixel Streaming</h2>
               <div class="input-group">
                  <label>Signalling Server URL:</label>
                  <input
                     v-model="signallingUrl"
                     type="text"
                     placeholder="ws://localhost:80"
                     :disabled="isConnecting"
                  />
               </div>
               <button
                  @click="connect"
                  :disabled="isConnecting"
                  class="connect-btn"
               >
                  {{ isConnecting ? "Подключение..." : "Подключиться" }}
               </button>
               <div v-if="errorMessage" class="error-message">
                  {{ errorMessage }}
               </div>
            </div>
         </div>

         <ConnectedDisplay
            v-if="isConnected"
            :last-message="lastMessage"
            :received-messages="receivedMessages"
            @send-data="sendJsonData"
            @send-to-engine="sendToEngine"
         />
      </div>
   </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue";
import {
   PixelStreaming,
   Config,
} from "@epicgames-ps/lib-pixelstreamingfrontend-ue5.5";
import ConnectedDisplay from "./ConnectedDisplay.vue";

const videoContainer = ref(null);
const signallingUrl = ref("ws://192.168.0.110:80");
const isConnected = ref(false);
const isConnecting = ref(false);
const errorMessage = ref("");
const receivedMessages = ref([]);
const lastMessage = ref("");

let pixelStreaming = null;
let videoElement = null;
let mirrorEnabled = false;

// Используем WeakSet для отслеживания уже обработанных событий
const processedEvents = new WeakSet();

// Обработчик для перехвата и инвертирования координат
function captureHandler(e) {
   if (!mirrorEnabled || !videoElement || !videoContainer.value) return;

   // Пропускаем уже обработанные события (избегаем рекурсии)
   if (processedEvents.has(e)) return;

   // Проверяем, что событие произошло внутри videoContainer
   // (это может быть video или overlay элементы от Pixel Streaming)
   const target = e.target;

   // Если событие НЕ внутри videoContainer - пропускаем (это UI элементы)
   if (!videoContainer.value.contains(target)) {
      return;
   }

   // Проверяем, не является ли target элементом с pointer-events: auto
   // (это наши UI элементы поверх видео)
   const computedStyle = window.getComputedStyle(target);
   if (computedStyle.pointerEvents === "auto" && target !== videoElement) {
      console.log(
         `⏭️ Пропускаем UI элемент: ${target.tagName}.${target.className}`
      );
      return;
   }

   // DEBUG: Логируем перехваченные события
   console.log(`🎯 Перехвачено событие: ${e.type}`, {
      target: `${e.target.tagName}${
         e.target.className ? "." + e.target.className : ""
      }`,
      clientX: e.clientX || (e.touches && e.touches[0]?.clientX),
      clientY: e.clientY || (e.touches && e.touches[0]?.clientY),
   });

   const rect = videoElement.getBoundingClientRect();
   if (rect.width === 0) return;

   let clientX = e.clientX,
      clientY = e.clientY;

   // Обработка touch событий
   if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
   }

   // Зеркальное преобразование координаты X
   const mirroredClientX = rect.left + rect.width - (clientX - rect.left);

   // Останавливаем оригинальное событие
   e.stopImmediatePropagation();
   e.preventDefault();

   let newEvent;

   // Для touch событий создаем TouchEvent
   if (e.type.startsWith("touch") && e.touches) {
      // Создаем зеркальный touch
      const touch = e.touches[0];
      const mirroredTouch = new Touch({
         identifier: touch.identifier,
         target: target, // Используем оригинальный target
         clientX: mirroredClientX,
         clientY: clientY,
         screenX: touch.screenX,
         screenY: touch.screenY,
         pageX: mirroredClientX,
         pageY: clientY,
         radiusX: touch.radiusX || 0,
         radiusY: touch.radiusY || 0,
         rotationAngle: touch.rotationAngle || 0,
         force: touch.force || 1.0,
      });

      newEvent = new TouchEvent(e.type, {
         bubbles: true,
         cancelable: true,
         composed: true,
         view: window,
         touches: [mirroredTouch],
         targetTouches: [mirroredTouch],
         changedTouches: [mirroredTouch],
         ctrlKey: e.ctrlKey,
         altKey: e.altKey,
         shiftKey: e.shiftKey,
         metaKey: e.metaKey,
      });

      console.log(
         `✨ Создано зеркальное TouchEvent: ${e.type}, координаты: ${mirroredClientX}, ${clientY}`
      );
   }
   // Для pointer событий
   else if (e.type.startsWith("pointer")) {
      const opts = {
         bubbles: true,
         cancelable: true,
         composed: true,
         view: window,
         clientX: mirroredClientX,
         clientY: clientY,
         screenX: e.screenX,
         screenY: e.screenY,
         pointerType: e.pointerType || "mouse",
         button: e.button || 0,
         buttons: e.buttons || 0,
         pointerId: e.pointerId || 1,
         isPrimary: e.isPrimary !== undefined ? e.isPrimary : true,
         ctrlKey: e.ctrlKey,
         altKey: e.altKey,
         shiftKey: e.shiftKey,
         metaKey: e.metaKey,
      };
      newEvent = new PointerEvent(e.type, opts);
      console.log(
         `✨ Создано зеркальное PointerEvent: ${e.type}, координаты: ${mirroredClientX}, ${clientY}`
      );
   }
   // Для остальных событий (mouse, click и т.д.)
   else {
      const opts = {
         bubbles: true,
         cancelable: true,
         composed: true,
         view: window,
         clientX: mirroredClientX,
         clientY: clientY,
         screenX: e.screenX,
         screenY: e.screenY,
         button: e.button || 0,
         buttons: e.buttons || 0,
         ctrlKey: e.ctrlKey,
         altKey: e.altKey,
         shiftKey: e.shiftKey,
         metaKey: e.metaKey,
      };
      newEvent = new MouseEvent(e.type, opts);
      console.log(
         `✨ Создано зеркальное MouseEvent: ${e.type}, координаты: ${mirroredClientX}, ${clientY}`
      );
   }

   // Помечаем событие как обработанное
   processedEvents.add(newEvent);

   // Отправляем событие на тот же элемент, на который пришло оригинальное
   target.dispatchEvent(newEvent);

   console.log(`📤 Событие отправлено на: ${target.tagName}`);
}

// Настройка перехвата событий
const setupEventCapture = () => {
   // Перехватываем события клика, движения мыши И touch для мобильных
   const events = [
      "pointerdown",
      "pointerup",
      "pointermove",
      "mousedown",
      "mouseup",
      "mousemove",
      "click",
      "dblclick",
      "contextmenu",
      "touchstart",
      "touchend",
      "touchmove",
   ];

   // Слушаем на document с capture: true для перехвата ВСЕХ событий
   // Внутри captureHandler проверяем, что это событие для видео, а не UI элементов
   events.forEach((eventType) => {
      document.addEventListener(eventType, captureHandler, {
         capture: true,
         passive: false,
      });
   });

   mirrorEnabled = true;
   console.log(
      "✅ Mouse coordinate mirroring enabled (mouse + touch + drag and drop)"
   );
};

// Удаление перехвата событий
const removeEventCapture = () => {
   const events = [
      "pointerdown",
      "pointerup",
      "pointermove",
      "mousedown",
      "mouseup",
      "mousemove",
      "click",
      "dblclick",
      "contextmenu",
      "touchstart",
      "touchend",
      "touchmove",
   ];

   events.forEach((eventType) => {
      document.removeEventListener(eventType, captureHandler, {
         capture: true,
      });
   });

   mirrorEnabled = false;
   console.log("❌ Mouse coordinate mirroring disabled");
};

const connect = async () => {
   if (!signallingUrl.value) {
      errorMessage.value = "Пожалуйста, введите URL сервера";
      return;
   }

   try {
      isConnecting.value = true;
      errorMessage.value = "";

      const config = new Config({
         initialSettings: {
            ss: signallingUrl.value,
            AutoPlayVideo: true,
            AutoConnect: true,
            FakeMouseWithTouches: true,
            Gamepad: false,
            Keyboard: false,
            Mouse: true,
            Touch: true,
            XRController: false,
            HoveringMouse: false,
         },
      });

      pixelStreaming = new PixelStreaming(config, {
         videoElementParent: videoContainer.value,
      });

      pixelStreaming.addEventListener("webRtcConnected", () => {
         isConnected.value = true;
         isConnecting.value = false;

         // Получаем ссылку на video элемент и включаем перехват координат
         setTimeout(() => {
            videoElement = videoContainer.value?.querySelector("video");
            if (videoElement) {
               console.log(
                  "📦 Структура videoContainer:",
                  videoContainer.value
               );
               console.log("🎥 Video элемент:", videoElement);
               console.log(
                  "👶 Дочерние элементы videoContainer:",
                  Array.from(videoContainer.value.children).map((el) => ({
                     tag: el.tagName,
                     class: el.className,
                     id: el.id,
                  }))
               );
               setupEventCapture();
            }
         }, 100);
      });

      pixelStreaming.addEventListener("webRtcDisconnected", () => {
         isConnected.value = false;
         isConnecting.value = false;
         removeEventCapture();
         videoElement = null;
      });

      pixelStreaming.addEventListener("playStreamError", () => {
         errorMessage.value = "Ошибка воспроизведения стрима";
         isConnecting.value = false;
      });

      pixelStreaming.addEventListener("dataChannelMessage", (data) => {
         lastMessage.value =
            typeof data === "string" ? data : JSON.stringify(data);

         const time = new Date().toLocaleTimeString();
         receivedMessages.value.unshift({
            time: time,
            data:
               typeof data === "string" ? data : JSON.stringify(data, null, 2),
         });

         if (receivedMessages.value.length > 10) {
            receivedMessages.value.pop();
         }
      });

      pixelStreaming.addResponseEventListener("response", (response) => {
         lastMessage.value =
            typeof response === "string" ? response : JSON.stringify(response);

         const time = new Date().toLocaleTimeString();
         receivedMessages.value.unshift({
            time: time,
            data:
               typeof response === "string"
                  ? response
                  : JSON.stringify(response, null, 2),
         });

         if (receivedMessages.value.length > 10) {
            receivedMessages.value.pop();
         }
      });

      pixelStreaming.connect();
   } catch (error) {
      errorMessage.value = `Ошибка: ${error.message}`;
      isConnecting.value = false;
   }
};

const sendJsonData = () => {
   if (pixelStreaming) {
      pixelStreaming.emitUIInteraction({ action: "jump" });
   }
};

const sendToEngine = (data) => {
   console.log("🎮 sendToEngine вызван, данные:", data);
   if (pixelStreaming) {
      console.log("✅ Отправляем через pixelStreaming.emitUIInteraction");
      pixelStreaming.emitUIInteraction(data);
   } else {
      console.error("❌ pixelStreaming не инициализирован!");
   }
};

onBeforeUnmount(() => {
   removeEventCapture();
   if (pixelStreaming) {
      pixelStreaming.disconnect();
   }
});
</script>

<style scoped>
.pixel-streaming-container {
   width: 100%;
   height: 100vh;
   display: flex;
   align-items: center;
   justify-content: center;
   background: #1a1a1a;
}

.video-wrapper {
   position: relative;
   width: 100%;
   height: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
}

.video-container {
   width: 100%;
   height: 100%;
   position: relative;
   touch-action: none; /* Отключаем все встроенные жесты браузера для передачи событий в JS */
   -webkit-tap-highlight-color: transparent; /* Убирает выделение при тапе на iOS */
   user-select: none; /* Запрещает выделение текста */
   -webkit-user-select: none;
}

.video-container :deep(video) {
   transform: scaleX(-1);
   touch-action: none; /* Отключаем все встроенные жесты браузера для передачи событий в JS */
   -webkit-tap-highlight-color: transparent; /* Убирает выделение при тапе на iOS */
}

.overlay {
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
   background: rgba(0, 0, 0, 0.8);
   z-index: 10;
}

.connection-panel {
   background: #2a2a2a;
   padding: 2rem;
   border-radius: 8px;
   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
   min-width: 400px;
}

.connection-panel h2 {
   margin: 0 0 1.5rem 0;
   color: #fff;
   text-align: center;
}

.input-group {
   margin-bottom: 1.5rem;
}

.input-group label {
   display: block;
   color: #ccc;
   margin-bottom: 0.5rem;
   font-size: 0.9rem;
}

.input-group input {
   width: 100%;
   padding: 0.75rem;
   border: 1px solid #444;
   border-radius: 4px;
   background: #1a1a1a;
   color: #fff;
   font-size: 1rem;
   box-sizing: border-box;
}

.input-group input:focus {
   outline: none;
   border-color: #646cff;
}

.connect-btn {
   width: 100%;
   padding: 0.75rem;
   background: #646cff;
   color: white;
   border: none;
   border-radius: 4px;
   font-size: 1rem;
   cursor: pointer;
   transition: background 0.3s;
   user-select: none;
}

.connect-btn:hover:not(:disabled) {
   background: #535bf2;
}

.connect-btn:disabled {
   background: #444;
   cursor: not-allowed;
}

.error-message {
   margin-top: 1rem;
   padding: 0.75rem;
   background: #ff4444;
   color: white;
   border-radius: 4px;
   text-align: center;
}
</style>
