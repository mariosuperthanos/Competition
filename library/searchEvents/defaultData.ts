'use server';

import { cookies } from 'next/headers'
import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client';
import getImageUrl from './getS3Image';

const defaultData = async (tags = null) => {
  const cookieStore = await cookies();
  const data = cookieStore.get('timezoneData');
  const parsedData = JSON.parse(data?.value!);
  const { latitude, longitude } = parsedData.data;

  let eventsRaw: Array<{
    id: number;
    title: string;
    lat: number;
    lng: number;
    distance: number;
    city: string;
    country: string;
    tags: string[]
  }>;

  if (tags) {
    const formattedTags = tags.map(tag =>
      tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()
    );
    // Query with tags filter - using  parameterized query for security
    eventsRaw = await prisma.$queryRaw`
      SELECT *, 
        (6371 * acos(cos(radians(${latitude})) * cos(radians("lat")) * cos(radians("lng") - radians(${longitude})) + sin(radians(${latitude})) * sin(radians("lat")))) AS distance
      FROM "Event"
      WHERE "lat" IS NOT NULL 
        AND "lng" IS NOT NULL 
        AND "tags" && ${formattedTags}::text[]
      ORDER BY distance ASC
      LIMIT 13
    `;


  } else {
    // Query without tags filter
    eventsRaw = await prisma.$queryRaw`
      SELECT *, 
        (6371 * acos(cos(radians(${latitude})) * cos(radians("lat")) * cos(radians("lng") - radians(${longitude})) + sin(radians(${latitude})) * sin(radians("lat")))) AS distance
      FROM "Event"
      WHERE "lat" IS NOT NULL 
        AND "lng" IS NOT NULL
      ORDER BY distance ASC
      LIMIT 10
    `;
  }
  const sliceLimit = tags === null ? 9 : 13;

  const events = await Promise.all(
    eventsRaw.slice(0, sliceLimit).map(async (event, index) => {
      // Dacă e primul event, adaugă "BIG" la titlu
      const titleForImage = index === 0 ? event.title + "BIG" : event.title;
      const image = await getImageUrl(titleForImage);

      return {
        ...event,
        image,
      };
    })
  );


  const existNextPage = eventsRaw.length > 9;

  return { events, existNextPage };
}

export default defaultData;