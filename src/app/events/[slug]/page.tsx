"use server";
import { Fragment } from "react";
import TimeAndLocationCard from "../../../../components/event/TimeAndLocation";
import prisma from "../../../../lib/prisma";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { cookies } from 'next/headers'
import getImageUrl from "../../../../library/searchEvents/getS3Image";
import Event2 from "../../../../components/test1";
import CreateEventPage from "@/app/create-event/page";
import Postare from "../../../../components/test1";
import { format } from "path";
import formatEventDate from "../../../../library/converters/customDate";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import checkJWT from "../../../../library/create-eventAPI/checkJWT";

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
  }) {
  let session;
  try {
    await checkJWT();
    session = await getServerSession(authOptions);
  } catch (err) {
    return redirect("/auth/login");
  }
  console.log(session)
  const clientName = session?.user?.name;
  const clientId = session.token.id;
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
    id,
    title,
    description,
    startHour,
    finishHour,
    lat: latitude,
    lng: longitude,
    country,
    city,
    timezone,
    hostId,
    hostName,
    tags
  } = event;


  const time = {
    startHour,
    endHour: finishHour,
  };

  const location = {
    city,
    country,
    timezone,
    lat: latitude.toString(),
    lng: longitude.toString(),
  };

  const url = await getImageUrl(title+"BIG");

  const cookieStore = await cookies()
  const timezone1 = cookieStore.get('timezoneData');
  // console.log("timezone1", timezone1);
  const parsedData = JSON.parse(timezone1?.value!);
  const userCountry = parsedData.data.country;
  const userCity = parsedData.data.city;
  const userTimezone = parsedData.data.timezone;

  const result = formatEventDate(time, userCountry, userCity, timezone, userTimezone);
  console.log("result", result);

  let data = await prisma.eventRequest.findFirst({
    where: {
      userId: clientId,
      eventId: id,
    },
    select: {
      buttonState: true,
    },
  });
  const buttonState = data !== null ? data.buttonState : "unclicked";
  console.log("button state:", buttonState)

  const imageUrl = await getImageUrl(title + "BIG");

  const eventData = {
    id,
    title,
    description,
    time: result,
    host: hostName,
    location: `${city}, ${country}`,
    image: imageUrl,
    lat: latitude,
    lng: longitude,
    tags,
    clientId,
    clientName,
    buttonState
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
