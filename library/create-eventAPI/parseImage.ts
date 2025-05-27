import { promises as fs } from "fs";
import path from "path";

interface FileData {
  file: {
    arrayBuffer: () => Promise<ArrayBuffer>;
  } | null;
}

const parseImage = async (data: FileData, filePath: string): Promise<void> => {
  const file = data.file;

  const bytes = await file?.arrayBuffer();
  const buffer = Buffer.from(bytes as ArrayBuffer);
  
  await fs.writeFile(filePath, buffer);
};

export default parseImage;