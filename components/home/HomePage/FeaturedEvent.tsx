'use client'

import { Calendar, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import slugify from "slugify"
import Link from "next/link"
import Image from "next/image"

const FeaturedEvent = ({ title, description, city, country, date, tags, image }) => {
  const formattedDate = new Date(date).toLocaleString("en-US", {
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
    <section className="mb-8 sm:mb-10 md:mb-12">
      <div className="relative rounded-lg sm:rounded-xl overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt="Featured event"
          width={1920}
          height={768}
          className="w-full h-64 sm:h-80 md:h-96 lg:h-[32rem] object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-6 md:p-8 lg:p-10">
          <Badge className="mb-2 sm:mb-3 w-fit bg-yellow-400 text-yellow-900 text-xs sm:text-sm font-semibold">
            Featured Event
          </Badge>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 leading-tight">
            {title}
          </h2>

          <p className="text-white/90 mb-3 sm:mb-4 max-w-full sm:max-w-xl md:max-w-2xl text-sm sm:text-base leading-relaxed line-clamp-2 sm:line-clamp-3">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-white/80 mb-3 sm:mb-4 text-sm sm:text-base">
            <div className="flex items-center gap-1 sm:gap-2">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">
                {country}, {city}
              </span>
            </div>
          </div>

          <Link href={href} passHref>
            <Button className="w-fit bg-black/50 text-white hover:bg-black/70 transition-colors duration-200 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
              Register Now
            </Button>
          </Link>

          {/* TAGS - positioned bottom right with responsive behavior */}
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex flex-wrap gap-1 sm:gap-2 max-w-[40%] sm:max-w-[50%] justify-end">
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                className="bg-black/70 text-white text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1 rounded-full font-medium"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge className="bg-black/70 text-white text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1 rounded-full font-medium">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedEvent;