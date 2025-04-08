/* eslint-disable prefer-const */
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import Joi from "joi";
import { use } from "react";
import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import schema from "../../../../library/schemas/eventServerSide";

export const POST = async (req: Request) => {
  // validate the cookie by using next auth server side function
  const cookie = await getServerSession(authOptions);

  // const authHeader = req.headers.get('cookie');
  // console.log("Authorization header:", authHeader);

  // console.log(cookie);
  if (!cookie) {
    return NextResponse.json({ data: "You are not logged in." }, { status: 401 });
  }

  try {
    let {
      title,
      description,
      date,
      startHour,
      finishHour,
      country,
      city,
      lat,
      lng,
    } = await req.json();

    const userid=cookie.token.id;

    lat = parseFloat(lat);
    lng = parseFloat(lng);

    // validate the req body
    await schema.validateAsync({
      title,
      description,
      startHour,
      date,
      finishHour,
      country,
      city,
      lat,
      lng,
    });

    const hostsArray = [userid];

    // add event in db
    const addPost = await prisma.event.create({
      data: {
        title,
        description,
        date,
        startHour,
        finishHour,
        country,
        city,
        lat,
        lng,
        hosts: {
          connect: hostsArray.map((id) => ({ id })), // Conectează utilizatorii prin ID-uri
        },
      },
    });
    return NextResponse.json({ data: addPost }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
};
