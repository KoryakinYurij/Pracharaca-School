# Настройка окружения

## Playwright (глобальная установка)

Playwright уже установлен **глобально** в системе:

- **CLI**: `~/.nvm/versions/node/v24.13.0/bin/playwright`
- **Браузеры**: `~/.cache/ms-playwright/` (Chromium, Firefox, WebKit)
- **Версия**: 1.58.2

### ⚠️ Важно

**НЕ устанавливать Playwright локально:**

```bash
# ❌ НЕ ДЕЛАТЬ:
npm install playwright
npx playwright install chrome  # Требует sudo, упадёт с ошибкой
```

### Правильное использование

```bash
# Использовать глобальный playwright
playwright screenshot http://localhost:5173 screenshot.png

# Или через npx (найдёт глобальный)
npx playwright screenshot http://localhost:5173 screenshot.png
```

### Скрипты для скриншотов

Если нужен скрипт — создавай `.js` файл и запускай через Node.js:

```javascript
// screenshot.js
const { chromium } = require('playwright')

(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('http://localhost:5173')
  await page.screenshot({ path: 'screenshot.png', fullPage: true })
  await browser.close()
})()
```

```bash
node screenshot.js
```

Playwright автоматически использует браузеры из `~/.cache/ms-playwright/`.
