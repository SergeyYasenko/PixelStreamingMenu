<template>
   <div class="pixel-streaming-container">
      <!-- Кнопка переключения зеркалирования -->
      <button v-if="isConnected" class="mirror-toggle" @click="toggleMirror">
         Mirror: {{ mirrorEnabled ? "ON" : "OFF" }}
      </button>

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
      </div>

      <!-- ConnectedDisplay вынесен за пределы video-wrapper -->
      <ConnectedDisplay
         v-if="isConnected"
         :last-message="lastMessage"
         :received-messages="receivedMessages"
         @send-data="sendJsonData"
         @send-to-engine="sendToEngine"
      />
   </div>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted } from "vue";
import {
   PixelStreaming,
   Config,
} from "@epicgames-ps/lib-pixelstreamingfrontend-ue5.5";
import ConnectedDisplay from "./ConnectedDisplay.vue";

const videoContainer = ref(null);
const signallingUrl = ref("ws://localhost:80");
const isConnected = ref(false);
const isConnecting = ref(false);
const errorMessage = ref("");
const receivedMessages = ref([]);
const lastMessage = ref("");
const mirrorEnabled = ref(false);

let pixelStreaming = null;
let videoElement = null;
let originalAddEventListener = null;

// Патчим video элемент чтобы обернуть все handler'ы библиотеки
const patchVideoElement = (video) => {
   originalAddEventListener = video.addEventListener.bind(video);

   video.addEventListener = function (type, listener, options) {
      const mouseEvents = [
         "pointerdown",
         "pointerup",
         "pointermove",
         "mousedown",
         "mouseup",
         "mousemove",
      ];

      if (mouseEvents.includes(type) && typeof listener === "function") {
         // Оборачиваем listener - ВСЕГДА инвертируем координаты
         const wrappedListener = function (e) {
            const rect = video.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            const mirroredClientX = rect.left + rect.width - relativeX;

            // Создаем прокси с инвертированными координатами
            const proxiedEvent = new Proxy(e, {
               get(target, prop) {
                  if (prop === "clientX") return mirroredClientX;
                  if (prop === "offsetX") return rect.width - relativeX;
                  if (prop === "x") return mirroredClientX;
                  if (prop === "pageX") return mirroredClientX + window.scrollX;

                  const value = target[prop];
                  if (typeof value === "function") {
                     return value.bind(target);
                  }
                  return value;
               },
            });

            return listener.call(this, proxiedEvent);
         };

         originalAddEventListener.call(this, type, wrappedListener, options);
      } else {
         originalAddEventListener.call(this, type, listener, options);
      }
   };

   console.log("✅ Video element patched!");
};

// Переключение зеркалирования
const toggleMirror = () => {
   mirrorEnabled.value = !mirrorEnabled.value;
   updateMirrorTransform();
};

// Обновление transform для видео
const updateMirrorTransform = () => {
   if (videoElement) {
      videoElement.style.transform = mirrorEnabled.value ? "scaleX(-1)" : "";
      videoElement.style.transformOrigin = "center center";
   }
};

const connect = async () => {
   if (!signallingUrl.value) {
      errorMessage.value = "Пожалуйста, введите URL сервера";
      return;
   }

   try {
      isConnecting.value = true;
      errorMessage.value = "";

      // MutationObserver: ждем появления video элемента и патчим его ДО инициализации библиотеки
      const observer = new MutationObserver(() => {
         const v = videoContainer.value?.querySelector("video");
         if (v && v !== videoElement) {
            videoElement = v;
            // Патчим video элемент ДО того как библиотека навесит свои handler'ы
            patchVideoElement(v);
            updateMirrorTransform();
            observer.disconnect();
         }
      });
      observer.observe(videoContainer.value, {
         childList: true,
         subtree: true,
      });

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
      });

      pixelStreaming.addEventListener("webRtcDisconnected", () => {
         isConnected.value = false;
         isConnecting.value = false;
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

onMounted(() => {
   // Инициализация из URL параметров
   const params = new URLSearchParams(window.location.search);
   const mirrorParam = params.get("mirror");
   if (
      mirrorParam === "1" ||
      mirrorParam === "true" ||
      mirrorParam === "flip"
   ) {
      mirrorEnabled.value = true;
   }
});

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
   position: relative;
}

.mirror-toggle {
   position: fixed;
   top: 10px;
   right: 10px;
   z-index: 9999;
   padding: 8px 12px;
   background: rgba(0, 0, 0, 0.6);
   color: white;
   border: none;
   border-radius: 4px;
   cursor: pointer;
   font-size: 14px;
   user-select: none;
   transition: background 0.2s;
}

.mirror-toggle:hover {
   background: rgba(0, 0, 0, 0.8);
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
