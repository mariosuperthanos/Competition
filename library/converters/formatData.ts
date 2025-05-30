const formatData = (dateStr: string, hourStr: string) => {
  const baseDate = new Date(dateStr);

  const [time, period] = hourStr.split(" "); // e.g., "12:30 PM"
  const [hour, minute] = time.split(":");

  let hourInt = parseInt(hour);

  if (period === "PM" && hourInt < 12) {
    hourInt += 12;
  } else if (period === "AM" && hourInt === 12) {
    hourInt = 0;
  }

  baseDate.setHours(hourInt);
  baseDate.setMinutes(parseInt(minute));
  baseDate.setSeconds(0);
  baseDate.setMilliseconds(0);

  return baseDate.toISOString();
};

export default formatData;
