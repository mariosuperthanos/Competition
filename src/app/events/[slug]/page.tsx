"use server";
import { Fragment } from "react";
import Event from "../../../../components/event/Event";
import TimeAndLocationCard from "../../../../components/event/TimeAndLocation";
import prisma from "../../../../lib/prisma";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { cookies } from 'next/headers'
import getImageUrl from "../../../../library/searchEvents/getS3Image";

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

  // const image =
  //   "data:image/jpeg;base64,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OSxIw8jHW2W2A7LbbW1zGXOeha3EaqC3+GRrj91pJ9i5eVcwKOYlzA6En6sgN+4QQOyy5jNGMV9dRIR0MaD36/cgj+e+dXy1zIoA7gmuuNXlSPOoHDttrsBt17gJjmBm0aSMyzC00g1j6DNoZvJ1ncByLo5DzUpKQh0bMT/rHnE7s5G9gC7iDjZ48Rq/VO9yq7MH0jS73+C9XDlGibPFJE++F7S02NjY8xXDyTmRS000c0ZlxMvbE8Ea2lpuMPMSgkqIiCs9Ln7Wl6j/AImrq6JuKz+vPhxruZwZsQVro3TGQFgIGBwG0gm9weZbGQMhxUUbo4S8hzsZxkE3whvIByAIOmiIgIiICIiAtTKfmDf+RW2sNXDjaQNu0b1H1VJvhtWvXZ7xzEWiZcQleSUfcGx2rwSuMtOy0iH0le6eB0jrN3knkWAlbFBV8G65FwRY8+9ZwzjnLWMk/h8S0Wis8PUrKN0dr2IPKPcunkb9n2laVfWcLhawHbfpJXUoYMDA07dp3lXXZ+LH75a2HnSI6+fLki5rW9lEW6s6Ii6BCEREBR/P70fU7m+I1SBR/P70fVbm+I1BXmjj0hF1X/AVcapvRx6Qi6r/AICrkQEREBERARFGcvZ7U9JK6F7JnPbY+S1uHWARrc4c/IgkyrLSvlBrpYIGm5jDnv6C+2EHpsCftBYsraSJ5AW08bYr6sRON/YLAA96183MyqiqfwtVjZGTicX34WS5ubA6xf6R7LoJboxozHRYj/eyOeNwswfDftUtXiGJrGtYwANaA0AbAALADsXtAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREGGemY/wA4duw960pMkD5riN4v7rLolwXzhAoubRafNO968/T7Nlct69Jcr9Du+kO4rJHkcfOcTuFv5rocKF9EoWivZOkid+H95e51OSfF4gpWM80du096zLyHBelPpStI4axtHk0zMzO8iIi9MCIiAhCIg5sWQaVszZ2RMZIL+UwYb4hY3aNR3kXXSREBERAREQFx8q5sUlTIJZ4sTw0Nvje0WBJGprgDtK7CINDJ+RaaDXDDGw/SDBi+9t9q30RAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBfCF9RBidGvBiK2EQa3AlfREVsIgxNjWQBfUQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQf/Z";

  return (
    <Fragment>
      <Event
        title={title}
        description={description}
        time={time}
        host={host}
        location={location}
        image={url}
        timezone={timezone2}
      />
    </Fragment>
  );
}
