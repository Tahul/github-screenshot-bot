const fs = require("fs")
const sharp = require("sharp")
const videoshow = require("videoshow")

const getDateFromFilename = date => {
  const dateParts = date.split("-")

  return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
}

const run = async () => {
  const rawFiles = fs
    .readdirSync("./screenshots/")
    .filter(item => item !== ".gitignore")
    .map(item => "screenshots/" + item)

  let filesCropped = 0

  for (const rawFile of rawFiles) {
    await sharp(rawFile)
      .extract({ width: 1920, height: 1080, left: 0, top: 300 })
      .toFile("tmp/" + rawFile.replace("screenshots/screenshot-", ""))

    filesCropped = filesCropped + 1

    console.log(filesCropped + "/" + rawFiles.length + " files cropped...")
  }

  const videoOptions = {
    fps: 25,
    loop: 0.25,
    transition: false,
    videoBitrate: 1024,
    videoCodex: "libx264",
    size: "640x?",
    format: "mp4"
  }

  const croppedFiles = fs
    .readdirSync("./tmp/")
    .filter(item => item !== ".gitignore")
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
    const videoPath = "screenshots/video.mp4"

    await videoshow(croppedFiles, videoOptions).save(videoPath)

    console.log("Cleaning up tmp files")
    for (const file of croppedFiles) {
      await fs.unlinkSync(file)
    }

    console.log("Video created: " + videoPath)
  } catch (e) {
    console.log(e)
  }
}

run()
