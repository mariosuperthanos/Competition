import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import TimeAndLocationCard from "./TimeAndLocation";

interface PageProps {
  title: string;
  description: string;
  time: {
    date: string;
    startHour: string;
    endHour: string;
  };
  host: string;
  location: { lat: string; lng: string };
  image: string;
}

export default async function Event({
  title,
  description,
  time,
  host,
  location,
  image,
}: PageProps) {
  
  const cardStyle = {
    width: "50rem",
    priority: "high", // increase priority!
    maxHeight: "30rem",
  };
  
  return (
    <div className="flex justify-center items-start p-8 mt-16">
      <Card style={cardStyle} className="space-y-4 p-6">
        <CardTitle>{title}</CardTitle>
        <Image
          src={image}
          alt="Event Image"
          width={400}
          height={300}
          layout="intrinsic"
          priority
        />
        <p className="text-xl font-semibold">Description:</p>
        <CardDescription>{description}</CardDescription>
        <CardFooter>
          <p>Join us for an exciting learning experience!</p>
        </CardFooter>
      </Card>
      <TimeAndLocationCard time={time} location={location} />
    </div>
  );
  
}
