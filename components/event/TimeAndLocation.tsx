"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { Fragment } from "react";
import MapComponent from "./Map";
import formatEventDate from "../../library/converters/customDate";

interface TimeAndLocationProps {
  time: {
    date: string;
    startHour: string;
    endHour: string;
  };
  location: {
    lat: string;
    lng: string;
  };
}

export default function TimeAndLocationCard({
  time,
  location,
}: TimeAndLocationProps) {
  const Map = dynamic(() => import("./Map"), {
    ssr: false, // Dezactivează server-side rendering
  });
  const formattedString = formatEventDate(time);

  return (
    <Fragment>
      <div className="flex flex-col p-4 space-y-8" style={{ marginLeft: '20px' }}>
        <Card className="space-y-4 p-6 w-full max-w-lg" >
          <CardTitle className="text-xl font-semibold">
            Event Time & Location
          </CardTitle>
          <CardContent className="space-y-2">
            <p>
              <strong>Date:</strong>{" "}
              {formattedString}
            </p>
            <p>
              <strong>Start Time:</strong> {time.startHour}
            </p>
            <p>
              <strong>End Time:</strong> {time.endHour}
            </p>
            <p>
              <strong>Location:</strong> Latitude: {location.lat}, Longitude:{" "}
              {location.lng}
            </p>
          </CardContent>
        </Card>
        <div className="w-2/5 h-[200px]">
          <MapComponent lat={location.lat} lng={location.lng} shouldRender={true} />
        </div>
      </div>
    </Fragment>
  );
}
