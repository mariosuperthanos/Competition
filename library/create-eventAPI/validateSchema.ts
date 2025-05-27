import schema from "../schemas/eventServerSide";

interface EventData {
  title: string;
  description: string;
  startHour: string;
  date: string;
  finishHour: string;
  country: string;
  city: string;
  lat: number;
  lng: number;
  file: unknown;
  timezone: string;
  tags: string[];
}

const valdiateEventSchema = async (data: EventData): Promise<void> => {
  console.log(data.tags);
  await schema.validateAsync({
    title: data.title,
    description: data.description,
    startHour: data.startHour,
    date: data.date,
    finishHour: data.finishHour,
    country: data.country,
    city: data.city,
    lat: data.lat,
    lng: data.lng,
    file: data.file,
    timezone: data.timezone,
  });
};

export default valdiateEventSchema;
