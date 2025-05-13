import Image from "next/image"; // Import Next.js Image component
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export interface EventCardProps {
  title: string;
  image: string;
  country: string;
  city: string;
  description: string;
  startHour: string;
  slug: string;
}

const EventCard: React.FC<EventCardProps> = ({ title, image, country, city, description, startHour, slug, timezone }) => {
  const url = `/events/${slug}`; // Construct the URL for the event details page
  const formattedDate = new Date(startHour).toLocaleString("en-US", {
    timeZone: timezone, // Use the timezone from the event data
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <Card className="w-full max-w-[730px] p-4 sm:p-6 relative overflow-hidden rounded-md shadow-md">
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
        {/* Imaginea */}
        <div className="relative w-full sm:w-[40%] h-[157px] flex-shrink-0 overflow-hidden rounded-md">
          <Image
            src={image}
            alt={title}
            width={280}
            height={157}
            className="object-cover w-full h-full rounded-md"
          />
        </div>

        {/* Detalii */}
        <div className="flex-1 sm:min-w-[50%] pr-1 sm:pr-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-left">{title}</h3>
            <p className="text-sm sm:text-base text-muted-foreground text-left">
              {city}, {country}
            </p>
            <p className="mt-2 line-clamp-3 text-sm sm:text-base text-left pb-2.5">
              {description}
            </p>
          </div>

          {/* Butoane */}
          <div className="flex justify-between items-center mt-4 sm:mt-6">
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
    </Card>
  );
};

export default EventCard;
