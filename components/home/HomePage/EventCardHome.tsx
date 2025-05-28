'use client'

import { Check, MapPin, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import getColorForTag from "../colorPicker"
import slugify from "slugify"
import Link from "next/link"
import Image from "next/image"

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

  const href = `/events/` + slugify(title, { lower: true })

  return (
    <Link href={href} className="block">
      <Card
        key={id}
        className="group bg-white/80 backdrop-blur-sm border border-gray-200 shadow-md hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-2 w-100 h-[400px] active:scale-[0.97]"
      >
        {/* Header */}
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
              <span>{city}, {country}</span>
            </div>
          </div>
        </CardHeader>

        {/* Image */}
        <div className="relative">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              style={{ objectFit: "cover" }}
              sizes="100vw"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-xs">Hosted by {hostName}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <CardContent className="p-4 pb-4 pt-3">
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </CardContent>

        {/* Tags */}
        <CardContent className="p-4 pb-2 pt-0">
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => {
              const colorClass = getColorForTag(tag);
              return (
                <Badge key={index} className={`text-sm font-semibold ${colorClass}`}>
                  {tag}
                </Badge>
              );
            })}
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex justify-between items-center p-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
          <span className="text-green-600 font-semibold text-base">Explore →</span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default EventCardHome; 