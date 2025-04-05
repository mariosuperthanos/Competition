import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import Joi from "joi";

export const POST = async (req: Request) => {
  console.log(12345);

  const schema = Joi.object({
    title: Joi.string().required(), // String obligatoriu
    description: Joi.string().required(), // String obligatoriu
    date: Joi.date().iso().required(), // Validare pentru data ISO
    startHour: Joi.string()
      .pattern(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/)
      .required(), // Validare oră în format HH:mm
    finishHour: Joi.string()
      .pattern(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/)
      .required(), // Validare oră în format HH:mm
    country: Joi.string().required(), // String obligatoriu
    city: Joi.string().required(), // String obligatoriu
    lat: Joi.number()
      .required(), // Validare latitudine
    lng: Joi.number()
      .required(), // Validare longitudine
  });
  try {
    const {
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

    // validate
    await schema.validateAsync({
      title,
      description,
      date,
      startHour,
      finishHour,
      country,
      city,
      lat,
      lng,
    });

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
      },
    });

    return NextResponse.json({ data: addPost }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
};