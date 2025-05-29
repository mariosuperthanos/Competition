import FeaturedEvent from "./HomePage/FeaturedEvent"
import EventsHome from "./HomePage/EventsHome"

export default function HomePage({ events, categories, defaultTag }: { categories: string[], events: any[] }) {
  console.log(events.length)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Featured Event */}
        {events.length > 0 && (
          <FeaturedEvent title={events[0].title} description={events[0].description} city={events[0].city} country={events[0].country} date={events[0].date} tags={events[0].tags} image={events[0].image}/>
        )}
        {/* Events List */}
        <EventsHome tags={categories} defaultEvent={events.slice(1)} focusedTag={defaultTag} />
      </main>
    </div>
  )
}
