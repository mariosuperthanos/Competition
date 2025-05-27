'use server';

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const getImageUrl = async (title: string) => {
  const s3 = new S3Client({
    region: "eu-north-1",
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID!,
      secretAccessKey: process.env.SECRET_ACCESS_KEY!,
    },
  });

  const command = new GetObjectCommand({
    Bucket: "events-photos-recap-project",
    Key: `${title}.jpeg`,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

  return url;
}

export default getImageUrl;