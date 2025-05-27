import axios from "axios";

const getTimeZone = async(lat: number, lng: number) => {
  try {
    const req = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=1815f05342614d459cd09ea741dcfc58`);

    // console.log(req.data.results[0].annotations.timezone.name);
    const timezone = req.data.results[0].annotations.timezone.name;

    return timezone;
  } catch (err) {
    console.error(err);
  }
}

export default getTimeZone;