# GitHub screenshot taker 🤳

## Introduction

A simple [Puppeteer](https://github.com/GoogleChrome/puppeteer) script to take a screenshot of your GitHub account everyday.

It can result in cool looking gifs like this one:
https://twitter.com/i/status/1092813820706189313

## Setup

To setup this repository code, you just have to:

```bash
mv .env.example .env
```

Edit `.env` with your parameters.

```bash
npm install
```

```bash
// Add this to your crontab
0 0 * * * cd {path/to/github-screenshot-bot} && node index.js
```

## Notes

You can add environment variables from .env.

Slack webhook isn't required.

This was made after seeing this tweet from [@sindresorhus](https://twitter.com/sindresorhus):
https://twitter.com/sindresorhus/status/1092813820706189313

Have fun making gifs! 🥰
