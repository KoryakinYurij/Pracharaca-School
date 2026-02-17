# Three.js фон

## Концепция

Three.js используется как **декоративный слой** — фон, который не мешает чтению контента.

## Позиционирование

```tsx
<div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
  <Canvas
    dpr={[1, 1.5]}
    frameloop="demand"
    camera={{ position: [0, 0, 9], fov: 48, near: 0.1, far: 30 }}
    gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
  >
    {/* Сцена */}
  </Canvas>
</div>
```

- `fixed inset-0` — на весь экран (на wrapper div)
- `z-0` — ниже контента (контент находится выше по оси Z)
- `pointer-events-none` — клики проходят сквозь (класс, не inline style)
- `aria-hidden="true"` — скрыто от скринридеров

## Визуальные характеристики

- **Контраст**: низкий (фон едва заметен)
- **Движение**: медленное, почти медитативное
- **Цвета**: без ярких цветов, неона, сильных бликов
- **Формы**: low-poly, простые геометрии

## Оптимизация (обязательно)

```tsx
<Canvas
  dpr={[1, 1.5]}                    // max DPR 1.5
  frameloop="demand"
  gl={{ 
    antialias: false,               // отключить
    alpha: true,
    powerPreference: 'high-performance'
  }}
>
```

### Троттлинг кадров

- Canvas использует `frameloop="demand"` (рендер только по запросу).
- Кадры запрашиваются через `window.setInterval(() => invalidate(), 1000 / TARGET_FPS)` в BackgroundShapes.
- При `reduced-motion`: однократный `invalidate()` для статичного рендера, без интервала.

## Доступность

### prefers-reduced-motion

Используется хук `useReducedMotion()` из `framer-motion`.

```tsx
const prefersReducedMotion = useReducedMotion()

// При включённой настройке:
// - Однократный invalidate() для статичного рендера фигур
// - Анимационный цикл (setInterval) не запускается
```

## Запреты

- ❌ Не использовать postprocessing (bloom, DOF и т.д.)
- ❌ Не добавлять particles-библиотеки
- ❌ Не делать яркие/резкие движения
- ❌ Не перекрывать контент сплошной заливкой (использовать `ivory/80` + blur для подложек)
