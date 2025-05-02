"use server";
import { Fragment } from "react";
import Event from "../../../../components/event/Event";
import TimeAndLocationCard from "../../../../components/event/TimeAndLocation";
import prisma from "../../../../lib/prisma";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { cookies } from 'next/headers'
import getImageUrl from "../../../../library/searchEvents/getS3Image";
import Event2 from "../../../../components/test";
import CreateEventPage from "@/app/create-event/page";
import Postare from "../../../../components/test";

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  console.log(slug);

  const event = await prisma.event.findFirst({
    where: {
      slug: {
        equals: slug,
        mode: "insensitive", // ignore uppercase/lowercase
      },
    },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  const {
    title,
    description,
    startHour,
    finishHour,
    lat: latitude,
    lng: longitude,
    country,
    city,
    timezone
  } = event;


  const time = {
    startHour,
    endHour: finishHour,
  };
  const host = "Andrei";
  const location = {
    city,
    country,
    timezone,
    lat: latitude.toString(),
    lng: longitude.toString(),
  };

  const url = await getImageUrl(title);
  
  const cookieStore = await cookies()
  const timezone1 = cookieStore.get('timezoneData');
  console.log("timezone1", timezone1);
  const parsedData = JSON.parse(timezone1?.value!);
  const timezone2 = parsedData.data.timezone;

  const eventData = {
    title: "Tech Conference 2025",
    description:
      "Join us for the biggest tech conference of the year! Learn about the latest technologies, network with industry professionals, and participate in hands-on workshops.\n\nThis year's conference will feature keynote speakers from leading tech companies, panel discussions on emerging trends, and opportunities to connect with potential employers and collaborators.",
    time: new Date("2025-06-15T09:00:00"),
    host: "Tech Innovations Inc.",
    location: "Convention Center, Silicon Valley",
    image: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
    timezone: "PST",
  };

  return (
    <Fragment>
      {/* <Event
        title={title}
        description={description}
        time={time}
        host={host}
        location={location}
        image={url}
        timezone={timezone2}
      /> */}
      <Event2 {...eventData} />
      {/* <Postare /> */}
    </Fragment>
  );
}
