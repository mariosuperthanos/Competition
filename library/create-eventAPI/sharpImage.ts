import sharp from "sharp";
import { promises as fs } from "fs";

const sharpImage = async (inputPath, outputPath) => {
  try {
    await sharp(inputPath)
      .jpeg({ quality: 60 })
      .toFile(outputPath);
    await fs.rm(inputPath);
  } catch (err) {
    console.log(err);
  }
};

export default sharpImage;
