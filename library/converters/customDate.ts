interface Time {
  date: string;       // Dată în format ISO (e.g., "2025-03-14T09:00:00Z")
  startHour: string;  // Ora de început în format "HH:MM AM/PM"
  endHour: string;    // Ora de sfârșit în format "HH:MM AM/PM"
}

const formatEventDate = (time: Time): string => {
  // Funcție pentru a converti "HH:MM AM/PM" în "HH:MM" (24 de ore)
  const convertTo24HourFormat = (time12h: string): string => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00'; // 12:00 AM devine 00:00
    if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12); // Adaugă 12 pentru PM
    return `${hours}:${minutes}`;
  };

  // Extrage doar partea de dată (ignoră timpul și fusul orar)
  const dateOnly = time.date.split('T')[0];

  // Combină data cu orele convertite pentru a crea obiecte Date
  const startDateTime = new Date(`${dateOnly}T${convertTo24HourFormat(time.startHour)}:00`);
  const endDateTime = new Date(`${dateOnly}T${convertTo24HourFormat(time.endHour)}:00`);

  // Opțiuni pentru formatarea datei
  const optionsDate: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  // Opțiuni pentru formatarea orei
  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  // Formatează data și orele
  const formattedDate = startDateTime.toLocaleDateString('en-US', optionsDate);
  const formattedStartTime = startDateTime.toLocaleTimeString('en-US', optionsTime);
  const formattedEndTime = endDateTime.toLocaleTimeString('en-US', optionsTime);

  // Returnează șirul formatat
  return `${formattedDate} ${formattedStartTime} to ${formattedEndTime} CET`;
};

export default formatEventDate;