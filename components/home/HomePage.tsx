"use client"

import { useEffect, useState } from "react"
import { Check, Mic, Users, Calendar, MapPin, Music, Film, Book, Coffee, Utensils } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FeaturedEvent from "./HomePage/FeaturedEvent"
import EventCard from "../searchPage/EventCard"
import EventCardHome from "./HomePage/EventCardHome"
import EventsHome from "./HomePage/EventsHome"
import useStore from "../../zustand/store"

export default function HomePage({ events, categories, defaultTag }: { categories: string[], events: any[] }) {
  console.log(events.length)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Featured Event */}
        {events.length > 0 && (
          <FeaturedEvent title={events[0].title} description={events[0].description} city={events[0].city} country={events[0].country} date={events[0].date} tags={events[0].tags} />
        )}
        <EventsHome tags={categories} defaultEvent={events.slice(1)} focusedTag={defaultTag} />
      </main>
    </div>
  )
}
