import Image from "next/image"; // Import Next.js Image component
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const EventCard = ({ title, image, country, city, description, startHour }) => {
  return (
    <Card className="w-[730px] p-6 relative max-h-52 overflow-hidden rounded-md shadow-md">
      <div className="flex gap-4">
        {/* Image in the left upper corner */}
        <div className="relative w-[280px] h-[157px] flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={image}
          alt={title}
          width={280} // Specify width
          height={157} // Specify height
          className="object-cover rounded-md"
        />

        </div>

       {/* Event details */}
       <div className="flex-1 pr-16">
          <h3 className="text-xl font-bold text-left">{title}</h3>
          <p className="text-sm text-muted-foreground text-left">
            {city}, {country}
          </p>
          <div className="w-[380px]">
            <p className="mt-2 line-clamp-3 text-sm text-left">{description}</p>
          </div>
          {/* Start hour in a colored square */}
          <div className="absolute top-[144px] ">
            {" "}
            {/* Poziționare absolută */}
            <div className="flex items-center justify-start rounded-md bg-blue-400 text-primary-foreground p-2">
              <span className="text-sm font-medium">{startHour}</span>
            </div>
          </div>
          <div className="absolute top-[144px] right-10">
            {" "}
            {/* Poziționare absolută */}
            <button className="flex items-center justify-start rounded-md bg-green-400 text-primary-foreground p-2 px-2.75 hover:bg-green-600 transition-colors duration-200 ease-in-out">
              <span className="text-sm font-medium">Join</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
