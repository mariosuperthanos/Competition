import schema from "../schemas/eventServerSide";

const valdiateEventSchema = async (data) => {
  console.log(data.file);
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
    timezone: data.timezone
  });
};

export default valdiateEventSchema;
