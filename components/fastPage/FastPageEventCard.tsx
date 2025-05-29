import { MapPin, Calendar, Users, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

interface CreativeFastEventCardProps extends Event { }

const CreativeFastEventCard: React.FC<CreativeFastEventCardProps> = ({
  title,
  image,
  country,
  city,
  description,
  startHour,
  slug,
  tags = [],
}) => {
  const timeTillEvent = (ISOSstring: string) => {
    const eventDate = new Date(ISOSstring);
    const now = new Date();
    const diffMs = eventDate.getTime() - now.getTime();

    let timeUntilEvent: string;

    if (diffMs <= 0) {
      timeUntilEvent = "Event already passed";
    } else {
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours < 1) {
        const diffMinutes = Math.round(diffMs / (1000 * 60));
        timeUntilEvent = `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""}`;
      } else {
        const roundedHours = Math.round(diffHours);
        timeUntilEvent = `${roundedHours} hour${roundedHours !== 1 ? "s" : ""}`;
      }
    }

    return timeUntilEvent;
  }

  const formatEventTime = () => {
    const eventDate = new Date(startHour)
    return eventDate.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="group bg-gradient-to-br from-white via-purple-100 to-blue-100 border-2 w-[320px] h-[415px] transition-all duration-500 cursor-pointer overflow-hidden transform hover:scale-105 hover:-translate-y-2 shadow-lg border-purple-200">
      <Link href={`/events/${slug}`} className="block h-full">
        <CardHeader className="relative flex flex-row items-center justify-between gap-2 p-3 pb-2 overflow-hidden">
          <div className="flex items-center gap-2 z-10">
            <MapPin className="h-4 w-4 text-purple-600 animate-pulse" />
            <span className="text-xs font-semibold text-gray-700 truncate">
              {city}, {country}
            </span>
          </div>
          <Badge className="text-xs font-bold text-white border-0 bg-gradient-to-r from-gray-500 to-gray-600 shadow-lg shadow-gray-500/50">
            ⏰ {timeTillEvent(startHour)}
          </Badge>
        </CardHeader>

        <div className="relative h-40 w-full">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="transition-all duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20" />
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold line-clamp-2 leading-tight flex-1">{title}</h3>
            </div>
          </div>
        </div>

        <CardContent className="p-3 space-y-3">
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{description}</p>
          <div className="flex items-center gap-2 text-xs text-gray-700 p-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
            <Calendar className="h-3 w-3 text-purple-600 animate-pulse" />
            <span className="truncate font-medium">{formatEventTime()}</span>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  className="text-xs px-2 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200 hover:from-purple-200 hover:to-blue-200"
                >
                  #{tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge className="text-xs px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-200">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-3 pt-0">
          <Button className="w-full text-xs font-bold bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/40">
            Explore the Event
          </Button>
        </CardFooter>
      </Link>
    </Card>
  )
}

export default CreativeFastEventCard
