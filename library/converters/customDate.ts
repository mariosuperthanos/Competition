"use client";

import Cookies from "js-cookie";
import { DateTime } from "luxon";

interface Time {
  startHour: string;
  endHour: string;
}
const formatEventDate = (
  time: Time,
  country: string,
  city: string,
  timezone: string,
  userTimezone: string
): object => {
  const result = {
    date: "",
    startHour: "",
    endHour: "",
  };
  // const {
  //   data: { userTimezone },
  // } = JSON.parse(Cookies.get("timezoneData"));

  const startHourClient = DateTime.fromISO(time.startHour, { zone: "utc" })
    .setZone(userTimezone)
    .toFormat("hh:mm a");
  const endHourClient = DateTime.fromISO(time.endHour, { zone: "utc" })
    .setZone(userTimezone)
    .toFormat("hh:mm a");
  const startHourEvent = DateTime.fromISO(time.startHour, { zone: "utc" })
    .setZone(timezone)
    .toFormat("hh:mm a");
  const endHourEvent = DateTime.fromISO(time.endHour, { zone: "utc" })
    .setZone(timezone)
    .toFormat("hh:mm a");
  // verify if the event and the user are in the same time zone
  if (startHourClient === startHourEvent) {
    const date = new Date(time.startHour);

    const formattedDate = date.toLocaleString("en-US", {
      timeZone: timezone, // Europe/Bucharest timezone
      weekday: "long", // Full day name
      year: "numeric", // Full year
      month: "long", // Full month name
      day: "numeric", // Day of the month
    });

    result.date = formattedDate + "(the event is in the same timezone as you)";
    result.startHour = startHourClient;
    result.endHour = endHourClient;
  } else {
    result.startHour = `${startHourEvent} in ${country}, ${city}(= ${startHourClient} in your location)`;
    result.endHour = `${endHourEvent} in ${country}, ${city}(= ${endHourClient} in your location)`;
    const date = new Date(time.startHour);
    const formattedDateEvent = date.toLocaleString("en-US", {
      timeZone: timezone, // Europe/Bucharest timezone
      weekday: "long", // Full day name
      year: "numeric", // Full year
      month: "long", // Full month name
      day: "numeric", // Day of the month
    });
    const formattedDateClient = date.toLocaleString("en-US", {
      timeZone: userTimezone, // Europe/Bucharest timezone
      weekday: "long", // Full day name
      year: "numeric", // Full year
      month: "long", // Full month name
      day: "numeric", // Day of he month
    });
    if (formattedDateClient === formattedDateEvent) {
      result.date = formattedDateClient;
    } else {
      result.date = `${formattedDateEvent} in ${country}, ${city}(= ${formattedDateClient} in your location)`;
    }
  }
  return result;
};

export default formatEventDate;
