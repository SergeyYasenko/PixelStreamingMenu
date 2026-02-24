<template>
   <div class="welcome-frame-overlay" @click="handleOverlayClick">
      <!-- Steps 1 & 2: Form -->
      <template v-if="step !== 3">
         <div class="welcome-frame" @click.stop>
            <div class="welcome-header">
               <h2 class="welcome-title">Добро пожаловать</h2>
               <button class="welcome-frame-close" @click="handleClose">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
               </button>
            </div>
            <div class="welcome-divider"></div>
            <div class="welcome-content">
               <h3 class="welcome-main-text">Введите номер телефона</h3>
               <p class="welcome-description">
                  Это нужно, чтобы сохранить квартиры в «Избранное»<br>
                  При повторном входе информация восстановится
               </p>

               <!-- Step 1 -->
               <template v-if="step === 1">
                  <div class="welcome-field welcome-field-phone">
                     <label class="welcome-field-label">Ваш номер телефона</label>
                     <input
                        ref="phoneInput"
                        :value="phoneNumber"
                        type="tel"
                        class="welcome-field-input"
                        placeholder="+7 800 000 00 00"
                        @focus="handleFocus('phone')"
                        @input="handlePhoneInput"
                        @keydown="handlePhoneKeydown"
                        @paste="handlePhonePaste"
                     />
                  </div>
                  <button class="welcome-action-btn" :disabled="!isPhoneValid" @click="goToStep2">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="action-btn-arrow">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                     </svg>
                     <span>Продолжить</span>
                  </button>
               </template>

               <!-- Step 2 -->
               <template v-if="step === 2">
                  <div class="welcome-fields-grid">
                     <div class="welcome-field">
                        <label class="welcome-field-label">Ваш номер телефона</label>
                        <input
                           :value="phoneNumber"
                           type="tel"
                           class="welcome-field-input"
                           placeholder="+7 800 000 00 00"
                           @focus="handleFocus('phone')"
                           @input="handlePhoneInput"
                           @keydown="handlePhoneKeydown"
                           @paste="handlePhonePaste"
                        />
                     </div>
                     <div class="welcome-field" :class="{ 'welcome-field-error': emailTouched && email && !isEmailValid }">
                        <label class="welcome-field-label">Ваша почта</label>
                        <input
                           v-model="email"
                           type="email"
                           class="welcome-field-input"
                           placeholder="example@ex.com"
                           maxlength="30"
                           @focus="handleFocus('email')"
                           @blur="emailTouched = true"
                        />
                        <span v-if="emailTouched && email && !isEmailValid" class="welcome-field-hint">
                           {{ emailHint }}
                        </span>
                     </div>
                     <div class="welcome-field">
                        <label class="welcome-field-label">Ваше имя</label>
                        <input
                           v-model="userName"
                           type="text"
                           class="welcome-field-input"
                           placeholder="Пример"
                           maxlength="30"
                           @focus="handleFocus('name')"
                        />
                     </div>
                     <div class="welcome-field welcome-field-select" :class="{ 'welcome-field-select-open': showManagerDropdown }" @click.stop="toggleManagerDropdown">
                        <div class="welcome-select">
                           <span class="welcome-select-value">
                              {{ selectedManager || 'Без менеджера' }}
                           </span>
                           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="welcome-select-arrow" :class="{ open: showManagerDropdown }">
                              <path d="M6 9L12 15L18 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                           </svg>
                        </div>
                        <div v-if="showManagerDropdown" class="welcome-dropdown" @click.stop>
                           <button
                              v-for="(manager, idx) in managerOptions"
                              :key="manager"
                              class="welcome-dropdown-item"
                              :class="{ 'welcome-dropdown-item-first': idx === 0 }"
                              @click.stop="selectManager(manager)"
                           >
                              {{ manager }}
                           </button>
                        </div>
                     </div>
                  </div>
                  <button class="welcome-action-btn" :disabled="(email && !isEmailValid)" @click="handleLogin">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="action-btn-arrow">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                     </svg>
                     <span>Войти</span>
                  </button>
               </template>
            </div>
         </div>
         <VirtualKeyboard
            :show="showKeyboard"
            :mode="keyboardMode"
            @keypress="handleVirtualKeypress"
            @backspace="handleVirtualBackspace"
            @enter="handleVirtualEnter"
         />
      </template>

      <!-- Step 3: Success -->
      <div v-if="step === 3" class="welcome-success" @click.stop>
         <div class="welcome-success-header">
            <h2 class="welcome-success-title">Добро пожаловать!</h2>
            <button class="welcome-frame-close" @click="handleClose">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
               </svg>
            </button>
         </div>
         <div class="welcome-success-divider"></div>
         <div class="welcome-success-body">
            <h3 class="welcome-success-subtitle">Здравствуйте</h3>
            <p class="welcome-success-text">
               Выбирайте квартиры, добавляйте их в избранное, гуляйте, осматривайте и сравнивайте
            </p>
         </div>
         <button class="welcome-success-btn" @click="handleExplore">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Осмотреть комплекс</span>
         </button>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import VirtualKeyboard from "./VirtualKeyboard.vue";

const STORAGE_KEY = "welcomeFrame";

function loadSession() {
   try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
   } catch { return null; }
}

function saveSession(data) {
   sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const emit = defineEmits(["close", "continue", "sendToEngine"]);

const saved = loadSession();

const phoneInput = ref(null);
const phoneNumber = ref(saved?.phoneNumber || "+7 ");
const email = ref(saved?.email || "");
const userName = ref(saved?.userName || "");
const selectedManager = ref(saved?.selectedManager || "");
const showManagerDropdown = ref(false);
const showKeyboard = ref(false);
const step = ref(saved?.step || 1);
const activeField = ref("phone");
const emailTouched = ref(false);

function persistState() {
   saveSession({
      step: step.value,
      phoneNumber: phoneNumber.value,
      email: email.value,
      userName: userName.value,
      selectedManager: selectedManager.value,
   });
}

watch([step, phoneNumber, email, userName, selectedManager], persistState);

const managerOptions = ['Без менеджера', 'Наталья', 'Олег', 'Владимир'];

const phoneRegex = /^\+7 \d{3} \d{3} \d{2} \d{2}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isPhoneValid = computed(() => phoneRegex.test(phoneNumber.value));

const isEmailValid = computed(() => {
   if (!email.value) return true;
   return emailRegex.test(email.value);
});

const emailHint = computed(() => {
   const val = email.value;
   if (!val) return '';
   if (!val.includes('@')) return 'Отсутствует символ @';
   const parts = val.split('@');
   if (parts[0].length === 0) return 'Введите имя до @';
   if (!parts[1]) return 'Введите домен после @';
   if (!parts[1].includes('.')) return 'Домен должен содержать точку';
   const domainParts = parts[1].split('.');
   if (domainParts[domainParts.length - 1].length < 2) return 'Некорректная доменная зона';
   return 'Некорректный email';
});

const keyboardMode = computed(() => {
   return activeField.value === 'phone' ? 'numbers' : 'letters';
});

const formatPhoneNumber = (value) => {
   let cleaned = value.replace(/\D/g, "");
   if (cleaned.startsWith("7") || cleaned.startsWith("8")) {
      cleaned = cleaned.substring(1);
   }
   cleaned = cleaned.substring(0, 10);
   if (cleaned.length > 0) {
      let formatted = "+7 ";
      if (cleaned.length > 0) formatted += cleaned.substring(0, 3);
      if (cleaned.length > 3) formatted += " " + cleaned.substring(3, 6);
      if (cleaned.length > 6) formatted += " " + cleaned.substring(6, 8);
      if (cleaned.length > 8) formatted += " " + cleaned.substring(8, 10);
      return formatted;
   }
   return "+7 ";
};

const handleFocus = (field) => {
   activeField.value = field;
   showKeyboard.value = true;
   showManagerDropdown.value = false;
};

const handlePhoneInput = (event) => {
   phoneNumber.value = formatPhoneNumber(event.target.value);
};

const handlePhoneKeydown = (event) => {
   const key = event.key;
   const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
   ];
   if (allowedKeys.includes(key)) return;
   if (event.ctrlKey || event.metaKey) return;
   if (key.match(/[\d+]/)) {
      if (key.match(/\d/)) {
         const current = phoneNumber.value.replace(/\D/g, "");
         let cleaned = current;
         if (cleaned.startsWith("7") || cleaned.startsWith("8")) cleaned = cleaned.substring(1);
         if (cleaned.length >= 10) { event.preventDefault(); return; }
      }
      if (key === "+" && phoneNumber.value.includes("+")) { event.preventDefault(); return; }
   } else {
      event.preventDefault();
   }
};

const handlePhonePaste = (event) => {
   event.preventDefault();
   const pastedText = (event.clipboardData || window.clipboardData).getData('text');
   if (pastedText) phoneNumber.value = formatPhoneNumber(pastedText);
};

// Virtual keyboard handlers — route to active field
const handleVirtualKeypress = (ch) => {
   if (activeField.value === 'phone') {
      if (ch.match(/\d/)) {
         const current = phoneNumber.value.replace(/\D/g, "");
         let cleaned = current;
         if (cleaned.startsWith("7") || cleaned.startsWith("8")) cleaned = cleaned.substring(1);
         if (cleaned.length < 10) {
            phoneNumber.value = formatPhoneNumber(current + ch);
         }
      }
   } else if (activeField.value === 'email') {
      if (email.value.length < 30) email.value += ch;
   } else if (activeField.value === 'name') {
      if (userName.value.length < 30) userName.value += ch;
   }
};

const handleVirtualBackspace = () => {
   if (activeField.value === 'phone') {
      const current = phoneNumber.value.replace(/\D/g, "");
      if (current.length > 0) {
         phoneNumber.value = formatPhoneNumber(current.slice(0, -1));
      } else {
         phoneNumber.value = "+7 ";
      }
   } else if (activeField.value === 'email') {
      email.value = email.value.slice(0, -1);
   } else if (activeField.value === 'name') {
      userName.value = userName.value.slice(0, -1);
   }
};

const handleVirtualEnter = () => {
   showKeyboard.value = false;
};

const toggleManagerDropdown = () => {
   showManagerDropdown.value = !showManagerDropdown.value;
};

const selectManager = (manager) => {
   selectedManager.value = manager === 'Без менеджера' ? '' : manager;
   showManagerDropdown.value = false;
};

const goToStep2 = () => {
   if (isPhoneValid.value) step.value = 2;
};

const handleLogin = () => {
   const payload = {
      phoneNumber: phoneNumber.value,
      email: email.value,
      userName: userName.value,
      manager: selectedManager.value,
   };
   emit("sendToEngine", { login: payload });
   showKeyboard.value = false;
   step.value = 3;
};

const handleExplore = () => {
   emit("continue", {
      phoneNumber: phoneNumber.value,
      email: email.value,
      userName: userName.value,
      manager: selectedManager.value,
   });
   emit("sendToEngine", { explore: "" });
   handleClose();
};

const handleClose = () => {
   emit("close");
};

const handleOverlayClick = () => {
   showManagerDropdown.value = false;
   handleClose();
};
</script>

<style scoped>
.welcome-frame-overlay {
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background: transparent;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   z-index: 20000;
   padding: 20px;
   pointer-events: auto;
}

.welcome-frame {
   position: relative;
   background: var(--color-background);
   backdrop-filter: var(--backdrop-blur);
   border-radius: 12px;
   padding: 32px;
   min-width: 800px;
   max-width: 900px;
   width: 100%;
   border: 1px solid rgba(255, 255, 255, 0.08);
   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.welcome-header {
   display: flex;
   align-items: flex-start;
   justify-content: space-between;
   margin-bottom: 16px;
}

.welcome-title {
   font-weight: 400;
   font-size: 3rem;
   color: #fff;
   margin: 0;
   letter-spacing: 0.5px;
}

.welcome-frame-close {
   width: 48px;
   height: 48px;
   background: var(--color-background);
   border: none;
   border-radius: 12px;
   display: flex;
   align-items: center;
   justify-content: center;
   cursor: pointer;
   transition: all 0.3s ease;
   padding: 0;
   flex-shrink: 0;
}

.welcome-frame-close:hover {
   background: rgba(255, 255, 255, 0.12);
}

.welcome-divider {
   width: 100%;
   height: 1px;
   background: #fff;
   margin-bottom: 32px;
}

.welcome-content {
   display: flex;
   flex-direction: column;
   gap: 24px;
}

.welcome-main-text {
   font-weight: 400;
   font-size: 1.5rem;
   color: #fff;
   margin: 0;
   letter-spacing: 0.5px;
}

.welcome-description {
   font-size: 1rem;
   font-weight: 300;
   color: rgba(255, 255, 255, 0.85);
   margin: 0;
   line-height: 1.5;
}

/* Reusable field styles */
.welcome-field {
   position: relative;
   display: flex;
   justify-content: center;
   flex-direction: column;
   gap: 8px;
   background: var(--color-background);
   border: 1px solid rgba(255, 255, 255, 0.08);
   border-radius: 12px;
   padding: 12px;
}

.welcome-field-label {
   font-size: 0.75rem;
   font-weight: 300;
   color: rgba(255, 255, 255, 0.6);
}

.welcome-field-input {
   width: 100%;
   padding: 0 0 8px 0;
   border: none;
   background-color: transparent;
   border-bottom: 1px solid #fff;
   color: #fff;
   font-size: 1.125rem;
   font-weight: 300;
   font-family: "Jost", sans-serif;
   transition: all 0.3s ease;
   box-sizing: border-box;
}

.welcome-field-input:focus {
   outline: none;
   border-bottom-color: #2A6FDA;
}

.welcome-field-input::placeholder {
   color: rgba(255, 255, 255, 0.5);
}

.welcome-field-phone {
   max-width: 250px;
}

/* Error state */
.welcome-field-error {
   border-color: rgba(239, 68, 68, 0.6);
}

.welcome-field-error .welcome-field-input {
   border-bottom-color: #ef4444;
}

.welcome-field-hint {
   font-size: 0.75rem;
   font-weight: 300;
   color: #ef4444;
   margin-top: 2px;
}

/* 2x2 grid for step 2 */
.welcome-fields-grid {
   display: grid;
   grid-template-columns: 1fr 1fr;
   gap: 16px;
}

/* Select field */
.welcome-field-select {
   cursor: pointer;
   padding: 0;
   overflow: visible;
}

.welcome-select {
   display: flex;
   align-items: center;
   justify-content: space-between;
   padding: 16px 12px;
   color: #fff;
   font-size: 1.125rem;
}

.welcome-select-value {
   color: rgba(255, 255, 255, 0.85);
}

.welcome-select-arrow {
   flex-shrink: 0;
   transition: transform 0.3s ease;
}

.welcome-select-arrow.open {
   transform: rotate(180deg);
}

/* Dropdown — absolute, seamless visual continuation */
.welcome-dropdown {
   position: absolute;
   top: 100%;
   left: -1px;
   right: -1px;
   z-index: 100;
   background: var(--color-background);
   border: 1px solid rgba(255, 255, 255, 0.08);
   border-top: none;
   border-radius: 0 0 12px 12px;
   overflow: hidden;
   padding: 12px;
}

.welcome-field-select-open {
   border-radius: 12px 12px 0 0;
}

.welcome-dropdown-item {
   display: block;
   width: 100%;
   padding-bottom: 12px;
   background: transparent;
   text-align: left;
   border: none;
   color: #878787;
   background-color: #171717;
   font-size: 1.125rem;
   cursor: pointer;
   transition: background 0.2s ease;
   padding: 4px;
}

.welcome-dropdown-item:hover {
   background: rgba(255, 255, 255, 0.08);
}

/* Action button (Продолжить / Войти) */
.welcome-action-btn {
   min-width: 156px;
   width: fit-content;
   padding: 16px 24px;
   background: var(--color-background);
   border: 1px solid rgba(255, 255, 255, 0.08);
   border-radius: 12px;
   color: #fff;
   font-size: 1.125rem;
   font-weight: 300;
   font-family: "Jost", sans-serif;
   cursor: pointer;
   transition: all 0.3s ease;
   display: flex;
   align-items: center;
   justify-content: flex-start;
   gap: 12px;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.welcome-action-btn:hover:not(:disabled) {
   background: rgba(255, 255, 255, 0.12);
   border-color: rgba(255, 255, 255, 0.25);
}

.welcome-action-btn:disabled {
   opacity: 0.5;
   cursor: not-allowed;
}

.action-btn-arrow {
   width: 24px;
   height: 24px;
   flex-shrink: 0;
   transform: rotate(180deg);
}

/* Step 3: Success screen */
.welcome-success {
   background: var(--color-background);
   backdrop-filter: var(--backdrop-blur);
   border-radius: 12px;
   padding: 32px;
   max-width: 817px;
   width: 100%;
   border: 1px solid rgba(255, 255, 255, 0.08);
   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.welcome-success-header {
   display: flex;
   align-items: flex-start;
   justify-content: space-between;
   margin-bottom: 16px;
}

.welcome-success-divider {
   width: 100%;
   height: 1px;
   background: #fff;
   margin-bottom: 24px;
}

.welcome-success-title {
   font-weight: 400;
   font-size: 3rem;
   color: #fff;
   margin: 0;
   letter-spacing: 0.5px;
}

.welcome-success-body {
   display: flex;
   flex-direction: column;
   gap: 12px;
   margin-bottom: 24px;
}

.welcome-success-subtitle {
   font-weight: 400;
   font-size: 1.5rem;
   color: #fff;
   margin: 0;
}

.welcome-success-text {
   font-size: 1.5rem;
   font-weight: 300;
   color: rgba(255, 255, 255, 0.7);
   margin: 0;
   line-height: 1.5;
}

.welcome-success-btn {
   display: flex;
   align-items: center;
   gap: 8px;
   padding: 12px 20px;
   background: var(--color-background);
   border: 1px solid rgba(255, 255, 255, 0.12);
   border-radius: 12px;
   color: #fff;
   font-size: 1rem;
   font-weight: 300;
   font-family: "Jost", sans-serif;
   cursor: pointer;
   transition: all 0.3s ease;
}

.welcome-success-btn:hover {
   background: rgba(255, 255, 255, 0.12);
   border-color: rgba(255, 255, 255, 0.25);
}
</style>
