import EventCard from "./EventCard";

const Events = ({ eventsArray }) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col justify-center gap-4">
        {eventsArray.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </div>
    </div>
  );
};

export default Events;
