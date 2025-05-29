/* eslint-disable prefer-const */
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import Joi from "joi";
import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import schema from "../../../../library/schemas/eventServerSide";
import slugify from "slugify";
import checkJWT from "../../../../library/create-eventAPI/checkJWT";
import getData from "../../../../library/create-eventAPI/getData";
import valdiateEventSchema from "../../../../library/create-eventAPI/validateSchema";
import addEventInDB from "../../../../library/create-eventAPI/addEventDB";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import sharp from "sharp";
import parseImage from "../../../../library/create-eventAPI/parseImage";
import sharpImage from "../../../../library/create-eventAPI/sharpImage";
import uploadFile from "../../../../library/create-eventAPI/addImageToS3";

const uploadDir = "/tmp/uploads";

export const POST = async (req: Request) => {
  try {
    const [userid, _, data] = await Promise.all([
      checkJWT(req),
      fs.mkdir(uploadDir, { recursive: true }),
      getData(req)
    ]);
    console.log("data", typeof data.tags);

    const filePath = path.join(uploadDir, data.file?.name);
    const outputPath = path.join(uploadDir, "outcome.jpeg");

    // Rulează în paralel: validarea și salvarea fișierului
    await Promise.all([
      valdiateEventSchema(data),
      parseImage(data, filePath)
    ]);

    await sharpImage(filePath, outputPath);
    await Promise.all([
      uploadFile(outputPath, `${data.title}.jpeg`),
      uploadFile(filePath, `${data.title}BIG.jpeg`)
    ]);
    await fs.rm(filePath);
    const addPost = await addEventInDB(data, userid);

    return NextResponse.json({ data: addPost }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
