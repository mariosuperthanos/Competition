'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventCardHome from "./EventCardHome"
import Link from "next/link"

const EventsHome = ({ defaultEvent, tags, focusedTag = "all" }) => {
  return (
    // Event Categories
    <section className="mb-10 px-4 md:px-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Events</h2>
      <Tabs defaultValue="all" className="w-full">
        <Tabs value={focusedTag} className="w-full h-auto">
          <TabsList className="mb-10 flex flex-wrap gap-2 justify-start h-auto">
            <TabsTrigger
              value="all"
              className={`px-2 md:px-3 py-1 text-sm md:text-base bg-white text-gray-700 hover:bg-gray-50 
          transition-transform duration-200
          ${focusedTag === "all"
                  ? "bg-gray-900 text-white shadow-xl scale-105"
                  : "shadow-sm scale-100"} 
          data-[state=active]:bg-white data-[state=active]:text-gray-700 
          focus:outline-none`}
              onClick={(e) => e.preventDefault()}
            >
              <Link href="/" legacyBehavior>
                <a className="block w-full h-full">All Events</a>
              </Link>
            </TabsTrigger>

            {tags.map((tag) => (
              <TabsTrigger
                key={tag}
                value={tag}
                className={`px-2 md:px-3 py-1 text-sm md:text-base bg-white text-gray-700 hover:bg-gray-50 
            transition-transform duration-200
            ${focusedTag === tag
                    ? "bg-gray-900 text-white shadow-xl scale-110"
                    : "shadow-sm scale-100"} 
            data-[state=active]:bg-white data-[state=active]:text-gray-700 
            focus:outline-none`}
                onClick={(e) => e.preventDefault()}
              >
                <Link href={`/recomandations/${tag.charAt(0).toLowerCase() + tag.slice(1)}`} legacyBehavior>
                  <a className="block w-full h-full">{tag}</a>
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {defaultEvent.length !== 0 ? (
          <TabsContent value="all" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {defaultEvent.map((event) => (
                <EventCardHome
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  startHour={event.startHour}
                  country={event.country}
                  city={event.city}
                  tags={event.tags}
                  image={event.image}
                  hostName={event.hostName}
                />
              ))}
            </div>
          </TabsContent>
        ) : (
          <p className="text-center text-gray-700">
            There were no events found with the "{focusedTag}" tag.
          </p>

        )}
      </Tabs>
    </section>
  );
}

export default EventsHome;