import sharp from "sharp";
import { promises as fs } from "fs";

interface SharpImageParams {
  inputPath: string;
  outputPath: string;
}

const sharpImage = async (inputPath: string, outputPath: string): Promise<void> => {
  try {
    await sharp(inputPath)
      .jpeg({ quality: 60 })
      .toFile(outputPath);
  } catch (err) {
    console.log(err);
  }
};

export default sharpImage;
