import { useEffect } from "react";
import saveTimezone from "../library/getUserData.ts/saveTimezone";

const CookieSetter = () => {
  useEffect(() => {
    saveTimezone();
  }, []);

  return <div></div>;
};

export default CookieSetter;
