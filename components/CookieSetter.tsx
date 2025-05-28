import { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const CookieSetter = ({ onComplete }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${window.location.origin}/api/saveTimezoneUtil`);
        Cookies.set("timezoneData", JSON.stringify(data), {
          path: "/",           // vizibil în tot site-ul
          sameSite: "Lax",     // permite navigări normale
          secure: false,       // ⚠️ doar în development
          expires: 7           // expiră în 7 zile
        });
        const result = Cookies.get('timezoneData');
        const parsed = JSON.parse(result);
        console.log(parsed);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
    onComplete();
  }, [onComplete]);

  return <div></div>;
};

export default CookieSetter;
