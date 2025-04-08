export const timeToMinutes = (time: string) => {
  const [hour, minute] = time.split(":");
  const [minutes, period] = minute.split(" ");
  let hours24 = parseInt(hour);

  if (period === "PM" && hours24 !== 12) {
    hours24 += 12;
  } else if (period === "AM" && hours24 === 12) {
    hours24 = 0;
  }

  return hours24 * 60 + parseInt(minutes);
};