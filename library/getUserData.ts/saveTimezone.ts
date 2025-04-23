import axios from "axios";
import getTimeZone from "../converters/getTimeZone";
import Cookies from "js-cookie"; // Import js-cookie for client-side cookie handling
// import getIp from "./getIp";

const saveTimezone = async () => {
  // Check if the 'userLocation' cookie is already set
  if (!Cookies.get("userLocation")) {
    // const ip = await getIp();  // Use a real IP retrieval method if needed
    const ip = "78.97.165.36"; // Simulated IP for testing
    console.log("ip", ip);

    try {
      const {
        data: { country_name, city_name, latitude, longitude },
      } = await axios.get(
        `https://api.ip2location.io/?key=766C73418440168073E6F244518BEA18&ip=${ip}`
      );

      // Get timezone based on latitude and longitude
      const timezone = getTimeZone(latitude, longitude);

      // Store the user location information in cookies for 7 days
      Cookies.set(
        "userLocation",
        JSON.stringify({
          country: country_name,
          city: city_name,
          timezone: timezone,
        }),
        { expires: 7, path: "/" }
      );

      console.log(Cookies.get("userLocation"));
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  }
};

export default saveTimezone;
