# AGENTS.md — Noble Notes

Локальный статический сайт-конспект: темы → уроки → Q/A карточки-аккордеоны.

## Техстек (фиксировано)

- Vite + React 19 + TypeScript
- TailwindCSS + Framer Motion
- lucide-react (иконки)
- react-router-dom (роутинг)
- Three.js + @react-three/fiber (декоративный фон)
- @fontsource/inter + @fontsource/playfair-display (шрифты)
- npm
- clsx (утилита условных классов)
- Доп. зависимости добавлять только при реальной необходимости

## Команды

```bash
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint     # eslint
```

## Структура проекта

- `/` — список тем
- `/topic/:slug` — тема + список уроков
- `/topic/:slug/lesson/:lessonSlug` — урок с карточками
- `/kitchen-sink` — DEV-only демо всех компонентов (доступно только при `import.meta.env.DEV`, недоступно в preview/prod)
- `content/topics/<slug>/meta.json` — метаданные темы
- `content/topics/<slug>/lessons/*.json` — уроки и карточки

## Детальные руководства

- [Визуальный стиль и дизайн-система](./docs/design-system.md) — палитра (ivory/graphite/gold), Tailwind-токены, типографика (Playfair Display / Inter), настройка @fontsource, тени и радиусы
- [UX-паттерны и доступность](./docs/ux-patterns.md) — поведение аккордеонов, aria-атрибуты, focus-стили, тач-таргеты, адаптив, HTML-семантика (lang="ru")
- [Анимации и переходы](./docs/animations.md) — роут-переходы через AnimatePresence, fade + y-shift, prefers-reduced-motion, CSS Grid аккордеон
- [Three.js фон](./docs/threejs-background.md) — позиционирование (fixed, z-index, pointer-events), оптимизация (dpr, antialias, 30fps), low-poly стиль, reduced-motion
- [Ограничения и запреты](./docs/constraints.md) — что НЕ добавлять (поиск, прогресс, аккаунты), визуальные запреты (неон, градиенты), layout-правила (bg-ivory/80 + blur вместо сплошной заливки)
- [Настройка окружения](./docs/dev-setup.md) — Playwright глобальный (НЕ устанавливать локально), пути, команды для скриншотов
- [Структура контента](./docs/content-schema.md) — JSON-схема meta.json и lessons/*.json, типы секций (kind), ссылка на [CONTENT_GUIDE.md](./CONTENT_GUIDE.md)

## Definition of Done

- `npm install && npm run dev` запускается без ошибок
- Код типизирован
- Нет ошибок линтера
