import { useState } from "react"
import { Check, Users, Calendar, MapPin, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import getColorForTag from "../colorPicker"
import slugify from "slugify"
import Link from "next/link"



interface EventCardHomeProps {
  id: string | number;
  tags: string[];
  hostName: string;
  city: string;
  country: string;
  image?: string;
  title: string;
  startHour: string;
  description: string;
}

const EventCardHome: React.FC<EventCardHomeProps> = ({
  id,
  tags,
  hostName,
  city,
  country,
  image,
  title,
  startHour,
  description
}) => {
  const getIconColor = (category: string) => {
    switch (category) {
      case "career":
        return "bg-purple-600"
      case "tech":
        return "bg-blue-600"
      case "arts":
        return "bg-pink-600"
      case "wellness":
        return "bg-green-600"
      case "music":
        return "bg-yellow-600"
      case "food":
        return "bg-orange-600"
      default:
        return "bg-gray-600"
    }
  }

  const formattedDate = new Date(startHour).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const href = `/events/`+ slugify(title, { lower: true })

  return (
    <Card key={id} className="overflow-hidden border shadow-md hover:shadow-lg transition-shadow bg-white">
      {/* Header with host and location */}
      <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${getIconColor(tags)}`}
        >
          <Check className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">{hostName}</span>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="h-3 w-3" />
            <span>
              {city}, {country}
            </span>
          </div>
        </div>
      </CardHeader>

      {/* Main image with event details overlay */}
      <div className="relative">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-cover"
          />

          {/* Event details overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-xs">Hosted by {hostName}</p>
          </div>
        </div>
      </div>

      {/* Event description */}
      <CardContent className="p-4 pb-4 pt-3">
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      </CardContent>

      {/* Tags */}
      <CardContent className="p-4 pb-2 pt-0">
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => {
            const colorClass = getColorForTag(tag);
            return (
              <Badge
                key={index}
                className={`text-sm font-semibold ${colorClass}`}
              >
                {tag}
              </Badge>
            );
          })}
        </div>
      </CardContent>

      {/* Footer with location and join button */}
      <CardFooter className="flex justify-between items-center p-3">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>{formattedDate}</span>
        </div>
        <Link href={href}>
          <Button className="outline bg-green-500 text-white px-4 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base font-semibold hover:bg-green-600 transition-colors duration-200 ease-in-out">
            Join
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default EventCardHome; 