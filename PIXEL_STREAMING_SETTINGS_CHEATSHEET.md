# Pixel Streaming - Шпаргалка по настройкам

## 🎮 Основные параметры

### Подключение
```javascript
ss: "ws://localhost:80"     // WebSocket URL
AutoPlayVideo: true         // Автостарт видео
AutoConnect: true           // Автоподключение
```

### Кодек
```javascript
PreferH264: true            // H.264 (лучшая совместимость)
ForceH264: true             // Принудительно H.264
PreferVP8: false            // VP8 (для старых браузеров)
PreferVP9: false            // VP9 (новейший, но меньше поддержка)
```

### Битрейт
```javascript
MinBitrate: 500000          // 500 kbps минимум
MaxBitrate: 8000000         // 8 Mbps максимум
WebRTCMinBitrate: 500000    // WebRTC минимум
WebRTCMaxBitrate: 8000000   // WebRTC максимум
```

### Видео
```javascript
VideoScalingFactor: 1.0     // 1.0 = 100%, 0.75 = 75%
WebRTCFPS: 30               // FPS (30 для мобильных, 60 для ПК)
KeyframeInterval: 1000      // I-frames каждую секунду
MatchViewportResolution: true // Подстройка под экран
```

### Аудио
```javascript
UseAudio: false             // Использовать аудио
UseMic: false               // Использовать микрофон
StartVideoMuted: false      // Старт без звука
ForceMONO: false            // Моно аудио
```

### Управление
```javascript
HoveringMouse: true         // Курсор при наведении
FakeMouseWithTouches: true  // Эмуляция мыши тачем
TouchScreenInput: true      // Поддержка тача
GamepadInput: false         // Поддержка геймпада
SuppressBrowserKeys: true   // Блокировка горячих клавиш
```

### Отладка
```javascript
LogLevel: "Error"           // Verbose|Info|Warning|Error|None
PrintStats: false           // Статистика в консоль
ShowTextOverlays: false     // Текстовые оверлеи
```

### Сеть
```javascript
ForceTURN: false            // Принудительно TURN сервер
MaxReconnectAttempts: 3     // Попытки переподключения
MaxLatency: 200             // Макс задержка (мс)
MinLatency: 0               // Мин задержка (мс)
```

### Дополнительно
```javascript
StreamerAutoJoin: true      // Автоподключение к стримеру
WaitForStreamer: true       // Ждать стример
TimeoutIfIdle: false        // Таймаут при бездействии
AFKTimeout: 0               // Таймаут AFK (0 = выкл)
IsQualityController: false  // Управление качеством
XRControllerInput: false    // VR/AR контроллеры
```

---

## 📱 Профили устройств

### Телефон
```javascript
{
   MinBitrate: 300000,
   MaxBitrate: 5000000,
   VideoScalingFactor: 0.75,
   WebRTCFPS: 30,
   KeyframeInterval: 1500,
   MatchViewportResolution: true
}
```

### Планшет
```javascript
{
   MinBitrate: 500000,
   MaxBitrate: 8000000,
   VideoScalingFactor: 1.0,
   WebRTCFPS: 30,
   KeyframeInterval: 1000,
   MatchViewportResolution: true
}
```

### Десктоп
```javascript
{
   MinBitrate: 1000000,
   MaxBitrate: 20000000,
   VideoScalingFactor: 1.0,
   WebRTCFPS: 60,
   KeyframeInterval: 2000,
   MatchViewportResolution: false
}
```

---

## 🔥 Решение проблем

### Картинка не обновляется
```javascript
KeyframeInterval: 500        // ⬇️ Уменьшить интервал
PrintStats: true             // ✅ Включить статистику
LogLevel: "Info"             // ✅ Включить логи
```

### Низкий FPS
```javascript
WebRTCFPS: 24               // ⬇️ Снизить FPS
VideoScalingFactor: 0.75    // ⬇️ Уменьшить разрешение
MaxBitrate: 5000000         // ⬇️ Снизить битрейт
```

### Артефакты на видео
```javascript
MinBitrate: 1000000         // ⬆️ Повысить битрейт
KeyframeInterval: 500       // ⬇️ Чаще I-frames
PreferVP8: true             // 🔄 Сменить кодек
ForceH264: false
```

### Проблемы с H.264
```javascript
PreferH264: false
ForceH264: false
PreferVP8: true             // 🔄 Переключить на VP8
```

### Высокая задержка
```javascript
MinLatency: 0
MaxLatency: 100             // ⬇️ Снизить макс задержку
WebRTCFPS: 24               // ⬇️ Снизить FPS
```

### Не подключается
```javascript
LogLevel: "Verbose"         // ✅ Полные логи
WaitForStreamer: true       // ✅ Ждать стример
MaxReconnectAttempts: 5     // ⬆️ Больше попыток
ForceTURN: true             // ✅ Попробовать TURN
```

---

## 📊 Мониторинг

### Включить полную отладку
```javascript
{
   LogLevel: "Verbose",
   PrintStats: true,
   ShowTextOverlays: true
}
```

### Chrome DevTools
```
chrome://webrtc-internals    // Статистика WebRTC
```

### Консольные логи
```javascript
// Мониторинг WebRTC статистики
console.warn("⚠️ Планшет не получает кадры:", videoStats)
```

---

## 🎯 Критичные для планшетов

| Параметр | Значение | Важность |
|----------|----------|----------|
| `KeyframeInterval` | 1000 | 🔴 Критично |
| `MatchViewportResolution` | true | 🔴 Критично |
| `WebRTCFPS` | 30 | 🟡 Важно |
| `MinBitrate` | 500000 | 🟡 Важно |
| `MaxBitrate` | 8000000 | 🟡 Важно |
| `VideoScalingFactor` | 1.0 | 🟢 Желательно |

---

## 📝 Где находятся настройки

**Файл:** `src/components/PixelStreaming.vue`

**Строки:** 156-289 (Config initialSettings)

**Формат:**
```javascript
const config = new Config({
   initialSettings: {
      SettingName: value, // Описание (default: defaultValue)
      // ...
   }
});
```

---

## 🆘 Быстрая помощь

1. **Картинка замерла?** → `KeyframeInterval: 500`
2. **Лагает?** → `WebRTCFPS: 24`, `VideoScalingFactor: 0.75`
3. **Артефакты?** → `MinBitrate: 1000000`, `MaxBitrate: 10000000`
4. **Не подключается?** → `LogLevel: "Verbose"`, проверь консоль
5. **H.264 не работает?** → `PreferVP8: true`, `ForceH264: false`

---

**Документация:** `TABLET_OPTIMIZATION_NOTES.md`

