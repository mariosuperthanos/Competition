import prisma from "../../lib/prisma";
import getImageUrl from "../searchEvents/getS3Image";

async function getUpcomingEventsWithinRange(
  city: string,
  country: string,
  timeRange: number
) {
  const now = new Date();

  const todayStr = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);
  console.log("todayStr", todayStr);

  const events = await prisma.event.findMany({
    where: {
      city,
      country,
      OR: [
        { date: todayStr },
        { date: tomorrowStr },
      ],
    },
  });
  console.log("events from prisma", events);

  const nowMs = now.getTime();
  const rangeEndMs = nowMs + timeRange * 60 * 60 * 1000;

  const filtredEvents = events
    .filter(e => {
      const eventTime = new Date(e.startHour).getTime();
      return eventTime >= nowMs && eventTime <= rangeEndMs;
    })
    .sort((a, b) => new Date(a.startHour).getTime() - new Date(b.startHour).getTime())
    .slice(0, 12);

  const eventsWithImage = await Promise.all(
    filtredEvents.map(async (event, index) => {
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