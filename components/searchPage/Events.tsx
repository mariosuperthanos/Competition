'use server';

import { EventCard } from "./EventCard";



const Events = ({ eventsArray }) => {
  console.log("Events from store:", eventsArray); // Log pentru a verifica datele din store 
  console.log("length", eventsArray.length)

  return (
    // Main Content - Centered
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Events Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Upcoming Events
          </h2>
        </div>

        {eventsArray.length === 0 && (
          <div className="text-center text-gray-700">
            <p className="text-lg">No events found matching your criteria.</p>
          </div>
        )}

        {/* Centered Events Grid */}
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-items-center">
              {eventsArray.map((event, index) => (
                <EventCard
                  key={index}
                  title={event.title}
                  image={event.image}
                  country={event.country}
                  city={event.city}
                  description={event.description}
                  startHour={event.startHour}
                  slug={event.slug}
                  timezone={event.timezone}
                  tags={event.tags}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Events;
