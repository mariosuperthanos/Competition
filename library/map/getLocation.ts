import axios from "axios";

const getLocation = async (lat: number, lng: number) => {
  try {
    const req = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=1815f05342614d459cd09ea741dcfc58&language=en`);

    const components = req.data.results[0].components;

    const city =
      components.county ||
      components.city ||
      components.town ||
      components.hamlet ||
      components.suburb ||
      components.municipality ||
      components.locality ||
      components.state ||
      components.state_district ||
      components.district ||
      "Unknown";

    const country = components.country;

    console.log("City:", city);
    console.log("Country:", country);

    return {
      city,
      country
    }
  } catch (err) {
    console.error(err);
  }
}

export default getLocation;