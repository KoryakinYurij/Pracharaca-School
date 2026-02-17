---
name: playwright-global
description: Fallback when local Playwright is missing, fails to install, or browsers are not found. Uses pre-installed global Playwright from ~/.nvm/versions/node/v24.13.0/bin/playwright with browsers at ~/.cache/ms-playwright/
---

## When to use me

Use this skill when:
- `npx playwright` fails with "command not found"
- `npx playwright install chrome` fails with "sudo required" or permission errors
- Playwright MCP cannot find browsers locally
- Local `node_modules/playwright` is missing or broken
- You see errors like "Executable doesn't exist" or "Cannot find module 'playwright'"

## Global Installation Details

**Already installed in this environment:**
```
CLI: ~/.nvm/versions/node/v24.13.0/bin/playwright
Browsers: ~/.cache/ms-playwright/
  - chromium-1208/
  - firefox-1509/
  - webkit-2248/
Version: 1.58.2
```

## How to use

### Option 1: Direct CLI (simplest)
```bash
# Screenshot any URL
playwright screenshot <url> screenshot.png

# Example with viewport
playwright screenshot --viewport-size="390,844" <url> mobile.png
```

### Option 2: npx (uses global if available)
```bash
npx playwright screenshot <url> screenshot.png
```

### Option 3: Node.js script
```javascript
const { chromium } = require('playwright');
// ... your code
```

**Run with NODE_PATH:**
```bash
NODE_PATH=~/.nvm/versions/node/v24.13.0/lib/node_modules node your-script.js
```

## What NOT to do

❌ **Do NOT run:**
```bash
npx playwright install chrome      # Requires sudo, will fail
npx playwright install-deps        # Requires sudo, will fail
npm install playwright             # Not needed, use global
```

## Quick test

Verify global Playwright works:
```bash
which playwright                   # Should show: ~/.nvm/versions/node/v24.13.0/bin/playwright
playwright --version               # Should show: Version 1.58.2
ls ~/.cache/ms-playwright/         # Should show: chromium-1208, firefox-1509, etc.
```

## Complete example

Taking screenshots for visual verification:
```bash
# After starting your dev server:
playwright screenshot http://localhost:<port> homepage.png
playwright screenshot --viewport-size="390,844" http://localhost:<port> mobile.png
```

For interactive pages (accordions, etc.), use Node.js with page.click() and page.waitForTimeout().
