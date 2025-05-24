import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface EventCardProps {
  title: string
  image: string
  country: string
  city: string
  description: string
  startHour: string
  slug: string
  timezone: string
  tags?: string[] // Optional tags prop
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  image,
  country,
  city,
  description,
  startHour,
  slug,
  timezone,
  tags = [], // Default to empty array if not provided
}) => {
  const url = `/events/${slug}` // Construct the URL for the event details page
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

  // Only display up to 3 tags
  const displayTags = tags?.length > 0 ? tags.slice(0, 3) : []

  return (
    <Card className="w-full max-w-[730px] p-4 sm:p-6 relative overflow-hidden rounded-md shadow-md">
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
        {/* Image */}
        <div className="relative w-full sm:w-[40%] h-[157px] flex-shrink-0 overflow-hidden rounded-md">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            width={280}
            height={157}
            className="object-cover rounded-md"
            priority
          />
        </div>

        {/* Details */}
        <div className="flex-1 sm:min-w-[50%] pr-1 sm:pr-4 flex flex-col h-[157px]">
          {/* Content area with fixed height */}
          <div className="flex flex-col h-full">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-left">{title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground text-left">
                {city}, {country}
              </p>
            </div>

            {/* Middle content with description and tags */}
            <div className="flex-grow overflow-hidden flex flex-col">
              <div className="flex-grow overflow-hidden">
                <p
                  className={`mt-2 text-sm sm:text-base text-left ${displayTags.length > 0 ? "line-clamp-2" : "line-clamp-3"}`}
                >
                  {description}
                </p>
              </div>

              {/* Tags - positioned within the same space as description */}
              {displayTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto mb-1">
                  {displayTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5 rounded-full bg-gray-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center mt-auto">
              <div className="flex items-center justify-start rounded-md bg-blue-400 text-primary-foreground p-1.5 sm:p-2">
                <span className="text-sm sm:text-base font-semibold">{formattedDate}</span>
              </div>
              <Link
                href={url}
                className="flex items-center justify-center rounded-md bg-green-500 text-white px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base font-semibold hover:bg-green-600 transition-colors duration-200 ease-in-out"
              >
                Join
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default EventCard
