# UX-паттерны и доступность

## Карточки-аккордеоны (Q/A)

### Поведение

- **Закрытая карточка**: по клику на весь заголовок открывается
- **Несколько открытых**: можно держать открытыми несколько карточек одновременно
- **Анимация**: плавное раскрытие через CSS Grid (grid-template-rows 0fr→1fr, 700ms)

### Доступность

Обязательные атрибуты:

```tsx
<article className="noble-card overflow-hidden">
  <button
    type="button"
    aria-expanded={isOpen}
    aria-controls={contentId}
    onClick={() => setIsOpen((prev) => !prev)}
    className="focus-ring ..."
  >
    <span>{/* Вопрос */}</span>
    <ChevronDown aria-hidden="true" />
  </button>

  <div
    id={contentId}
    className="accordion-content"
    data-open={isOpen}
  >
    <div className="overflow-hidden">
      {/* Ответ */}
    </div>
  </div>
</article>
```

### Фокус-стили

```css
/* Обязательные focus styles */
button:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
}
```

## HTML семантика

### Обязательные атрибуты

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Название темы — Noble Notes</title>
</head>
```

- `lang="ru"` — обязательно для русскоязычного контента
- `<title>` — должен отражать текущую тему/урок

## Адаптив

### Мобильные устройства

- Крупные тач-таргеты (минимум 44×44px для интерактивных элементов)
- Достаточные отступы между карточками
- Читаемый размер текста (минимум 16px)

### Планшеты и десктоп

- Максимальная ширина контента: ~65 символов на строку
- Центрирование контента с отступами по краям
