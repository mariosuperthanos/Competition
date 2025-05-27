'use server';

import EventCard from "./EventCard";
import { EventCardProps } from "./EventCard";

const Events = ({ eventsArray }: { eventsArray: EventCardProps[] }) => {
  console.log("Events from store:", eventsArray); // Log pentru a verifica datele din store 
  console.log("length", eventsArray.length)

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {eventsArray !== null && eventsArray.length > 0 ? (
        <div className="flex flex-col justify-center gap-4">
          {eventsArray.map((event: EventCardProps, index: number) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
      ) : (
        <p>Loading...</p> // Show a message if there are no events
      )}
    </div>
  );
  
};

export default Events;
