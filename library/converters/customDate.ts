interface Time {
  date: string;       // Dată în format ISO (e.g., "2025-03-14T09:00:00Z")
  startHour: string;  // Ora de început în format "HH:MM AM/PM"
  endHour: string;    // Ora de sfârșit în format "HH:MM AM/PM"
}

const formatEventDate = (time: Time): string => {
  const convertTo24HourFormat = (time12h: string): string => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
    return `${hours}:${minutes}`;
  };

  const dateOnly = time.date.split('T')[0];

  const startDateTime = new Date(`${dateOnly}T${convertTo24HourFormat(time.startHour)}:00`);
  const endDateTime = new Date(`${dateOnly}T${convertTo24HourFormat(time.endHour)}:00`);

  const optionsDate: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const formattedDate = startDateTime.toLocaleDateString('en-US', optionsDate);
  const formattedStartTime = startDateTime.toLocaleTimeString('en-US', optionsTime);
  const formattedEndTime = endDateTime.toLocaleTimeString('en-US', optionsTime);

  return `${formattedDate} ${formattedStartTime} to ${formattedEndTime} CET`;
};

export default formatEventDate;