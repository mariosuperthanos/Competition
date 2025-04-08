import axios from "axios";

const getLocation = async (lat: number, lng: number) => {
  try {
    const req = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=1815f05342614d459cd09ea741dcfc58`);

    const city = req.data.results[0].components.county;

    const country = req.data.results[0].components.country;

    return {
      city,
      country
    }
  } catch (err) {
    console.error(err);
  }
}

export default getLocation;