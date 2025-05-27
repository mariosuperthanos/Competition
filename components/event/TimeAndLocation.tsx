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
import Cookies from "js-cookie";

interface TimeAndLocationProps {
  time: {
    startHour: string;
    endHour: string;
  };
  location: {
    timezone: string;
    country: string;
    city: string;
    lat: string;
    lng: string;
  };
  timezone: string;
}

export default function TimeAndLocationCard({
  time,
  location,
  timezone
}: TimeAndLocationProps) {
  const Map = dynamic(() => import("./Map"), {
    ssr: false,
  });

  const { date, startHour, endHour } = formatEventDate(
    time,
    location.country,
    location.city,
    location.timezone,
    timezone,
  );

  return (
    <Fragment>
      <div
        className="flex flex-col p-4 space-y-8"
        style={{ marginLeft: "20px" }}
      >
        <Card className="space-y-4 p-6 w-full max-w-lg">
          <CardTitle className="text-xl font-semibold">
            Event Time & Location
          </CardTitle>
          <CardContent className="space-y-2">
            <p>
              <strong>Date:</strong> {date}
            </p>
            <p>
              <strong>Start Time:</strong> {startHour}
            </p>
            <p>
              <strong>End Time:</strong> {endHour}
            </p>
            <p>
              <strong>Location:</strong> Latitude: {location.lat}, Longitude:{" "}
              {location.lng}
            </p>
          </CardContent>
        </Card>
        <div className="w-2/5 h-[200px]">
          <MapComponent
            lat={location.lat}
            lng={location.lng}
            shouldRender={true}
            settings={{ purpose: "marker" }}
          />
        </div>
      </div>
    </Fragment>
  );
}
