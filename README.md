# PixelStreamingMenu

Веб-клиент **Unreal Engine Pixel Streaming** (UE 5.5): подключение по WebRTC, видео, оверлей-меню и отправка команд в движок через `emitUIInteraction`.

## Стек

| Слой | Технология |
|------|------------|
| UI | Vue 3 (Composition API) |
| Сборка | Vite 7 |
| Pixel Streaming | `@epicgames-ps/lib-pixelstreamingfrontend-ue5.5` |
| Алиас | `@` → `src/` (`vite.config.js`) |

## Фичи (кратко)

- Экран ввода URL сигнального сервера, подключение / отключение.
- Видеопоток + оверлей: верхнее меню (корпуса, этажи, инфо-кнопки), нижнее меню (навигация, погода/время, качество, HOLO/Demo/Reset и т.д.).
- Настройки качества и режимов в `GoodiniSettings.vue` (часть опций уходит в UE).
- Погода/время, слайдеры, селекторы (`WeatherTimeSelector`, `CorpSelector`, `FloorSelector` и др. — по факту импортов в `ConnectedDisplay.vue`).
- Зеркалирование картинки и корректные клики — см. **`MIRROR_CLICK_STRATEGY.md`**.
- Доп. заметки по задержке, планшетам, pointer events — папка **`docs/`**.

## Команды

| Команда | Назначение |
|---------|------------|
| `npm install` | Зависимости |
| `npm run dev` | Dev-сервер Vite, `--host` (доступ по сети) |
| `npm run build` | Production-сборка → **`dist/`** |
| `npm run preview` | Локальный просмотр содержимого **`dist/`** |

После `build` статику раздаёт любой HTTP-сервер или хостинг; для Pixel Streaming обычно нужны **HTTPS/WSS** в проде.

## Куда смотреть в коде

| Что | Где |
|-----|-----|
| Точка входа | `src/main.js` → `App.vue` |
| Инициализация PS, видео, прокси команд | `src/components/PixelStreaming.vue` |
| Оверлей, меню, маршрутизация UI ↔ UE | `src/components/ConnectedDisplay.vue` |
| Нижнее меню и команды кнопок | `src/components/BottomMenu.vue` |
| Настройки (качество, holo и т.п.) | `src/components/GoodiniSettings.vue` |
| Глобальные стили | `src/style.css` |

**Команды в UE:** объект передаётся в `pixelStreaming.emitUIInteraction(payload)` из `PixelStreaming.vue`; источники payload — в основном `ConnectedDisplay.vue`, `BottomMenu.vue`, `GoodiniSettings.vue`, `WeatherTimeSelector.vue`. Точные ключи смотреть по `emit("sendToEngine"` / `emitUIInteraction` в репозитории.

## Данные в браузере

| Хранилище | Ключ / назначение |
|-----------|-------------------|
| `localStorage` | `goodiniSettings` — JSON настроек из `GoodiniSettings.vue` (и чтение в `PixelStreaming.vue` при старте) |

Иные ключи (`sessionStorage` и т.д.) — по поиску `sessionStorage` / `localStorage` в `src/`.

## Параметры Pixel Streaming

Источник: `new Config({ initialSettings: { ... } })` и последующие вызовы `setOptionSettingValue` в **`src/components/PixelStreaming.vue`**. Значения ниже — **как заданы в проекте** (не дефолты библиотеки).

### Подключение и автозапуск

| Параметр | Значение | Назначение |
|----------|----------|------------|
| `ss` | из поля ввода (по умолчанию UI `ws://localhost:80`) | URL сигнального сервера (WebSocket) |
| `AutoPlayVideo` | `true` | Автовоспроизведение видео после подключения |
| `AutoConnect` | `true` | Автоподключение при загрузке страницы |
| `ss_autoconnect` | `true` | Доп. флаг автоподключения к SS |
| `StreamerAutoJoin` | `true` | Автоматически подключаться к стримеру |
| `WaitForStreamer` | `true` | Ждать появления стримера |

### Видео и аудио

| Параметр | Значение | Назначение |
|----------|----------|------------|
| `StartVideoMuted` | `false` | Старт без звука в видео |
| `HoveringMouse` | `false` | Показ «курсора при наведении» |
| `UseMic` | `false` | Микрофон в сторону UE |
| `UseAudio` | `false` | Воспроизведение аудио из стрима |
| `VideoScalingFactor` | `1.0` | Масштаб разрешения видео (1.0 = 100%) |
| `KeyframeInterval` | `500` | Интервал ключевых кадров, мс |

### Кодеки

| Параметр | Значение | Назначение |
|----------|----------|------------|
| `PreferH264` | `true` | Предпочитать H.264 |
| `ForceH264` | `false` | Принудительно только H.264 |
| `PreferVP8` | `false` | Предпочитать VP8 |
| `PreferVP9` | `false` | Предпочитать VP9 |

### Сеть и битрейт

| Параметр | Значение | Назначение |
|----------|----------|------------|
| `ForceTURN` | `false` | Принудительно через TURN |
| `ForceMONO` | `false` | Принудительно моно-аудио |
| `MinBitrate` | `100` | Нижняя граница битрейта (единицы — как в библиотеке Epic) |
| `MaxBitrate` | `100000` | Верхняя граница битрейта |
| `LowBitrateTimeoutMs` | `1000` | Таймаут сценария «низкий битрейт», мс |
| `WebRTCFPS` | `60` | Ограничение FPS WebRTC |

### Ввод: мышь, тач, клавиатура, XR

| Параметр | Значение | Назначение |
|----------|----------|------------|
| `FakeMouseWithTouches` | `true` | Эмуляция мыши из тач-событий |
| `SuppressBrowserKeys` | `true` | Подавлять системные горячие клавиши браузера |
| `IsQualityController` | `false` | Клиент как контроллер качества |
| `TouchScreenInput` | `true` | Ввод с тач-экрана |
| `GamepadInput` | `false` | Ввод с геймпада |
| `XRControllerInput` | `false` | XR-контроллеры |

### Разрешение и задержка

| Параметр | Значение | Назначение |
|----------|----------|------------|
| `MatchViewportResolution` | `true` | Подгонка под размер viewport |
| `MaxLatency` | `200` | Верхняя граница задержки, мс |
| `MinLatency` | `0` | Нижняя граница задержки, мс |

### Логи, переподключение, сервис

| Параметр | Значение | Назначение |
|----------|----------|------------|
| `LogLevel` | `"Error"` | Уровень логов: `Verbose` / `Info` / `Warning` / `Error` / `None` |
| `TimeoutIfIdle` | `false` | Таймаут при простое |
| `MaxReconnectAttempts` | `3` | Число попыток переподключения |
| `AFKTimeout` | `0` | AFK-таймаут, с (0 = выкл.) |
| `PrintStats` | `false` | Печать статистики в консоль |
| `ShowTextOverlays` | `false` | Текстовые оверлеи поверх стрима |

### Доп. опции WebRTC (`setOptionSettingValue('WebRTC', …)`)

Применяется после создания `PixelStreaming`, если доступен `config.setOptionSettingValue`:

| Ключ | Значение | Назначение |
|------|----------|------------|
| `DegradationPreference` | `maintain-framerate` | Поведение при деградации (приоритет FPS) |
| `MaxFPS` | `60` | Макс. FPS кодирования/потока |
| `MinQP` | `1` | Мин. квантователь |
| `MaxQP` | `100` | Макс. квантователь |

Подбор значений под телефоны/планшеты/ПК — в комментариях в том же файле (`PixelStreaming.vue`, блок «ПРИМЕЧАНИЯ ПО ОПТИМИЗАЦИИ»). Расширенная шпаргалка: **`docs/PIXEL_STREAMING_SETTINGS_CHEATSHEET.md`**.

## Документация в репозитории

- **`docs/`** — оптимизация планшетов, задержка, настройки PS, тесты pointer events.
- **`MIRROR_CLICK_STRATEGY.md`** — стратегия зеркала и кликов.
- **`BRANCH_WORKFLOW_NOTE.md`** — заметка по веткам (не мержить без осознанного решения).

## Требования

Node.js **18+**, запущенные UE + Signalling Server, корректный **ws://** или **wss://** URL в клиенте.


## Ссылка на Github

https://github.com/SergeyYasenko/PixelStreamingMenu