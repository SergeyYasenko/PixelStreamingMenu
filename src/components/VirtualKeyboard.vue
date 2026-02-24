<template>
   <div v-if="show" class="virtual-keyboard" @click.stop>
      <!-- Letters layout (RU / EN) -->
      <template v-if="layout === 'letters'">
         <div class="keyboard-row">
            <button
               v-for="ch in currentLetterRows[0]"
               :key="ch"
               class="keyboard-key"
               @click.stop="emitChar(ch)"
            >{{ ch }}</button>
         </div>
         <div class="keyboard-row">
            <button
               v-for="ch in currentLetterRows[1]"
               :key="ch"
               class="keyboard-key"
               @click.stop="emitChar(ch)"
            >{{ ch }}</button>
         </div>
         <div class="keyboard-row">
            <button
               class="keyboard-key keyboard-key-accent"
               :class="{ active: isShift }"
               @click.stop="toggleShift"
            >
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4L3 15H8V20H16V15H21L12 4Z" :fill="isShift ? '#4A90D9' : 'none'" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
               </svg>
            </button>
            <button
               v-for="ch in currentLetterRows[2]"
               :key="ch"
               class="keyboard-key"
               @click.stop="emitChar(ch)"
            >{{ ch }}</button>
            <button class="keyboard-key keyboard-key-accent" @click.stop="emitBackspace">←</button>
         </div>
         <div class="keyboard-row keyboard-controls">
            <button class="keyboard-key keyboard-key-fn" @click.stop="layout = 'numbers'">123</button>
            <button class="keyboard-key keyboard-key-fn" @click.stop="toggleLang">{{ lang === 'ru' ? (isShift ? 'EN' : 'en') : (isShift ? 'RU' : 'ru') }}</button>
            <button class="keyboard-key keyboard-key-space" @click.stop="emitChar(' ')">Пробел</button>
            <button class="keyboard-key keyboard-key-fn" @click.stop="emitString(lang === 'ru' ? '.ru' : '.com')">{{ lang === 'ru' ? '.ru' : '.com' }}</button>
            <button class="keyboard-key keyboard-key-fn" @click.stop="emitEnter">Ввод</button>
         </div>
      </template>

      <!-- Numbers/symbols layout -->
      <template v-if="layout === 'numbers'">
         <div class="keyboard-row">
            <button v-for="ch in numRow1" :key="ch" class="keyboard-key" @click.stop="emitChar(ch)">{{ ch }}</button>
         </div>
         <div class="keyboard-row">
            <button v-for="ch in numRow2" :key="ch" class="keyboard-key" @click.stop="emitChar(ch)">{{ ch }}</button>
         </div>
         <div class="keyboard-row">
            <button v-for="ch in numRow3" :key="ch" class="keyboard-key" @click.stop="emitChar(ch)">{{ ch }}</button>
         </div>
         <div class="keyboard-row keyboard-controls">
            <button class="keyboard-key keyboard-key-fn" @click.stop="layout = 'letters'">ABC</button>
            <button class="keyboard-key keyboard-key-space" @click.stop="emitChar(' ')">Пробел</button>
            <button class="keyboard-key keyboard-key-fn" @click.stop="emitBackspace">←</button>
            <button class="keyboard-key keyboard-key-fn" @click.stop="emitEnter">Ввод</button>
         </div>
      </template>
   </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
   show: {
      type: Boolean,
      default: false,
   },
   mode: {
      type: String,
      default: "letters",
      validator: (v) => ["letters", "numbers"].includes(v),
   },
});

const emit = defineEmits(["keypress", "backspace", "enter"]);

const layout = ref(props.mode);
const lang = ref("ru");
const isShift = ref(true);

watch(() => props.mode, (newMode) => {
   layout.value = newMode;
});

const ruUpper = [
   ['Й','Ц','У','К','Е','Н','Г','Ш','Щ','З','Х','Ъ'],
   ['Ф','Ы','В','А','П','Р','О','Л','Д','Ж','Э'],
   ['Я','Ч','С','М','И','Т','Ь','Б','Ю'],
];
const ruLower = [
   ['й','ц','у','к','е','н','г','ш','щ','з','х','ъ'],
   ['ф','ы','в','а','п','р','о','л','д','ж','э'],
   ['я','ч','с','м','и','т','ь','б','ю'],
];
const enUpper = [
   ['Q','W','E','R','T','Y','U','I','O','P'],
   ['A','S','D','F','G','H','J','K','L'],
   ['Z','X','C','V','B','N','M'],
];
const enLower = [
   ['q','w','e','r','t','y','u','i','o','p'],
   ['a','s','d','f','g','h','j','k','l'],
   ['z','x','c','v','b','n','m'],
];

const numRow1 = ['1','2','3','4','5','6','7','8','9','0'];
const numRow2 = ['!','"','№','%',':','?','*','-','='];
const numRow3 = ['@','#','$','^','&','(',')','+','_'];

const currentLetterRows = computed(() => {
   if (lang.value === 'ru') {
      return isShift.value ? ruUpper : ruLower;
   }
   return isShift.value ? enUpper : enLower;
});

const toggleShift = () => {
   isShift.value = !isShift.value;
};

const toggleLang = () => {
   lang.value = lang.value === 'ru' ? 'en' : 'ru';
};

const emitChar = (ch) => {
   emit("keypress", ch);
   if (isShift.value && ch.match(/[a-zA-Zа-яА-ЯёЁ]/)) {
      isShift.value = false;
   }
};

const emitString = (str) => {
   for (const ch of str) {
      emit("keypress", ch);
   }
};

const emitBackspace = () => {
   emit("backspace");
};

const emitEnter = () => {
   emit("enter");
};
</script>

<style scoped>
.virtual-keyboard {
   margin-top: 20px;
   background: rgba(23, 23, 23, 0.75);
   backdrop-filter: blur(24px);
   border-radius: 12px;
   padding: 12px;
   width: 100%;
   max-width: 700px;
   user-select: none;
}

.keyboard-row {
   display: flex;
   gap: 6px;
   margin-bottom: 6px;
}

.keyboard-row:last-child {
   margin-bottom: 0;
}

.keyboard-key {
   flex: 1;
   min-width: 0;
   height: 48px;
   backdrop-filter: blur(24px);
   background: rgba(23, 23, 23, 0.75);
   border: none;
   border-radius: 8px;
   color: #fff;
   font-size: 1.25rem;
   font-weight: 300;
   cursor: pointer;
   transition: background 0.15s ease;
   display: flex;
   align-items: center;
   justify-content: center;
   padding: 0;
}

.keyboard-key:hover {
   background: rgba(80, 80, 80, 0.9);
}

.keyboard-key:active {
   background: rgba(100, 100, 100, 0.9);
}

.keyboard-key-accent {
   flex: 1.4;
   background: rgba(23, 23, 23, 0.75);
}

.keyboard-key-accent.active {
   background: #4A90D9;
}

.keyboard-key-fn {
   flex: 1.2;
   font-size: 0.9rem;
   background: rgba(23, 23, 23, 0.75);
}

.keyboard-key-space {
   flex: 5;
}

.keyboard-controls {
   margin-top: 4px;
}
</style>
