require('dotenv').config()
const hasSlackWebhook = process.env.SLACK_WEBHOOK ? true : false
const SlackWebhook = require('slack-webhook')
const slack = new SlackWebhook(process.env.SLACK_WEBHOOK)
const puppeteer = require('puppeteer')
const formatDate = date => {
  const pad = s => {
    return s < 10 ? '0' + s : s
  }
  var d = new Date(date)
  return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('-')
}
const date = formatDate(Date.now())

const take = async () => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--ash-host-window-bounds=1920x1080',
      '--window-size=1920,1080',
      '--window-position=0,0'
    ]
  })
  const VIEWPORT = { width: 1920, height: 1080 }

  const page = await browser.newPage()
  await page.setViewport(VIEWPORT)
  await page.goto(process.env.GITHUB_URL)
  await page.screenshot({
    path: 'screenshots/screenshot-' + date + '.png',
    fullPage: true
  })

  await browser.close()
}

const start = async () => {
  try {
    await take()
    if (hasSlackWebhook) {
      await slack.send('> GitHub screenshot taken for ' + date)
    }
  } catch (e) {
    console.log(e)
    if (hasSlackWebhook) {
      await slack.send('> Error while taking GitHub screenshot for ' + date)
    }
  } finally {
    process.exit()
  }
}

start()
