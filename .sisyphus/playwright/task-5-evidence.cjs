const fs = require('node:fs')
const path = require('node:path')
const { chromium } = require('playwright')

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:5173'
const LESSON_PATH = '/topic/krasivyi-konspekt/lesson/qa-craft'
const EVIDENCE_DIR = path.resolve('.sisyphus/evidence')
const VIDEO_OUTPUT = path.join(EVIDENCE_DIR, 'task-5-sticky-back.mp4')
const MOBILE_OUTPUT = path.join(EVIDENCE_DIR, 'task-5-mobile-header.png')

async function captureStickyBackVideo(browser) {
  const tempVideoDir = path.join(EVIDENCE_DIR, '.task-5-video-temp')
  fs.rmSync(tempVideoDir, { recursive: true, force: true })

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: tempVideoDir,
      size: { width: 1440, height: 900 },
    },
  })

  const page = await context.newPage()
  const pageVideo = page.video()
  await page.goto(`${BASE_URL}${LESSON_PATH}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)

  const backLink = page.getByRole('link', { name: 'К урокам' })
  const initialBox = await backLink.boundingBox()

  if (!initialBox) {
    throw new Error('Back link not found before scroll')
  }

  const stickySamples = []
  const scrollDeltas = [420, 640, 860, 1080]
  for (const delta of scrollDeltas) {
    await page.mouse.wheel(0, delta)
    await page.waitForTimeout(450)
    const currentBox = await backLink.boundingBox()
    if (!currentBox) {
      throw new Error('Back link disappeared during scroll')
    }
    stickySamples.push(Math.round(currentBox.y))
  }

  const maxStickyY = Math.max(...stickySamples)
  if (maxStickyY > 88) {
    throw new Error(`Back link is not sticky enough: y samples ${stickySamples.join(', ')}`)
  }

  await page.waitForTimeout(800)
  await context.close()

  const videoPath = await pageVideo.path()
  fs.copyFileSync(videoPath, VIDEO_OUTPUT)
  fs.rmSync(tempVideoDir, { recursive: true, force: true })

  console.log(`Desktop sticky samples: ${stickySamples.join(', ')}`)
  console.log(`Saved video evidence: ${VIDEO_OUTPUT}`)
}

async function captureMobileHeaderScreenshot(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()

  await page.goto(`${BASE_URL}${LESSON_PATH}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)

  const backLink = page.getByRole('link', { name: 'К урокам' })
  const title = page.getByRole('heading', { level: 1 })
  const backBox = await backLink.boundingBox()
  const titleBox = await title.boundingBox()

  if (!backBox || !titleBox) {
    throw new Error('Could not measure mobile header elements')
  }

  const overlapThreshold = 8
  if (backBox.y + backBox.height + overlapThreshold > titleBox.y) {
    throw new Error(
      `Mobile overlap detected: back bottom ${Math.round(backBox.y + backBox.height)} title top ${Math.round(titleBox.y)}`
    )
  }

  await page.screenshot({ path: MOBILE_OUTPUT })

  await context.close()
  console.log(
    `Mobile spacing check: back bottom ${Math.round(backBox.y + backBox.height)}, title top ${Math.round(titleBox.y)}`
  )
  console.log(`Saved mobile evidence: ${MOBILE_OUTPUT}`)
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  try {
    await captureStickyBackVideo(browser)
    await captureMobileHeaderScreenshot(browser)
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
