<template>
   <div class="pixel-streaming-container">
      <div class="video-wrapper">
         <div
            ref="videoContainer"
            class="video-container"
            @mousemove="handleMouseMove"
            @click="handleClick"
            @mousedown="handleMouseDown"
            @mouseup="handleMouseUp"
            @contextmenu="handleContextMenu"
         >
            <!-- Кастомный курсор (инвертированный) -->
            <div
               v-if="isConnected && showMirrorCursor"
               ref="mirrorCursor"
               class="mirror-cursor"
               :style="{ left: cursorX + 'px', top: cursorY + 'px' }"
            ></div>
         </div>

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
const mirrorCursor = ref(null);
const signallingUrl = ref("ws://localhost:80");
const isConnected = ref(false);
const isConnecting = ref(false);
const errorMessage = ref("");
const receivedMessages = ref([]);
const lastMessage = ref("");
const showMirrorCursor = ref(false);
const cursorX = ref(0);
const cursorY = ref(0);

let pixelStreaming = null;
let videoElement = null;

// Обработка движения мыши - курсор следует за реальной позицией
const handleMouseMove = (e) => {
   if (!isConnected.value || !videoContainer.value) return;

   const rect = videoContainer.value.getBoundingClientRect();

   // Курсор точно на месте реального курсора пользователя
   cursorX.value = e.clientX - rect.left;
   cursorY.value = e.clientY - rect.top;

   showMirrorCursor.value = true;
};

// Генерируем клик в инвертированной позиции относительно центра
const generateMirroredClick = (originalEvent, eventType = "click") => {
   if (!videoElement) return;

   const rect = videoContainer.value.getBoundingClientRect();
   const centerX = rect.width / 2;

   // Вычисляем смещение курсора от центра
   const offsetX = cursorX.value - centerX;

   // Инвертируем X-координату относительно центра
   const mirroredX = centerX - offsetX;

   // Абсолютные координаты для клика
   const mirroredClientX = rect.left + mirroredX;
   const mirroredClientY = rect.top + cursorY.value;

   const eventOptions = {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: mirroredClientX,
      clientY: mirroredClientY,
      screenX: originalEvent.screenX,
      screenY: originalEvent.screenY,
      button: originalEvent.button,
      buttons: originalEvent.buttons,
      ctrlKey: originalEvent.ctrlKey,
      altKey: originalEvent.altKey,
      shiftKey: originalEvent.shiftKey,
      metaKey: originalEvent.metaKey,
   };

   try {
      const newEvent = new PointerEvent(eventType, eventOptions);
      videoElement.dispatchEvent(newEvent);
   } catch (err) {
      const newEvent = new MouseEvent(eventType, eventOptions);
      videoElement.dispatchEvent(newEvent);
   }
};

const handleClick = (e) => {
   if (!isConnected.value) return;
   e.preventDefault();
   e.stopPropagation();
   generateMirroredClick(e, "click");
};

const handleMouseDown = (e) => {
   if (!isConnected.value) return;
   e.preventDefault();
   e.stopPropagation();
   generateMirroredClick(e, "mousedown");
   generateMirroredClick(e, "pointerdown");
};

const handleMouseUp = (e) => {
   if (!isConnected.value) return;
   e.preventDefault();
   e.stopPropagation();
   generateMirroredClick(e, "mouseup");
   generateMirroredClick(e, "pointerup");
};

const handleContextMenu = (e) => {
   if (!isConnected.value) return;
   e.preventDefault();
   e.stopPropagation();
   generateMirroredClick(e, "contextmenu");
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
            ss_autoconnect: true,
            StartVideoMuted: false,
            HoveringMouse: true,
            FakeMouseWithTouches: true,
            LogLevel: "Error", // Отключаем информационные логи
         },
      });

      pixelStreaming = new PixelStreaming(config, {
         videoElementParent: videoContainer.value,
      });

      pixelStreaming.addEventListener("webRtcConnected", () => {
         isConnected.value = true;
         isConnecting.value = false;

         // Получаем ссылку на video элемент для генерации событий
         setTimeout(() => {
            videoElement = videoContainer.value?.querySelector("video");
         }, 100);
      });

      pixelStreaming.addEventListener("webRtcDisconnected", () => {
         isConnected.value = false;
         isConnecting.value = false;
         videoElement = null;
         showMirrorCursor.value = false;
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
   if (pixelStreaming) {
      pixelStreaming.disconnect();
   }
   videoElement = null;
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
   cursor: none; /* Скрываем обычный курсор когда подключены */
}

.video-container :deep(video) {
   transform: scaleX(-1);
   pointer-events: none; /* Отключаем клики на самом видео */
}

.mirror-cursor {
   position: absolute;
   width: 20px;
   height: 20px;
   border: 2px solid rgba(255, 0, 0, 0.8);
   border-radius: 50%;
   background: rgba(255, 0, 0, 0.2);
   pointer-events: none;
   transform: translate(-50%, -50%);
   z-index: 1000;
   transition: left 0.05s ease-out, top 0.05s ease-out;
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
