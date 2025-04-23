const ISOtoClient = (ISOstring: string, timezone: string): string => {
  const date = new Date(ISOstring);

  return date.toLocaleString("en-US", {
    timeZone: timezone,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
};

export default ISOtoClient;
