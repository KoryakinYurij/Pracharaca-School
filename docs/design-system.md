# Визуальный стиль и дизайн-система

## Философия "Sophisticated / Noble"

- Много воздуха, тонкие разделители, мягкие тени, тонкие рамки
- Никаких кричащих градиентов, неона, тяжёлых теней

## Палитра

| Цвет | Tailwind | CSS Variable | Использование |
|------|----------|--------------|---------------|
| Ivory | `bg-ivory` | `--color-ivory` | Основной фон |
| Graphite | `text-graphite` | `--color-graphite` | Основной текст |
| Muted Gold | `text-gold` | `--color-gold` | Акценты (очень деликатно) |
| Gold Dark | `text-gold-dark` | `--color-gold-dark` | Ховеры |
| Panel | `bg-panel` | `--color-panel` | Подложки карточек |
| Border | `border-border` | `--color-border` | Разделители |

## Типографика

### Шрифты

- **Заголовки**: Playfair Display (serif)
- **Текст**: Inter (sans-serif)

### Настройка

Шрифты загружаются через `@fontsource`:

```typescript
// src/main.tsx
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/playfair-display/500.css'
import '@fontsource/playfair-display/700.css'
```

### Tailwind классы

```javascript
// tailwind.config.js
fontFamily: {
  body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  display: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
}
```

Использование:
- `font-display` — для заголовков
- `font-body` — для основного текста (по умолчанию)

## Тени

- `shadow-soft` — мягкая тень для плавающих элементов
- `shadow-card` — тень для карточек

## Радиусы

- `rounded-xl2` (1.25rem) — для крупных элементов
