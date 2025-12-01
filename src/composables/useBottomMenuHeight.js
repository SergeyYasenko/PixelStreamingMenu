import { ref, onMounted, onUnmounted, nextTick } from "vue";

/**
 * Composable для автоматического вычисления и отслеживания высоты BottomMenu
 * Устанавливает CSS переменную --bottom-menu-height для использования в стилях
 * 
 * @returns {Object} Объект с реактивной высотой bottomMenuHeight
 */
export function useBottomMenuHeight() {
   const bottomMenuHeight = ref(120);
   let resizeObserver = null;

   /**
    * Функция для обновления высоты BottomMenu
    */
   const updateBottomMenuHeight = () => {
      if (window.innerWidth <= 1549) {
         const bottomMenu = document.querySelector(".bottom-menu-mobile");
         if (bottomMenu) {
            bottomMenuHeight.value = bottomMenu.offsetHeight;
            // Устанавливаем CSS переменную для использования в стилях
            document.documentElement.style.setProperty(
               "--bottom-menu-height",
               `${bottomMenu.offsetHeight}px`
            );
         }
      }
   };

   /**
    * Инициализация отслеживания высоты BottomMenu
    */
   const initBottomMenuHeightTracking = () => {
      nextTick(() => {
         updateBottomMenuHeight();

         // Отслеживаем изменения размера BottomMenu
         resizeObserver = new ResizeObserver(() => {
            updateBottomMenuHeight();
         });

         const bottomMenu = document.querySelector(".bottom-menu-mobile");
         if (bottomMenu) {
            resizeObserver.observe(bottomMenu);
         }

         window.addEventListener("resize", updateBottomMenuHeight);
      });
   };

   /**
    * Очистка ресурсов
    */
   const cleanup = () => {
      if (resizeObserver) {
         resizeObserver.disconnect();
         resizeObserver = null;
      }
      window.removeEventListener("resize", updateBottomMenuHeight);
   };

   // Автоматическая инициализация при монтировании
   onMounted(() => {
      initBottomMenuHeightTracking();
   });

   // Автоматическая очистка при размонтировании
   onUnmounted(() => {
      cleanup();
   });

   return {
      bottomMenuHeight,
      updateBottomMenuHeight,
      initBottomMenuHeightTracking,
      cleanup,
   };
}

