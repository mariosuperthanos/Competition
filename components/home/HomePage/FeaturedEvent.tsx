import { Check, Mic, Users, Calendar, MapPin, Music, Film, Book, Coffee, Utensils } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import slugify from "slugify"
import Link from "next/link"

const FeaturedEvent = ({ title, description, city, country, date, tags }) => {
  const formattedDate = new Date(date).toLocaleString("en-US", {
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
    <section className="mb-12">
      <div className="relative rounded-xl overflow-hidden">
        <img
          src="https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg"
          alt="Featured event"
          className="w-full h-96 md:h-[32rem] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 md:p-10">
          <Badge className="mb-2 w-fit bg-yellow-400 text-yellow-900">Featured Event</Badge>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">{title}</h2>
          <p className="text-white/90 mb-4 max-w-2xl">{description}</p>
          <div className="flex items-center gap-4 text-white/80 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-5 w-5" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-5 w-5" />
              <span>{country}, {city}</span>
            </div>
          </div>
          <Link href={href} passHref>
            <Button className="w-fit bg-black/50 text-white hover:bg-black/70">
              Register Now
            </Button>
          </Link>

          {/* TAGS - poziționate jos, dreapta */}
          <div className="absolute bottom-4 right-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} className="bg-black/70 text-white text-base px-3 py-1 rounded-full">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>

  )
}

export default FeaturedEvent;