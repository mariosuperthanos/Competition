const formatData = (dateStr: string, hourStr: string) => {
  const baseDate = new Date(dateStr);

  const [time, period] = hourStr.split(" "); // time: 12:00, period: PM
  const [hour, minute] = time.split(":");

  let hourInt = parseInt(hour);

  if (period === "PM" && hourInt === 12) {
    hourInt += 12;
  } else if (period === "AM" && hourInt === 12) {
    hourInt = 0;
  }

  baseDate.setHours(hourInt);
  baseDate.setMinutes(parseInt(minute));

  // const formattedDate = baseDate.toLocaleString("en-US", {
  //   timeZone:"America/New_York",
  //   weekday: "short",
  //   year: "numeric",
  //   month: "short",
  //   day: "numeric",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   timeZoneName: "long",
  // });
  // console.log(formattedDate);

  return baseDate.toISOString();
};

export default formatData;
