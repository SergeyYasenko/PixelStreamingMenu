/**
 * Конфиг нижнего меню для ребрендинга.
 * Переиспользуемые кнопки: добавление/удаление — правка этого файла.
 *
 * Как добавить кнопку: скопировать объект в bottomMenuItems, задать id, name, icon (из ICONS или новый URL),
 *   actions (и при необходимости screens).
 * Как убрать кнопку: удалить или закомментировать объект в bottomMenuItems.
 *
 * screens: массив id экранов, на которых кнопка видна (если не указано — на всех).
 *   Пример: screens: ['main', 'map'] — кнопка только на экранах main и map.
 * actions: массив действий по клику (выполняются по порядку).
 *
 * Типы действий:
 *   { type: 'sendToEngine', payload: { key: value } } — отправить в UE
 *   { type: 'emit', event: 'eventName' } — эмит в родителя
 *   { type: 'emit', event: 'eventName', payload: {...} } — эмит с данными
 *   special: 'toggleHoloMode' — особый случай (состояние в BottomMenu)
 */

const ICONS = {
   genplan: new URL('../assets/icons/newIcons/Map.svg', import.meta.url).href,
   openComplex: new URL('../assets/icons/newIcons/Back.svg', import.meta.url).href,
   Play: new URL('../assets/icons/newIcons/Play.svg', import.meta.url).href,
   aboutProject: new URL('../assets/icons/newIcons/Attention.svg', import.meta.url).href,
   infrastructure: new URL('../assets/icons/newIcons/Builds.svg', import.meta.url).href,
   selectApartment: new URL('../assets/icons/newIcons/Search.svg', import.meta.url).href,
   favorites: new URL('../assets/icons/newIcons/Hearth.svg', import.meta.url).href,
   settings: new URL('../assets/icons/newIcons/Settings.svg', import.meta.url).href,
   photo: new URL('../assets/icons/newIcons/Photo.svg', import.meta.url).href,
   restart: new URL('../assets/icons/newIcons/Restart.svg', import.meta.url).href,
   logout: new URL('../assets/icons/newIcons/Logout.svg', import.meta.url).href,
   speedUp: new URL('../assets/icons/newIcons/Speed.svg', import.meta.url).href,
   current: new URL('../assets/icons/newIcons/Clock.svg', import.meta.url).href,
};

/** Кнопки начального экрана (до клика на Генплан) */
const mainScreenItems = [
   {
      id: 'genplan',
      name: 'Генплан',
      icon: ICONS.genplan,
      actions: [
         { type: 'emit', event: 'switchScreen', payload: 'genplan' },
         { type: 'sendToEngine', payload: { home: '' } },
      ],
   },
   {
      id: 'openComplex',
      name: 'Открыть ЖК',
      icon: ICONS.openComplex,
      actions: [
         { type: 'emit', event: 'showWelcome' },
      ],
   },
   {
      id: 'Play',
      name: '',
      icon: ICONS.Play,
      showText: false,
      actions: [{ type: 'sendToEngine', payload: { playVideo: '' } }],
   },
];

/** Кнопки экрана Генплан (после клика на Генплан) */
const genplanScreenItems = [
   {
      id: 'genplan',
      name: 'Генплан',
      icon: ICONS.genplan,
      actions: [{ type: 'sendToEngine', payload: { home: '' } }],
   },
   {
      id: 'aboutProject',
      name: 'О проекте',
      icon: ICONS.aboutProject,
      actions: [{ type: 'emit', event: 'showDataBlocks', payload: 'about' }],
   },
   {
      id: 'infrastructure',
      name: 'Инфраструктура',
      icon: ICONS.infrastructure,
      actions: [
         { type: 'emit', event: 'showDataBlocks', payload: 'infrastructure' },
         { type: 'sendToEngine', payload: { infrastructure: '' } },
      ],
   },
   {
      id: 'selectApartment',
      name: 'Выбрать квартиру',
      icon: ICONS.selectApartment,
      actions: [{ type: 'sendToEngine', payload: { selectApartment: '' } }],
   },
   {
      id: 'favorites',
      name: 'Избранное',
      icon: ICONS.favorites,
      actions: [{ type: 'sendToEngine', payload: { favorites: '' } }],
   },
   {
      id: 'playGenplan',
      name: '',
      icon: ICONS.Play,
      showText: false,
      width: '26px',
      height: '26px',
      actions: [{ type: 'sendToEngine', payload: { playVideo: '' } }],
   },
   {
      id: 'settingsGenplan',
      name: '',
      icon: ICONS.settings,
      showText: false,
      width: '26px',
      height: '26px',
      actions: [{ type: 'emit', event: 'showGoodiniSettings' }],
   },
   {
      id: 'photoGenplan',
      name: '',
      icon: ICONS.photo,
      showText: false,
      width: '26px',
      height: '26px',
      actions: [{ type: 'sendToEngine', payload: { photo: '' } }],
   },
   {
      id: 'restartGenplan',
      name: '',
      icon: ICONS.restart,
      showText: false,
      width: '26px',
      height: '26px',
      actions: [{ type: 'sendToEngine', payload: { restart: '' } }],
   },
   {
      id: 'logoutGenplan',
      name: '',
      icon: ICONS.logout,
      showText: false,
      width: '26px',
      height: '26px',
      actions: [{ type: 'emit', event: 'hide' }, { type: 'sendToEngine', payload: { exit: '' } }],
   },
   {
      id: 'speedUp',
      name: 'Ускорить',
      icon: ICONS.speedUp,
      rightSide: true,
      actions: [{ type: 'sendToEngine', payload: { speedUp: '' } }],
   },
   {
      id: 'current',
      name: 'Текущее',
      icon: ICONS.current,
      rightSide: true,
      actions: [{ type: 'sendToEngine', payload: { current: '' } }],
   },
];

/**
 * Вернуть кнопки для экрана.
 * @param {string} screenId — 'main' | 'genplan'
 */
export function getMenuItemsForScreen(screenId = 'main') {
   if (screenId === 'genplan') return genplanScreenItems;
   return mainScreenItems;
}
