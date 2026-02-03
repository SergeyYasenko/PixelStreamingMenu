<template>
   <Teleport to="body">
      <Transition name="modal">
         <div
            v-if="isVisible"
            class="al-avatar-modal-overlay"
            @click.self="close"
         >
            <div class="al-avatar-modal">
               <button class="al-avatar-modal-close" @click="close" aria-label="Закрыть">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                     <path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                     />
                  </svg>
               </button>
               <h3 class="al-avatar-modal-title">AI Avatar</h3>
               <div class="al-avatar-modal-row">
                  <div
                     v-for="(item, index) in avatars"
                     :key="index"
                     class="al-avatar-modal-item"
                     role="button"
                     tabindex="0"
                     @click="selectCard(item.name)"
                     @keydown.enter="selectCard(item.name)"
                  >
                     <img
                        v-if="item.flag"
                        :src="item.flag"
                        :alt="`Flag ${index + 1}`"
                        class="al-avatar-flag"
                     />
                     <div v-else class="al-avatar-flag-spacer"></div>
                     <div class="al-avatar-image-wrap">
                        <img
                           :src="item.image"
                           :alt="`Avatar ${index + 1}`"
                           loading="lazy"
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </Transition>
   </Teleport>
</template>

<script setup>
import russianImg from "@/assets/img/AI Avatar/russian.png";
import arabianFemaleImg from "@/assets/img/AI Avatar/arabian_female.png";
import arabianMaleImg from "@/assets/img/AI Avatar/arabian_male.png";
import hindiImg from "@/assets/img/AI Avatar/hindi.png";
import englishImg from "@/assets/img/AI Avatar/english.png";
import englishRoboImg from "@/assets/img/AI Avatar/english_robo.png";
import flagRussia from "@/assets/img/AI Avatar/flag-russia.jpeg";
import flagOAE from "@/assets/img/AI Avatar/flag-OAE.jpg";
import flagIndia from "@/assets/img/AI Avatar/flag-india.jpg";
import flagUK from "@/assets/img/AI Avatar/flag-UK.jpg";

defineProps({
   isVisible: {
      type: Boolean,
      default: false,
   },
});

const emit = defineEmits(["close", "select"]);

const close = () => emit("close");

const selectCard = (name) => emit("select", name);

const avatars = [
   { name: "arabian_female", image: arabianFemaleImg, flag: flagOAE },
   { name: "arabian_male", image: arabianMaleImg, flag: flagOAE },
   { name: "english_robo", image: englishRoboImg, flag: flagUK },
   { name: "english", image: englishImg, flag: flagUK },
   { name: "hindi", image: hindiImg, flag: flagIndia },
   { name: "russian", image: russianImg, flag: flagRussia },
];
</script>

<style scoped>
.al-avatar-modal-overlay {
   position: fixed;
   inset: 0;
   background: rgba(0, 0, 0, 0.5);
   display: flex;
   align-items: center;
   justify-content: center;
   z-index: 1000;
   padding: 20px;
   backdrop-filter: blur(4px);
}

.al-avatar-modal {
   position: relative;
   background-color: rgba(34, 34, 34, 0.95);
   border-radius: 12px;
   padding: 24px;
   max-width: 1100px;
   width: 100%;
   max-height: 90vh;
   overflow: hidden;
   display: flex;
   flex-direction: column;
   border: 1px solid rgba(255, 255, 255, 0.2);
}

.al-avatar-modal-close {
   position: absolute;
   top: 16px;
   right: 16px;
   background: rgba(255, 255, 255, 0.2);
   border: none;
   color: #fff;
   width: 40px;
   height: 40px;
   border-radius: 8px;
   cursor: pointer;
   display: flex;
   align-items: center;
   justify-content: center;
   transition: opacity 0.2s ease;
}

.al-avatar-modal-close:hover {
   background: rgba(255, 255, 255, 0.3);
}

.al-avatar-modal-title {
   margin: 0 0 20px 0;
   font-size: 1.5rem;
   font-weight: 600;
   color: #fff;
   text-transform: uppercase;
   letter-spacing: 0.05em;
}

.al-avatar-modal-row {
   display: flex;
   flex-direction: row;
   gap: 15px;
   overflow-x: auto;
   overflow-y: hidden;
   padding: 0 8px 8px 0;
   justify-content: center;
   align-items: flex-end;
}

.al-avatar-modal-row::-webkit-scrollbar {
   height: 6px;
}

.al-avatar-modal-row::-webkit-scrollbar-track {
   background: rgba(255, 255, 255, 0.1);
   border-radius: 3px;
}

.al-avatar-modal-row::-webkit-scrollbar-thumb {
   background: rgba(255, 255, 255, 0.3);
   border-radius: 3px;
}

.al-avatar-modal-item {
   display: flex;
   flex-direction: column;
   align-items: center;
   flex: 1;
   min-width: 0;
   cursor: pointer;
}

.al-avatar-modal-item:focus-visible {
   outline: 2px solid rgba(255, 255, 255, 0.5);
   outline-offset: 2px;
}

.al-avatar-flag {
   width: 80px;
   height: 60px;
   object-fit: cover;
   border-radius: 4px;
   transform: translateY(10px);
}

.al-avatar-flag-spacer {
   width: 50px;
   height: 70px;
   margin-bottom: 20px;
}

.al-avatar-image-wrap {
   width: 100%;
   aspect-ratio: 200 / 450;
   background: transparent;
   border-radius: 4px;
   overflow: hidden;
}

.al-avatar-image-wrap img {
   width: 100%;
   height: 100%;
   object-fit: cover;
   display: block;
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
   transition: opacity 0.25s ease;
}

.modal-enter-active .al-avatar-modal,
.modal-leave-active .al-avatar-modal {
   transition: transform 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
   opacity: 0;
}

.modal-enter-from .al-avatar-modal,
.modal-leave-to .al-avatar-modal {
   transform: scale(0.95);
}
</style>
