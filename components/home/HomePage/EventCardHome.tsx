"use client"

import type React from "react"

import { Check, MapPin, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import slugify from "slugify"
import getColorForTag from "../colorPicker"

interface EventCardHomeProps {
  id: string | number
  tags: string[]
  hostName: string
  city: string
  country: string
  image?: string
  title: string
  startHour: string
  description: string
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
  description,
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
  })

  const href = `/events/` + slugify(title, { lower: true })

  return (
    <Link href={href} className="block w-full">
      <Card
        key={id}
        className="group bg-white/80 backdrop-blur-sm border border-gray-200 shadow-md hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-2 w-full h-auto min-h-[350px] sm:min-h-[380px] md:min-h-[400px] active:scale-[0.97]"
      >
        {/* Header */}
        <CardHeader className="flex flex-row items-center gap-2 sm:gap-3 p-3 sm:p-4 pb-1 sm:pb-2">
          <div
            className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full ${getIconColor(tags)}`}
          >
            <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm sm:text-base text-gray-800">{hostName}</span>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
              <MapPin className="h-3 w-3" />
              <span className="truncate">
                {city}, {country}
              </span>
            </div>
          </div>
        </CardHeader>

        {/* Image */}
        <div className="relative">
          <div className="relative h-36 sm:h-40 md:h-48 w-full overflow-hidden">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-3 md:p-4 text-white">
              <h3 className="text-base sm:text-lg font-semibold line-clamp-1">{title}</h3>
              <p className="text-xs line-clamp-1">Hosted by {hostName}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <CardContent className="p-3 sm:p-4 pb-2 sm:pb-3 pt-2 sm:pt-3">
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 md:line-clamp-3">{description}</p>
        </CardContent>

        {/* Tags */}
        <CardContent className="p-3 sm:p-4 pb-1 sm:pb-2 pt-0">
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => {
              const colorClass = getColorForTag(tag)
              return (
                <Badge key={index} className={`text-xs sm:text-sm font-semibold ${colorClass}`}>
                  {tag}
                </Badge>
              )
            })}
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex justify-between items-center p-2 sm:p-3 text-xs text-gray-500 mt-auto">
          <div className="flex items-center gap-1 max-w-[70%]">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{formattedDate}</span>
          </div>
          <span className="text-green-600 font-semibold text-sm sm:text-base">Explore →</span>
        </CardFooter>
      </Card>
    </Link>
  )
}

export default EventCardHome
