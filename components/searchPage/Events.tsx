'use client';

import { useEffect } from "react";
import useStore from "../../zustand/store";
import EventCard from "./EventCard";
import { EventCardProps } from "./EventCard";

const Events = ({ eventsArray }: { eventsArray: EventCardProps[] }) => {
  const events = useStore((state) => state.events);
  console.log("Events from store:", events); // Log pentru a verifica datele din store 
  console.log("length", eventsArray.length)
  useEffect(() => {
    useStore.setState({ events: eventsArray });
    if (eventsArray.length === 11) {
      useStore.setState({ isNextPage: true })
    } else {
      useStore.setState({ isNextPage: false })
    }
  }, [eventsArray]);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {events !== null && events.length > 0 ? (
        <div className="flex flex-col justify-center gap-4">
          {events.map((event: EventCardProps, index: number) => (
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
