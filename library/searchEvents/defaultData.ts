'use server';

import { cookies } from 'next/headers'
import prisma from '../../lib/prisma';
import getImageUrl from './getS3Image';

const defautlData = async () => {
  const cookieStore = await cookies();
  const data = cookieStore.get('timezoneData');
  const parsedData = JSON.parse(data?.value!);
  const { latitude, longitude } = parsedData.data;
  console.log('latitude', latitude);
  console.log('longitude', longitude);

  const eventsRaw = await prisma.$queryRaw<Array<{
    id: number;
    title: string;
    lat: number;
    lng: number;
    distance: number;
    city: string;
    country: string;
  }>>`
  SELECT *, 
    (6371 * acos(cos(radians(${latitude})) * cos(radians("lat")) * cos(radians("lng") - radians(${longitude})) + sin(radians(${latitude})) * sin(radians("lat")))) AS distance
  FROM "Event"
  WHERE "lat" IS NOT NULL AND "lng" IS NOT NULL
  ORDER BY distance ASC
  LIMIT 10;
`;

  const events = await Promise.all(
    eventsRaw.map(async (event) => {
      // const image = await getImageUrl(event.title); 
      const image = 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg'
      return {
        ...event,
        image,
      };
    })
  );


  console.log('events', events);

  return events;
}

export default defautlData;