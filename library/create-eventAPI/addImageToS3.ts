import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "fs";

const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

const uploadFile = async (filePath, fileName) => {
  const fileContent = readFileSync(filePath);

  const uploadParams = {
    Bucket: "events-photos-recap-project",
    Key: fileName,
    Body: fileContent,
  };

  try {
    const data = await s3.send(new PutObjectCommand(uploadParams));
    console.log("✅ Upload successful:", data);
  } catch (err) {
    console.log("Error: ", err);
  }
};

export default uploadFile;
