const fs = require('fs')
const path = require('path')
const { chromium, devices } = require('playwright')

const BASE_URL = 'http://localhost:5173'
const TOPIC_URL = `${BASE_URL}/topic/krasivyi-konspekt`
const LESSON_URL = `${BASE_URL}/topic/krasivyi-konspekt/lesson/noble-basics`
const EVIDENCE_DIR = path.resolve(process.cwd(), '.sisyphus/evidence/final-qa')

const SELECTORS = {
  topicFirst: 'section[aria-label="Темы"] li:nth-of-type(1) a',
  lessonFirst: 'section[aria-label="Список уроков"] a',
  qaSection: 'section[aria-label="Карточки вопрос-ответ"]',
  qaFirstButton: 'section[aria-label="Карточки вопрос-ответ"] article:nth-of-type(1) button',
  qaCards: 'section[aria-label="Карточки вопрос-ответ"] article',
  backLink: 'a[href^="/topic/"]',
}

fs.mkdirSync(EVIDENCE_DIR, { recursive: true })

const scenarioResults = []

const writeJson = (fileName, data) => {
  const filePath = path.join(EVIDENCE_DIR, fileName)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  return filePath
}

const monotonicNowMs = () => Number(process.hrtime.bigint() / 1000000n)

const toFileName = (filePath) => path.basename(filePath)

const parsePx = (value) => {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}

const pngByteDiffRatio = (bufferA, bufferB) => {
  const length = Math.min(bufferA.length, bufferB.length)
  if (length === 0) {
    return 0
  }

  let differentBytes = 0
  for (let index = 0; index < length; index += 1) {
    if (bufferA[index] !== bufferB[index]) {
      differentBytes += 1
    }
  }

  return differentBytes / length
}

const pushResult = ({
  task,
  scenario,
  category,
  passed,
  evidence,
  details,
  error,
}) => {
  scenarioResults.push({
    task,
    scenario,
    category,
    status: passed ? 'PASS' : 'FAIL',
    evidence,
    details,
    error,
    recordedAt: new Date().toISOString(),
  })
}

const withScenario = async (meta, runScenario) => {
  try {
    const output = await runScenario()
    pushResult({
      ...meta,
      passed: output.passed,
      evidence: output.evidence,
      details: output.details,
      error: null,
    })
  } catch (error) {
    pushResult({
      ...meta,
      passed: false,
      evidence: [],
      details: null,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

const gatherConsoleErrors = (page, errors) => {
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text())
    }
  })
  page.on('pageerror', (err) => {
    errors.push(err.message)
  })
}

const gotoFirstLesson = async (page) => {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' })

  await page.locator(SELECTORS.topicFirst).first().waitFor({ state: 'visible' })
  await page.locator(SELECTORS.topicFirst).first().click()
  await page.waitForURL(/\/topic\//)

  await page.locator(SELECTORS.lessonFirst).first().waitFor({ state: 'visible' })
  await page.locator(SELECTORS.lessonFirst).first().click()
  await page.waitForURL(/\/lesson\//)
  await page.locator(SELECTORS.qaSection).first().waitFor({ state: 'visible' })
}

const getAnimatedStyleSnapshot = async (locator) => {
  return locator.evaluate((element) => {
    let node = element
    while (node && node !== document.body) {
      const style = window.getComputedStyle(node)
      if (style.transform !== 'none' || style.opacity !== '1') {
        return {
          nodeTag: node.tagName,
          opacity: Number.parseFloat(style.opacity),
          transform: style.transform,
          transitionDuration: style.transitionDuration,
          transitionTimingFunction: style.transitionTimingFunction,
        }
      }
      node = node.parentElement
    }

    const fallbackStyle = window.getComputedStyle(element)
    return {
      nodeTag: element.tagName,
      opacity: Number.parseFloat(fallbackStyle.opacity),
      transform: fallbackStyle.transform,
      transitionDuration: fallbackStyle.transitionDuration,
      transitionTimingFunction: fallbackStyle.transitionTimingFunction,
    }
  })
}

;(async () => {
  const browser = await chromium.launch({ headless: true })

  await withScenario(
    {
      task: 'Task 2',
      scenario: 'First QACard opens with emphasized state',
      category: 'integration',
    },
    async () => {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
      const page = await context.newPage()
      const consoleErrors = []
      gatherConsoleErrors(page, consoleErrors)

      await gotoFirstLesson(page)

      const firstButton = page.locator(SELECTORS.qaFirstButton).first()
      await firstButton.click()
      await page.waitForTimeout(250)

      const ariaExpanded = await firstButton.getAttribute('aria-expanded')
      const openCount = await page
        .locator('section[aria-label="Карточки вопрос-ответ"] article:nth-of-type(1) [data-open="true"]')
        .count()
      const firstCardOpacity = await page
        .locator('section[aria-label="Карточки вопрос-ответ"] article:nth-of-type(1)')
        .first()
        .evaluate((element) => Number.parseFloat(window.getComputedStyle(element).opacity))

      const screenshotPath = path.join(EVIDENCE_DIR, 'task-2-qacard-open.png')
      await page.screenshot({ path: screenshotPath, fullPage: false })

      await context.close()

      const passed =
        ariaExpanded === 'true' && openCount > 0 && firstCardOpacity >= 0.95 && consoleErrors.length === 0

      return {
        passed,
        evidence: [toFileName(screenshotPath)],
        details: {
          ariaExpanded,
          openCount,
          firstCardOpacity,
          consoleErrors,
        },
      }
    },
  )

  await withScenario(
    {
      task: 'Task 2',
      scenario: 'Rapid toggle does not break state',
      category: 'edge',
    },
    async () => {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
      const page = await context.newPage()
      const consoleErrors = []
      gatherConsoleErrors(page, consoleErrors)

      await gotoFirstLesson(page)

      const firstButton = page.locator(SELECTORS.qaFirstButton).first()
      const initialState = await firstButton.getAttribute('aria-expanded')
      if (initialState === 'true') {
        await firstButton.click()
        await page.waitForTimeout(120)
      }

      await firstButton.dblclick()
      await page.waitForTimeout(250)

      const finalState = await firstButton.getAttribute('aria-expanded')
      const openCount = await page
        .locator('section[aria-label="Карточки вопрос-ответ"] article:nth-of-type(1) [data-open="true"]')
        .count()

      const evidencePath = writeJson('task-2-qacard-rapid-toggle.json', {
        initialState,
        action: 'double-click from closed state',
        expectedFinalState: 'false',
        finalState,
        openCount,
        consoleErrors,
      })

      await context.close()

      const passed = finalState === 'false' && openCount === 0 && consoleErrors.length === 0

      return {
        passed,
        evidence: [toFileName(evidencePath)],
        details: { initialState, finalState, openCount, consoleErrors },
      }
    },
  )

  await withScenario(
    {
      task: 'Task 3',
      scenario: 'Desktop hover visibly enhances affordance',
      category: 'integration',
    },
    async () => {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
      const page = await context.newPage()
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })

      const topicCard = page.locator(SELECTORS.topicFirst).first()
      await topicCard.waitFor({ state: 'visible' })
      const icon = topicCard.locator('svg').last()

      const transformBefore = await icon.evaluate((el) => window.getComputedStyle(el).transform)
      await topicCard.hover()
      await page.waitForTimeout(180)
      const transformAfter = await icon.evaluate((el) => window.getComputedStyle(el).transform)

      const screenshotPath = path.join(EVIDENCE_DIR, 'task-3-topic-hover.png')
      await page.screenshot({ path: screenshotPath, fullPage: false })

      await context.close()

      const passed = transformAfter !== 'none' && transformAfter !== transformBefore

      return {
        passed,
        evidence: [toFileName(screenshotPath)],
        details: { transformBefore, transformAfter },
      }
    },
  )

  await withScenario(
    {
      task: 'Task 3',
      scenario: 'Touch navigation still works without hover dependency',
      category: 'edge',
    },
    async () => {
      const context = await browser.newContext({ ...devices['iPhone 12'] })
      const page = await context.newPage()
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })

      const firstTopic = page.locator(SELECTORS.topicFirst).first()
      await firstTopic.waitFor({ state: 'visible' })
      await firstTopic.tap()

      await page.waitForURL(/\/topic\//)
      await page.locator('section[aria-label="Список уроков"]').first().waitFor({ state: 'visible' })
      const lessonsVisible = await page.locator('section[aria-label="Список уроков"]').first().isVisible()

      const screenshotPath = path.join(EVIDENCE_DIR, 'task-3-topic-touch.png')
      await page.screenshot({ path: screenshotPath, fullPage: false })

      await context.close()

      return {
        passed: lessonsVisible,
        evidence: [toFileName(screenshotPath)],
        details: { url: page.url(), lessonsVisible },
      }
    },
  )

  await withScenario(
    {
      task: 'Task 4',
      scenario: 'Lesson cards show refined hover response',
      category: 'integration',
    },
    async () => {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
      const page = await context.newPage()

      await page.goto(TOPIC_URL, { waitUntil: 'networkidle' })
      const firstLesson = page.locator(SELECTORS.lessonFirst).first()
      await firstLesson.waitFor({ state: 'visible' })
      const icon = firstLesson.locator('svg').last()

      const transformBefore = await icon.evaluate((el) => window.getComputedStyle(el).transform)
      await firstLesson.hover()
      await page.waitForTimeout(180)
      const transformAfter = await icon.evaluate((el) => window.getComputedStyle(el).transform)

      const screenshotPath = path.join(EVIDENCE_DIR, 'task-4-lesson-hover.png')
      await page.screenshot({ path: screenshotPath, fullPage: false })

      await context.close()

      const passed = transformAfter !== 'none' && transformAfter !== transformBefore

      return {
        passed,
        evidence: [toFileName(screenshotPath)],
        details: { transformBefore, transformAfter },
      }
    },
  )

  await withScenario(
    {
      task: 'Task 4',
      scenario: 'Tap works on narrow viewport without hover',
      category: 'edge',
    },
    async () => {
      const context = await browser.newContext({ ...devices['iPhone 12'] })
      const page = await context.newPage()
      await page.goto(TOPIC_URL, { waitUntil: 'networkidle' })

      const firstLesson = page.locator(SELECTORS.lessonFirst).first()
      await firstLesson.waitFor({ state: 'visible' })
      await firstLesson.tap()

      await page.waitForURL(/\/lesson\//)
      await page.locator(SELECTORS.qaSection).first().waitFor({ state: 'visible' })
      const qaVisible = await page.locator(SELECTORS.qaSection).first().isVisible()

      const screenshotPath = path.join(EVIDENCE_DIR, 'task-4-lesson-touch.png')
      await page.screenshot({ path: screenshotPath, fullPage: false })

      await context.close()

      return {
        passed: qaVisible,
        evidence: [toFileName(screenshotPath)],
        details: { url: page.url(), qaVisible },
      }
    },
  )

  await withScenario(
    {
      task: 'Task 5',
      scenario: 'Back affordance remains reachable during deep scroll',
      category: 'integration',
    },
    async () => {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
      const page = await context.newPage()
      await page.goto(LESSON_URL, { waitUntil: 'networkidle' })

      await page.evaluate(() => {
        window.scrollTo({ top: document.body.scrollHeight * 0.7, behavior: 'instant' })
      })
      await page.waitForTimeout(120)

      const backLink = page.locator(SELECTORS.backLink).first()
      await backLink.waitFor({ state: 'visible' })
      const box = await backLink.boundingBox()
      const viewport = page.viewportSize()
      const inViewport =
        Boolean(box) &&
        Boolean(viewport) &&
        box.y + box.height > 0 &&
        box.y < viewport.height &&
        box.x + box.width > 0 &&
        box.x < viewport.width

      const screenshotPath = path.join(EVIDENCE_DIR, 'task-5-sticky-back.png')
      await page.screenshot({ path: screenshotPath, fullPage: false })

      await backLink.click()
      await page.waitForURL(/\/topic\//)

      const detailsPath = writeJson('task-5-sticky-back.json', {
        backControlBoundingBox: box,
        inViewport,
        finalUrl: page.url(),
      })

      await context.close()

      const passed = inViewport && /\/topic\//.test(page.url())

      return {
        passed,
        evidence: [toFileName(screenshotPath), toFileName(detailsPath)],
        details: { inViewport, finalUrl: page.url() },
      }
    },
  )

  await withScenario(
    {
      task: 'Task 5',
      scenario: 'Mobile layout avoids overlap and clipping',
      category: 'edge',
    },
    async () => {
      const context = await browser.newContext({ ...devices['iPhone 12'] })
      const page = await context.newPage()
      await page.goto(LESSON_URL, { waitUntil: 'networkidle' })

      const backLink = page.locator(SELECTORS.backLink).first()
      const heading = page.locator('main h1').first()
      await backLink.waitFor({ state: 'visible' })
      await heading.waitFor({ state: 'visible' })

      const topBackBox = await backLink.boundingBox()
      const topHeadingBox = await heading.boundingBox()

      const topScreenshotPath = path.join(EVIDENCE_DIR, 'task-5-mobile-header.png')
      await page.screenshot({ path: topScreenshotPath, fullPage: false })

      await page.evaluate(() => {
        window.scrollTo({ top: 320, behavior: 'instant' })
      })
      await page.waitForTimeout(120)

      const scrolledBackBox = await backLink.boundingBox()
      const scrolledHeadingBox = await heading.boundingBox()
      const scrolledScreenshotPath = path.join(EVIDENCE_DIR, 'task-5-mobile-header-scrolled.png')
      await page.screenshot({ path: scrolledScreenshotPath, fullPage: false })

      const boxesOverlap = (a, b) => {
        if (!a || !b) {
          return true
        }

        return !(
          a.x + a.width < b.x ||
          b.x + b.width < a.x ||
          a.y + a.height < b.y ||
          b.y + b.height < a.y
        )
      }

      const overlapTop = boxesOverlap(topBackBox, topHeadingBox)
      const overlapScrolled = boxesOverlap(scrolledBackBox, scrolledHeadingBox)
      const detailsPath = writeJson('task-5-mobile-header-layout.json', {
        topBackBox,
        topHeadingBox,
        scrolledBackBox,
        scrolledHeadingBox,
        overlapTop,
        overlapScrolled,
      })

      await context.close()

      const passed = !overlapTop && !overlapScrolled

      return {
        passed,
        evidence: [
          toFileName(topScreenshotPath),
          toFileName(scrolledScreenshotPath),
          toFileName(detailsPath),
        ],
        details: { overlapTop, overlapScrolled },
      }
    },
  )

  await withScenario(
    {
      task: 'Task 6',
      scenario: 'Heading rhythm updated consistently',
      category: 'integration',
    },
    async () => {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
      const page = await context.newPage()
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })

      const cardHeading = page
        .locator('section[aria-label="Темы"] li:nth-of-type(1) h1, section[aria-label="Темы"] li:nth-of-type(1) h2, section[aria-label="Темы"] li:nth-of-type(1) h3')
        .first()
      await cardHeading.waitFor({ state: 'visible' })

      const cardHeadingStyles = await cardHeading.evaluate((element) => {
        const style = window.getComputedStyle(element)
        return {
          fontSize: style.fontSize,
          lineHeight: style.lineHeight,
          letterSpacing: style.letterSpacing,
        }
      })

      const cardShotPath = path.join(EVIDENCE_DIR, 'task-6-typography-home-heading.png')
      await cardHeading.screenshot({ path: cardShotPath })

      await page.goto(LESSON_URL, { waitUntil: 'networkidle' })
      const lessonHeading = page.locator('main h1').first()
      await lessonHeading.waitFor({ state: 'visible' })

      const lessonHeadingStyles = await lessonHeading.evaluate((element) => {
        const style = window.getComputedStyle(element)
        return {
          fontSize: style.fontSize,
          lineHeight: style.lineHeight,
          letterSpacing: style.letterSpacing,
        }
      })

      const lessonShotPath = path.join(EVIDENCE_DIR, 'task-6-typography-headings.png')
      await lessonHeading.screenshot({ path: lessonShotPath })

      const detailsPath = writeJson('task-6-typography-headings.json', {
        cardHeadingStyles,
        lessonHeadingStyles,
      })

      await context.close()

      const cardLineHeight = parsePx(cardHeadingStyles.lineHeight)
      const cardFontSize = parsePx(cardHeadingStyles.fontSize)
      const lessonLineHeight = parsePx(lessonHeadingStyles.lineHeight)
      const lessonFontSize = parsePx(lessonHeadingStyles.fontSize)

      const passed =
        cardLineHeight !== null &&
        cardFontSize !== null &&
        lessonLineHeight !== null &&
        lessonFontSize !== null &&
        cardLineHeight >= cardFontSize * 0.9 &&
        lessonLineHeight >= lessonFontSize * 0.9

      return {
        passed,
        evidence: [toFileName(lessonShotPath), toFileName(cardShotPath), toFileName(detailsPath)],
        details: {
          cardHeadingStyles,
          lessonHeadingStyles,
          cardLineHeight,
          cardFontSize,
          lessonLineHeight,
          lessonFontSize,
        },
      }
    },
  )

  await withScenario(
    {
      task: 'Task 6',
      scenario: 'Mobile readability remains acceptable',
      category: 'edge',
    },
    async () => {
      const context = await browser.newContext({ ...devices['iPhone 12'] })
      const page = await context.newPage()
      await page.goto(LESSON_URL, { waitUntil: 'networkidle' })

      const introParagraph = page.locator('main p').first()
      await introParagraph.waitFor({ state: 'visible' })

      const firstButton = page.locator(SELECTORS.qaFirstButton).first()
      await firstButton.click()
      await page.waitForTimeout(150)

      const answerParagraph = page
        .locator('section[aria-label="Карточки вопрос-ответ"] article:nth-of-type(1) p')
        .first()
      await answerParagraph.waitFor({ state: 'visible' })

      const introFontSize = await introParagraph.evaluate((element) =>
        Number.parseFloat(window.getComputedStyle(element).fontSize),
      )
      const answerFontSize = await answerParagraph.evaluate((element) =>
        Number.parseFloat(window.getComputedStyle(element).fontSize),
      )

      const detailsPath = writeJson('task-6-typography-mobile.json', {
        introFontSize,
        answerFontSize,
      })

      await context.close()

      const passed = introFontSize >= 16 && answerFontSize >= 16

      return {
        passed,
        evidence: [toFileName(detailsPath)],
        details: { introFontSize, answerFontSize },
      }
    },
  )

  await withScenario(
    {
      task: 'Task 7',
      scenario: 'Cards reveal progressively while scrolling',
      category: 'integration',
    },
    async () => {
      const context = await browser.newContext({ viewport: { width: 1440, height: 520 } })
      const page = await context.newPage()
      await page.goto(LESSON_URL, { waitUntil: 'networkidle' })
      await page.locator(SELECTORS.qaSection).first().waitFor({ state: 'visible' })

      const secondCard = page.locator(SELECTORS.qaCards).nth(1)
      await secondCard.waitFor({ state: 'attached' })

      const styleBefore = await getAnimatedStyleSnapshot(secondCard)

      const stepShots = []
      for (let step = 1; step <= 3; step += 1) {
        await page.evaluate(() => {
          window.scrollBy({ top: 400, behavior: 'instant' })
        })
        await page.waitForTimeout(600)
        const shotPath = path.join(EVIDENCE_DIR, `task-7-scroll-reveal-step-${step}.png`)
        await page.screenshot({ path: shotPath, fullPage: false })
        stepShots.push(shotPath)
      }

      const finalSequencePath = path.join(EVIDENCE_DIR, 'task-7-scroll-reveal-sequence.png')
      fs.copyFileSync(stepShots[stepShots.length - 1], finalSequencePath)

      const styleAfter = await getAnimatedStyleSnapshot(secondCard)
      const detailsPath = writeJson('task-7-scroll-reveal-sequence.json', {
        styleBefore,
        styleAfter,
      })

      await context.close()

      const progressedToVisible = styleAfter.opacity >= 0.95
      const hadEntryState = styleBefore.opacity < 0.95 || styleBefore.transform !== 'none'
      const passed = progressedToVisible && hadEntryState

      return {
        passed,
        evidence: [
          toFileName(finalSequencePath),
          ...stepShots.map((shot) => toFileName(shot)),
          toFileName(detailsPath),
        ],
        details: { styleBefore, styleAfter, progressedToVisible, hadEntryState },
      }
    },
  )

  await withScenario(
    {
      task: 'Task 7',
      scenario: 'Reduced-motion disables reveal animation',
      category: 'edge',
    },
    async () => {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 520 },
        reducedMotion: 'reduce',
      })
      const page = await context.newPage()
      await page.goto(LESSON_URL, { waitUntil: 'networkidle' })
      await page.locator(SELECTORS.qaSection).first().waitFor({ state: 'visible' })

      await page.evaluate(() => {
        window.scrollBy({ top: 500, behavior: 'instant' })
      })
      await page.waitForTimeout(160)

      const secondCard = page.locator(SELECTORS.qaCards).nth(1)
      await secondCard.waitFor({ state: 'attached' })
      const styleReduced = await getAnimatedStyleSnapshot(secondCard)

      const detailsPath = writeJson('task-7-scroll-reveal-reduced.json', {
        styleReduced,
      })

      await context.close()

      const reducedDuration = styleReduced.transitionDuration.trim()
      const reducedPass =
        styleReduced.opacity >= 0.95 &&
        (styleReduced.transform === 'none' || styleReduced.transform.includes('matrix(1, 0, 0, 1, 0, 0)'))

      return {
        passed: reducedPass,
        evidence: [toFileName(detailsPath)],
        details: { styleReduced, reducedDuration },
      }
    },
  )

  await withScenario(
    {
      task: 'Task 8',
      scenario: 'Subtle background responds without overpowering content',
      category: 'integration',
    },
    async () => {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
      const page = await context.newPage()
      const consoleErrors = []
      gatherConsoleErrors(page, consoleErrors)

      await page.goto(BASE_URL, { waitUntil: 'networkidle' })
      await page.waitForTimeout(200)

      const beforeBuffer = await page.screenshot({
        path: path.join(EVIDENCE_DIR, 'task-8-background-baseline.png'),
      })

      const mousePath = [
        [120, 120],
        [420, 260],
        [760, 420],
        [1040, 520],
        [1240, 660],
      ]

      for (const point of mousePath) {
        await page.mouse.move(point[0], point[1], { steps: 20 })
        await page.waitForTimeout(140)
      }

      const afterPath = path.join(EVIDENCE_DIR, 'task-8-background-parallax.png')
      const afterBuffer = await page.screenshot({ path: afterPath })
      const diffRatio = pngByteDiffRatio(beforeBuffer, afterBuffer)

      const detailsPath = writeJson('task-8-background-parallax.json', {
        diffRatio,
        consoleErrors,
      })

      await context.close()

      const passed = diffRatio > 0.01 && consoleErrors.length === 0

      return {
        passed,
        evidence: [toFileName(afterPath), toFileName(detailsPath)],
        details: { diffRatio, consoleErrors },
      }
    },
  )

  await withScenario(
    {
      task: 'Task 8',
      scenario: 'Reduced-motion keeps scene static',
      category: 'edge',
    },
    async () => {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        reducedMotion: 'reduce',
      })
      const page = await context.newPage()

      await page.goto(BASE_URL, { waitUntil: 'networkidle' })
      await page.waitForTimeout(140)
      const firstBuffer = await page.screenshot({
        path: path.join(EVIDENCE_DIR, 'task-8-background-reduced-t0.png'),
      })

      await page.waitForTimeout(2000)
      const secondBuffer = await page.screenshot({
        path: path.join(EVIDENCE_DIR, 'task-8-background-reduced-t2.png'),
      })

      const diffRatio = pngByteDiffRatio(firstBuffer, secondBuffer)
      const detailsPath = writeJson('task-8-background-reduced-diff.json', {
        diffRatio,
      })

      await context.close()

      return {
        passed: diffRatio < 0.01,
        evidence: [toFileName(detailsPath)],
        details: { diffRatio },
      }
    },
  )

  await withScenario(
    {
      task: 'Task 9',
      scenario: 'Route transition remains smooth and consistent',
      category: 'integration',
    },
    async () => {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
      const page = await context.newPage()
      const consoleErrors = []
      gatherConsoleErrors(page, consoleErrors)

      await page.goto(BASE_URL, { waitUntil: 'networkidle' })
      await page.locator(SELECTORS.topicFirst).first().waitFor({ state: 'visible' })

      const toTopicStart = monotonicNowMs()
      await page.locator(SELECTORS.topicFirst).first().click()
      await page.locator('section[aria-label="Список уроков"]').first().waitFor({ state: 'visible' })
      const toTopicDurationMs = monotonicNowMs() - toTopicStart

      const toLessonStart = monotonicNowMs()
      await page.locator(SELECTORS.lessonFirst).first().click()
      await page.locator('main h1').first().waitFor({ state: 'visible' })
      const toLessonDurationMs = monotonicNowMs() - toLessonStart

      const backStart = monotonicNowMs()
      await page.goBack()
      await page.locator('section[aria-label="Список уроков"]').first().waitFor({ state: 'visible' })
      const backDurationMs = monotonicNowMs() - backStart

      const forwardStart = monotonicNowMs()
      await page.goForward()
      await page.locator('main h1').first().waitFor({ state: 'visible' })
      const forwardDurationMs = monotonicNowMs() - forwardStart

      const screenshotPath = path.join(EVIDENCE_DIR, 'task-9-route-transition.png')
      await page.screenshot({ path: screenshotPath, fullPage: false })

      const detailsPath = writeJson('task-9-route-transition.json', {
        toTopicDurationMs,
        toLessonDurationMs,
        backDurationMs,
        forwardDurationMs,
        consoleErrors,
      })

      await context.close()

      const allFastEnough =
        toTopicDurationMs < 2000 &&
        toLessonDurationMs < 2000 &&
        backDurationMs < 2000 &&
        forwardDurationMs < 2000

      return {
        passed: allFastEnough && consoleErrors.length === 0,
        evidence: [toFileName(screenshotPath), toFileName(detailsPath)],
        details: {
          toTopicDurationMs,
          toLessonDurationMs,
          backDurationMs,
          forwardDurationMs,
          consoleErrors,
        },
      }
    },
  )

  await withScenario(
    {
      task: 'Task 9',
      scenario: 'Reduced-motion route transition stays minimal',
      category: 'edge',
    },
    async () => {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        reducedMotion: 'reduce',
      })
      const page = await context.newPage()
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })
      await page.locator(SELECTORS.topicFirst).first().waitFor({ state: 'visible' })

      const toTopicStart = monotonicNowMs()
      await page.locator(SELECTORS.topicFirst).first().click()
      await page.locator('section[aria-label="Список уроков"]').first().waitFor({ state: 'visible' })
      const toTopicDurationMs = monotonicNowMs() - toTopicStart

      await page.waitForTimeout(220)

      const transformSample = await page.evaluate(() => {
        const candidates = Array.from(document.querySelectorAll('main, [data-motion], [style*="transform"]'))
        const transforms = candidates
          .map((node) => window.getComputedStyle(node).transform)
          .filter((value) => value && value !== 'none')
        return transforms.slice(0, 8)
      })

      const toLessonStart = monotonicNowMs()
      await page.locator(SELECTORS.lessonFirst).first().click()
      await page.locator('main h1').first().waitFor({ state: 'visible' })
      const toLessonDurationMs = monotonicNowMs() - toLessonStart

      const detailsPath = writeJson('task-9-route-transition-reduced.json', {
        toTopicDurationMs,
        toLessonDurationMs,
        transformSample,
      })

      await context.close()

      const maxTranslateY = transformSample.reduce((maxValue, transformValue) => {
        const match = transformValue.match(/matrix\(([^)]+)\)/)
        if (!match) {
          return maxValue
        }

        const parts = match[1].split(',').map((part) => Number.parseFloat(part.trim()))
        const ty = Number.isFinite(parts[5]) ? Math.abs(parts[5]) : 0
        return Math.max(maxValue, ty)
      }, 0)

      const passed = toTopicDurationMs <= 1200 && toLessonDurationMs <= 1200 && maxTranslateY <= 2.5

      return {
        passed,
        evidence: [toFileName(detailsPath)],
        details: { toTopicDurationMs, toLessonDurationMs, transformSample, maxTranslateY },
      }
    },
  )

  await browser.close()

  const integration = scenarioResults.filter((scenario) => scenario.category === 'integration')
  const edgeCases = scenarioResults.filter((scenario) => scenario.category === 'edge')
  const passed = scenarioResults.filter((scenario) => scenario.status === 'PASS')

  const summary = {
    generatedAt: new Date().toISOString(),
    total: scenarioResults.length,
    passed: passed.length,
    failed: scenarioResults.length - passed.length,
    integration: {
      total: integration.length,
      passed: integration.filter((scenario) => scenario.status === 'PASS').length,
      failed: integration.filter((scenario) => scenario.status === 'FAIL').length,
    },
    edgeCases: {
      total: edgeCases.length,
      passed: edgeCases.filter((scenario) => scenario.status === 'PASS').length,
      failed: edgeCases.filter((scenario) => scenario.status === 'FAIL').length,
    },
    scenarios: scenarioResults,
  }

  fs.writeFileSync(
    path.join(EVIDENCE_DIR, 'final-qa-results.json'),
    JSON.stringify(summary, null, 2),
  )

  const markdownLines = [
    '# Final QA Replay Results',
    '',
    `Generated: ${summary.generatedAt}`,
    `Total: ${summary.passed}/${summary.total} passed`,
    `Integration: ${summary.integration.passed}/${summary.integration.total} passed`,
    `Edge Cases: ${summary.edgeCases.passed}/${summary.edgeCases.total} passed`,
    '',
    '| Task | Scenario | Category | Status | Evidence |',
    '| --- | --- | --- | --- | --- |',
  ]

  for (const scenario of scenarioResults) {
    markdownLines.push(
      `| ${scenario.task} | ${scenario.scenario} | ${scenario.category} | ${scenario.status} | ${scenario.evidence.join(', ')} |`,
    )
  }

  fs.writeFileSync(path.join(EVIDENCE_DIR, 'final-qa-results.md'), `${markdownLines.join('\n')}\n`)

  console.log(JSON.stringify(summary, null, 2))
})().catch((error) => {
  const fallback = {
    generatedAt: new Date().toISOString(),
    total: scenarioResults.length,
    passed: scenarioResults.filter((scenario) => scenario.status === 'PASS').length,
    failed: scenarioResults.filter((scenario) => scenario.status === 'FAIL').length,
    fatalError: error instanceof Error ? error.message : String(error),
    scenarios: scenarioResults,
  }

  fs.mkdirSync(EVIDENCE_DIR, { recursive: true })
  fs.writeFileSync(path.join(EVIDENCE_DIR, 'final-qa-results.json'), JSON.stringify(fallback, null, 2))
  fs.writeFileSync(
    path.join(EVIDENCE_DIR, 'final-qa-results.md'),
    `# Final QA Replay Results\n\nFatal error: ${fallback.fatalError}\n`,
  )

  console.error(error)
  process.exit(1)
})
