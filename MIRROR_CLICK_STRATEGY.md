# Как сделать “реверс клика” при зеркалировании Pixel Streaming (для переноса в другой проект)

Этот документ описывает стратегию, которую мы уже применяли:

1. **Зеркалить видео** в CSS (`scaleX(-1)`)
2. **Перехватывать mouse-события** на `video` и **инвертировать X-координату** (`clientX`)
3. Делать перехват **только после появления `<video>` в DOM**, используя `MutationObserver`

Цель: визуально зеркальная картинка, но логика кликов/мыши для UE остаётся корректной.

---

## 1) Зеркалим картинку (видео слой)

В стиле (где лежит `video`), добавляем:

```css
.video-container :deep(video) {
  transform: scaleX(-1);
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
```

> Важно: UI поверх видео должен быть “интерактивным”, а видео — нижним слоем (через `z-index` и `pointer-events` по необходимости).

---

## 2) Почему “просто transform” ломает клики

При зеркалировании браузер отдаёт координаты мыши **в визуальной системе** (уже отзеркаленной).  
UE/логика клика ожидает координаты как будто сцена не зеркалена — поэтому нужно исправить X обратно.

---

## 3) Стратегия перехвата: MutationObserver + capture listener

Видео в Pixel Streaming появляется **не сразу** после `connect`, поэтому слушатели нужно навешивать, когда `<video>` уже существует.

Используем `MutationObserver`, который ждёт `video`, затем:

- ставит обработчики на `video` в **capture phase** (`addEventListener(..., true)`)
- внутри каждого обработчика:
  - `preventDefault()`
  - `stopImmediatePropagation()`
  - создаёт новое событие `MouseEvent` с инвертированным `clientX`
  - метит `newEvent.inverted = true`, чтобы не зациклиться

---

## 4) Инверсия `clientX` относительно ширины video

Алгоритм:

1. берём `rect = target.getBoundingClientRect()`
2. вычисляем `relativeX = event.clientX - rect.left`
3. `invertedX = rect.width - relativeX`
4. новый `clientX = rect.left + invertedX`

---

## 5) Паттерн кода (переносимый)

### 5.1) Функция инверсии

```js
const invertMouseCoordinates = (event) => {
  const target = event.target;
  const rect = target.getBoundingClientRect();
  const relativeX = event.clientX - rect.left;
  const invertedX = rect.width - relativeX;

  return {
    clientX: rect.left + invertedX,
    clientY: event.clientY,
  };
};
```

### 5.2) Установка перехвата на `video` (после появления в DOM)

```js
const setupMouseInterception = () => {
  const observer = new MutationObserver(() => {
    const video = videoContainer.value?.querySelector("video");

    if (video && !video.dataset.intercepted) {
      video.dataset.intercepted = "true";

      const events = ["mousedown", "mouseup", "mousemove", "click", "dblclick"];

      events.forEach((eventType) => {
        video.addEventListener(
          eventType,
          (e) => {
            if (e.inverted) return;

            e.preventDefault();
            e.stopImmediatePropagation();

            const inverted = invertMouseCoordinates(e);

            const newEvent = new MouseEvent(eventType, {
              bubbles: e.bubbles,
              cancelable: e.cancelable,
              view: e.view,
              detail: e.detail,
              screenX: e.screenX,
              screenY: e.screenY,
              clientX: inverted.clientX,
              clientY: inverted.clientY,
              ctrlKey: e.ctrlKey,
              altKey: e.altKey,
              shiftKey: e.shiftKey,
              metaKey: e.metaKey,
              button: e.button,
              buttons: e.buttons,
              relatedTarget: e.relatedTarget,
            });

            newEvent.inverted = true;
            video.dispatchEvent(newEvent);
          },
          true // capture phase
        );
      });

      observer.disconnect();
    }
  });

  if (videoContainer.value) {
    observer.observe(videoContainer.value, { childList: true, subtree: true });
  }
};
```

### 5.3) Вызов после подключения

Вешаем обработчик после `webRtcConnected`:

```js
ps.addEventListener("webRtcConnected", () => {
  setupMouseInterception();
});
```

---

## 6) Типичные причины, почему “не работает”

1. Обработчики навешиваются **слишком рано** (до появления `video`)
2. Не стоит `e.stopImmediatePropagation()` → старые слушатели перехватывают “неинвертированное” событие
3. Нет метки `newEvent.inverted` → бесконечная рекурсия/зацикливание
4. Инвертируем “не то”: нужно именно `clientX` относительно `rect.width`
5. Слушатели не в capture phase → оригинальный обработчик срабатывает раньше

---

## 7) Touch-устройства

В нашем проекте мы держали:
- `FakeMouseWithTouches: true`

Это помогает, чтобы тач-события преобразовывались к логике, похожей на mouse, и перехват работал стабильно.

---

## 8) Что нужно перенести в новый проект

Переносится 3 части:

1. CSS зеркала на `<video>`: `transform: scaleX(-1)`
2. Функция `invertMouseCoordinates(event)`
3. `MutationObserver` + `addEventListener(..., true)` на `video`
4. Вызов `setupMouseInterception()` после `webRtcConnected`

Если эти 4 пункта повторить — стратегия одинаково переносится в другой проект.

