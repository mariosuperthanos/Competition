import { promises as fs } from "fs";
import path from "path";

const parseImage = async (data, filePath) => {
  const file = data.file;

  const bytes = await file?.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  await fs.writeFile(filePath, buffer);
};

export default parseImage;
