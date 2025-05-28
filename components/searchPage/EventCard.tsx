"use client";

import { Clock, MapPin, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link";
import slugify from "slugify";
import Image from "next/image";

interface EventCardProps {
  title: string
  image: string
  country: string
  city: string
  description: string
  startHour: string
  slug: string
  timezone: string
  tags?: string[]
}

export function EventCard({
  title,
  image,
  country,
  city,
  description,
  startHour,
  slug,
  timezone,
  tags = [],
}: EventCardProps) {

  const formattedDate = new Date(startHour).toLocaleString("en-US", {
    timeZone: timezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <Link href={`/events/${slug}`} className="block">
      <Card className="group bg-white/80 backdrop-blur-sm border border-gray-200 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-2 w-100 h-[400px]">
        <div className="relative overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            width={800}         // Pune valori realiste
            height={192}        // h-48 ≈ 12rem = 192px
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 right-4">
            <Badge className="bg-white/90 text-gray-900 hover:bg-white">{timezone}</Badge>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 text-white">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">{formattedDate}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-xl text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <MapPin className="h-4 w-4 text-purple-500" />
            <span className="text-sm">
              {city}, {country}
            </span>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{description}</p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs text-gray-500">
                  +{tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link >
  )
}
