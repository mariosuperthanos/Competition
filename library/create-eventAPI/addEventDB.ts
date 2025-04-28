import slugify from "slugify";
import prisma from "../../lib/prisma";
import { error } from "console";

interface EventData {
  title: string;
  description: string;
  date: string;
  startHour: string;
  finishHour: string;
  country: string;
  city: string;
  lat: number;
  lng: number;
  timezone: string;
}

const addEventInDB = async (data: EventData, userid: string): Promise<any> => {
  // slug is not validated by schema, because it has nothing to do with the user's input, unlike the title that has to be unique
  const slug = slugify(data.title, { lower: true, strict: true });

  const hostsArray: string[] = [userid];

  // add event in db
  const addPost = await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      date: data.date,
      startHour: data.startHour,
      finishHour: data.finishHour,
      country: data.country,
      city: data.city,
      lat: data.lat,
      lng: data.lng,
      hosts: {
        connect: hostsArray.map((id) => ({ id })), // Conectează utilizatorii prin ID-uri
      },
      slug: slug,
      timezone: data.timezone
    },
  });
  
  if (addPost == null) {
    throw new Error('Fail')
  }
  return addPost;
};

export default addEventInDB;