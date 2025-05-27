import axios from "axios";
import getTimeZone from "../converters/getTimeZone";
import Cookies from "js-cookie";
// import getIp from "./getIp";

const saveTimezone = async () => {
  // const ip = await getIp();  // Use a real IP retrieval method if needed
  const ip = "78.97.165.36"; // Simulated IP for testing
  console.log("ip", ip);

  try {
    const {
      data: { country_name, city_name, latitude, longitude },
    } = await axios.get(
      `https://api.ip2location.io/?key=766C73418440168073E6F244518BEA18&ip=${ip}`
    );

    const timezone = await getTimeZone(latitude, longitude);
    console.log(timezone);

    const result = {
      country: country_name,
      city: city_name,
      timezone: timezone,
      latitude: latitude,
      longitude: longitude,
    };

    return result;
  } catch (error) {
    console.error("Error fetching location data:", error);
  }
};

export default saveTimezone;
