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
    date: string; // Recomandat să fie un string în format ISO, dacă vrei să-l folosești cu JSON
    startHour: string;
    endHour: string;
  };
  host: string;
  location: { lat: string; lng: string }; // Folosirea unui obiect pentru locație
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
    width: "50rem", // 96 în Tailwind, în unități rem
    priority: "high", // Exemplu pentru setarea unei proprietăți de prioritate
    maxHeight: "30rem", // Setează înălțimea minimă la 20rem
  };
  
  return (
    <div className="flex justify-center items-start p-8 mt-16"> {/* mt-8 pentru a reduce spațiul de sus */}
      <Card style={cardStyle} className="space-y-4 p-6">
        <CardTitle>{title}</CardTitle>
        <Image
          src={image} // Image URL
          alt="Event Image"
          width={400} // Image width
          height={300} // Image height
          layout="intrinsic" // Ensure the image is responsive
          priority // Image optimization for better LCP
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
