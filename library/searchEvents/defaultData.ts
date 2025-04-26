'use server';

import { cookies } from 'next/headers'
import prisma from '../../lib/prisma';

const defautlData = async () => { 
  const cookieStore = await cookies();
  const data = cookieStore.get('timezoneData');
  const parsedData = JSON.parse(data?.value!);
  const { latitude, longitude } = parsedData.data;
  console.log('latitude', latitude);
  console.log('longitude', longitude);
  
  const events = await prisma.$queryRaw`
  SELECT *, 
    (6371 * acos(cos(radians(${latitude})) * cos(radians("lat")) * cos(radians("lng") - radians(${longitude})) + sin(radians(${latitude})) * sin(radians("lat")))) AS distance
  FROM "Event"  -- Ensure the table name is correct (case-sensitive)
  WHERE "lat" IS NOT NULL AND "lng" IS NOT NULL
  ORDER BY distance ASC;
`;
  console.log('events', events);

  return events;
}

export default defautlData;