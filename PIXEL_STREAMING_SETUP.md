# Настройка Pixel Streaming

## Шаг 1: Настройка Unreal Engine

1. **Включите плагин Pixel Streaming**
   - Откройте ваш проект в Unreal Engine
   - Перейдите в Edit → Plugins
   - Найдите и включите "Pixel Streaming"
   - Перезапустите редактор

2. **Настройте проект для упаковки**
   - Edit → Project Settings → Pixel Streaming
   - Убедитесь что настройки правильные

3. **Упакуйте проект**
   - File → Package Project → Windows (или другая платформа)
   - Выберите папку для сборки

## Шаг 2: Запуск Signalling Server

### Для UE 5.x:

Сигнальный сервер находится в папке:
```
Engine/Source/Programs/PixelStreaming/WebServers/SignallingWebServer
```

Запустите командой:
```bash
# Windows
run.bat

# Linux/Mac
./run.sh
```

По умолчанию сервер запустится на порту 80 (HTTP) и 443 (HTTPS).

### Изменение порта:

Отредактируйте `run.bat` или `run.sh` и добавьте параметр:
```bash
node cirrus.js --httpPort=8888
```

## Шаг 3: Запуск UE приложения

Запустите упакованное приложение с параметрами:

```bash
YourApp.exe -PixelStreamingURL=ws://localhost:80
```

Или для другого порта:
```bash
YourApp.exe -PixelStreamingURL=ws://localhost:8888
```

Дополнительные полезные параметры:
```bash
-RenderOffScreen           # Рендеринг без окна
-ForceRes                  # Принудительное разрешение
-ResX=1920 -ResY=1080      # Установка разрешения
-PixelStreamingIP=0.0.0.0  # Привязка к IP
-PixelStreamingPort=8888   # Порт для подключения
```

## Шаг 4: Запуск Vue приложения

```bash
npm run dev
```

Откройте браузер по адресу `http://localhost:5173`

## Шаг 5: Подключение

1. В интерфейсе введите URL сигнального сервера
2. Формат: `ws://IP:PORT` или `wss://IP:PORT` (для HTTPS)
3. Нажмите "Подключиться"

## Примеры конфигураций

### Локальная разработка
```
Signalling Server: ws://localhost:80
UE App: -PixelStreamingURL=ws://localhost:80
Vue App: http://localhost:5173
```

### Развертывание в локальной сети
```
Signalling Server: ws://192.168.1.100:8888
UE App: -PixelStreamingURL=ws://192.168.1.100:8888
Vue App: http://192.168.1.100:5173
```

### Продакшен (с SSL)
```
Signalling Server: wss://yourdomain.com:443
UE App: -PixelStreamingURL=wss://yourdomain.com:443
Vue App: https://yourdomain.com
```

## Troubleshooting

### Ошибка подключения WebSocket

**Проблема:** WebSocket connection failed

**Решение:**
1. Проверьте что Signalling Server запущен
2. Проверьте порты в firewall
3. Убедитесь что UE приложение подключено к серверу
4. Проверьте логи Signalling Server

### UE приложение не подключается

**Проблема:** Приложение запускается но не подключается к серверу

**Решение:**
1. Проверьте параметр `-PixelStreamingURL`
2. Убедитесь что Signalling Server запущен ДО запуска UE приложения
3. Проверьте логи UE приложения (Output Log)

### Черный экран в браузере

**Проблема:** Подключение успешно, но видео не показывается

**Решение:**
1. Проверьте что UE приложение действительно рендерит
2. Отключите плагины блокировки рекламы
3. Разрешите автовоспроизведение в браузере
4. Попробуйте другой браузер (рекомендуется Chrome/Edge)

### Высокая задержка или лаги

**Проблема:** Изображение тормозит или задержка большая

**Решение:**
1. Проверьте качество сети
2. Снизьте разрешение рендеринга в UE
3. Оптимизируйте настройки Pixel Streaming в UE
4. Используйте проводное соединение вместо WiFi

## Полезные команды

### Проверка подключения к Signalling Server
```bash
curl http://localhost:80
```

### Просмотр логов Node.js сервера
Логи будут отображаться в консоли где запущен `run.bat/run.sh`

### Тестирование WebSocket
Используйте браузерную консоль:
```javascript
const ws = new WebSocket('ws://localhost:80');
ws.onopen = () => console.log('Connected!');
ws.onerror = (e) => console.error('Error:', e);
```

## Дополнительные ресурсы

- [Официальная документация UE Pixel Streaming](https://docs.unrealengine.com/5.0/en-US/pixel-streaming-in-unreal-engine/)
- [GitHub Epic Games Pixel Streaming](https://github.com/EpicGames/PixelStreamingInfrastructure)
- [Форум Unreal Engine](https://forums.unrealengine.com/)

