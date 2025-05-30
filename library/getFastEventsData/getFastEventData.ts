import prisma from "../../lib/prisma";
import getImageUrl from "../searchEvents/getS3Image";

async function getUpcomingEventsWithinRange(
  city: string,
  country: string,
  timeRange: number
) {
  const now = new Date();
  console.log(city, country, timeRange);

  const todayStr = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);
  console.log("todayStr", todayStr);

  const events = await prisma.event.findMany({
    where: {
      city,
      country,
    },
  });
  console.log("events from prisma", events);

  const nowMs = now.getTime();
  const rangeEndMs = nowMs + timeRange * 60 * 60 * 1000;
  const rangeEnd = new Date(now.getTime() + timeRange * 60 * 60 * 1000);

  const filteredEvents = events
    .filter((event) => {
      const start = new Date(event.startHour);
      // 1. Data startHour = azi (în fusul orar UTC)
      const isToday =
        start.toISOString().slice(0, 10) === todayStr;

      // 2. startHour este între acum și intervalul limită
      const inRange = start >= now && start <= rangeEnd;

      return isToday && inRange;
    })
    .sort((a, b) => new Date(a.startHour).getTime() - new Date(b.startHour).getTime());
  console.log("filteredEvents", filteredEvents);

  const eventsWithImage = await Promise.all(
    filteredEvents.map(async (event, index) => {
      // Dacă e primul event, adaugă "BIG" la titlu
      const titleForImage = index === 0 ? event.title + "BIG" : event.title;
      const image = await getImageUrl(titleForImage);

      return {
        ...event,
        image,
      };
    }))
  
  return eventsWithImage;
}

export default getUpcomingEventsWithinRange;