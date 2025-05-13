import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import getLocation from "../../library/map/getLocation";

interface Coords {
  lat: number;
  lng: number;
}
// the map can have 3 purposes:
// 1. for creating an event -> interactive
// 2. for searching for more events in a specific area, therfore more murkups -> search
// 3. for displaying the locaiton of a specific event, 1 markup -> marker
interface Settings {
  purpose: "interactive" | "search" | "marker";
  passData?: any;
  searchMarkups?: [Coords];
}

const MapComponent = ({
  lat,
  lng,
  shouldRender,
  settings,
}: {
  lat: string;
  lng: string;
  shouldRender: boolean;
  settings: Settings;
}) => {
  const [isMarkup, setIsMarkup] = useState<boolean>(false);
  // console.log(lat, lng);
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    // if we already have a map or shouldRender is false -> exit useEffect
    if (!mapContainer.current || !shouldRender) return;

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    // Verify the validity of lat and lng
    if (isNaN(latitude) || isNaN(longitude)) {
      console.error("Coordonate invalide:", { lat, lng });
      return;
    }

    //initialize the map and its default settings
    if (!map.current) {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiY3Jvbm9zcmVhcGVyIiwiYSI6ImNtNm1udWt2dTBocDAya3NtemJic2F5NmoifQ.LT4dGB9RjShlozhmAVzm-w";

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [longitude, latitude],
        zoom: 12,
      });

    } else {
      // if the map exists
      map.current.setCenter([longitude, latitude]);
      marker.current?.setLngLat([longitude, latitude]);
    }
    // if the map is for creating an event
    if (settings.purpose == "interactive") {
      // let the user click on the meeting point
      map.current.on("click", async (e) => {
        const { lat, lng } = e.lngLat;
        console.log("Click coordinates:", lat, lng);

        if (marker.current) {
          marker.current.remove();
        }

        // add the new marker
        marker.current = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map.current!);

        let city;
        // console.log("Marker coordinates:", lat, lng);

        const location = await getLocation(lat, lng);
        console.log("Location data:", location);

        if (location) {
          const { city: currentCity, country } = location;
          city = currentCity;

          if (city !== undefined) {
            // console.log(`City found: ${city}, Country: ${country}`);
            settings.passData(city, country, lat, lng);
          }
        }
      });
      // if the map has to display only the meeting point
    } else if (settings.purpose == "marker") {
      const lngMarkup = parseFloat(lng);
      const latMarkup = parseFloat(lat);

      marker.current = new mapboxgl.Marker()
        .setLngLat([lngMarkup, latMarkup])
        .addTo(map.current!);
    }

    // Cleanup function
    return () => {
      if (map.current) {
        marker.current?.remove();
        map.current.remove();
        map.current = null;
        marker.current = null;
      }
    };
  }, [shouldRender]);

  return (
    <div
    style={{
      width: "50%",
      height: settings.purpose !== "marker" ? "200px" : "410px",
      width: "100%",
      position: "relative",
      paddingLeft: "20px",
      paddingTop: "50px",
      marginTop: "20px",
      marginLeft: "0px",
      display: shouldRender ? "block" : "none",
      border: "1px solid black",
      borderRadius: "10px",
      overflow: "hidden", // adaugă asta
    }}
  >
    <div
      ref={mapContainer}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
      }}
    />
  </div>
  );
};


export default MapComponent;
