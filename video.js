const fs = require("fs")
const sharp = require("sharp")
const execSync = require("child_process").execSync

const getDateFromFilename = date => {
  const dateParts = date.split("-")

  return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
}

const run = async () => {
  const rawFiles = fs
    .readdirSync("./screenshots/")
    .filter(item => item !== ".gitignore")
    .filter(item => item !== "video.mp4")
    .map(item => "screenshots/" + item)

  let filesCropped = 0

  for (const rawFile of rawFiles) {
    try {
      /* await sharp(rawFile)
        .extract({ width: 1920, height: 900, left: 0, top: 300 })
        .toFile("tmp/" + rawFile.replace("screenshots/screenshot-", "")) */
    } catch (e) {
      console.log("Cannot crop " + rawFile)
    }

    filesCropped = filesCropped + 1

    console.log(filesCropped + "/" + rawFiles.length + " files cropped...")
  }

  const list = await fs.writeFileSync("tmp/list.txt", "")

  const croppedFiles = fs
    .readdirSync("./tmp/")
    .filter(item => item !== ".gitignore")
    .filter(item => item !== "list.txt")
    .filter(item => item !== "video.mp4")
    .map(item => "tmp/" + item)
    .sort((a, b) => {
      const dateA = getDateFromFilename(
        a.replace("tmp/", "").replace(".png", "")
      )
      const dateB = getDateFromFilename(
        b.replace("tmp/", "").replace(".png", "")
      )

      return dateB - dateA
    })
    .reverse()

  try {
    console.log("Creating the video...")
    const videoPath = "./screenshots/video.mp4"

    for (const file of croppedFiles) {
      try {
        await fs.appendFileSync(
          "tmp/list.txt",
          "\nfile '" + file.replace("tmp/", "") + "'"
        )
        await fs.appendFileSync("tmp/list.txt", "\nduration 0.10")
      } catch (e) {
        console.log("Cannot write " + file)
      }
    }

    await execSync(
      "ffmpeg -y -f concat -i tmp/list.txt -codec libx264 screenshots/video.mp4 "
    )

    console.log("Cleaning up tmp files")

    for (const file of fs
      .readdirSync("./tmp/")
      .filter(item => item !== ".gitignore")) {
      await fs.unlinkSync(file)
    }

    console.log("Video created: " + videoPath)
  } catch (e) {
    console.log(e)
  }
}

run()
