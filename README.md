# Noble Notes

Локальный статический сайт-конспект в стиле **Sophisticated / Noble**: темы, уроки и Q/A карточки-аккордеоны.

## Стек

- Vite + React + TypeScript
- TailwindCSS
- Framer Motion
- lucide-react
- react-router-dom
- three + @react-three/fiber
- @fontsource/inter + @fontsource/playfair-display

## Визуальные эффекты

- Декоративный Three.js фон (low-poly фигуры) работает как фоновый слой и не мешает чтению.
- Оптимизация фона: `dpr` до `1.5`, `antialias: false`, `powerPreference: "high-performance"`, обновление кадров около `30fps`.
- При `prefers-reduced-motion` фон становится статичным/почти статичным.
- Переходы между страницами выполнены через `AnimatePresence`: мягкий `fade` и небольшой `y`-shift.

## Локальный запуск

```bash
npm install
npm run dev
```

Сайт откроется на `http://localhost:5173`.

## Структура

- `/` — список тем
- `/topic/:slug` — тема и список уроков
- `/topic/:slug/lesson/:lessonSlug` — урок с карточками вопрос/ответ
- `/kitchen-sink` — DEV-only демо всех компонентов (доступно только при `import.meta.env.DEV`, недоступно в preview/prod)
- `content/topics/<slug>/meta.json` — метаданные темы
- `content/topics/<slug>/lessons/*.json` — уроки и карточки

## Контент

Подробные правила по структуре уроков и карточек: `CONTENT_GUIDE.md`.

Схема секций ответа расширена:
- `body` для обычного текста
- `items` для списков (`steps`, `checklist`, `references`)
- `pairs` для терминов (`definition`)
- `columns` для колонок (`dosdonts`, `compare`)
- `table` для табличного сравнения (`compare`)

Основные файлы для редактирования уроков: `content/topics/<slug>/lessons/*.json`.
