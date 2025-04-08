// import React, { useEffect, useRef } from "react";
// import mapboxgl from "mapbox-gl";
// import { parse } from "path";
// import 'mapbox-gl/dist/mapbox-gl.css';

// const MapComponent = ({ lat, lng, shouldRender }: { lat: string; lng: string; shouldRender: boolean }) => {
//   console.log(lat, lng);
//   const latitude = parseFloat(lat);
//   const longitudine = parseFloat(lng);
//   const mapContainer = useRef(null);
//   const map = useRef(null);

//   useEffect(() => {
//     // Initialize map only once
//     if (map.current) return;

//     mapboxgl.accessToken =
//       "pk.eyJ1IjoiY3Jvbm9zcmVhcGVyIiwiYSI6ImNtNm1udWt2dTBocDAya3NtemJic2F5NmoifQ.LT4dGB9RjShlozhmAVzm-w";

//     map.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: "mapbox://styles/mapbox/streets-v11",
//       center: [latitude, longitudine], // Bucharest coordinates
//       zoom: 12,
//     });

//     // Cleanup function
//     return () => map.current?.remove();
//   }, []);

//   return (
//     <div
//       style={{
//         width: "50%",
//         height: "200px",
//         position: "relative",
//         paddingLeft: "20px",
//         paddingTop: "50px",
//         marginTop: '20px',
//         marginLeft: '20px',
//         display: shouldRender ? 'block' : 'none',
//       }}
//     >
//       <div
//         ref={mapContainer}
//         style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
//       />
//     </div>
//   );
// };

// export default MapComponent;

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import getLocation from "../../library/map/getLocation";

const MapComponent = ({
  lat,
  lng,
  shouldRender,
  passData,
}: {
  lat: string;
  lng: string;
  shouldRender: boolean;
  passData: any;
}) => {
  const [isMarkup, setIsMarkup] = useState<boolean>(false);
  // console.log(lat, lng);
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    // Verificăm dacă avem container și dacă renderarea este permisă
    if (!mapContainer.current || !shouldRender) return;

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    // Verificăm dacă coordonatele sunt valide
    if (isNaN(latitude) || isNaN(longitude)) {
      console.error("Coordonate invalide:", { lat, lng });
      return;
    }

    // Inițializăm harta dacă nu există
    if (!map.current) {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiY3Jvbm9zcmVhcGVyIiwiYSI6ImNtNm1udWt2dTBocDAya3NtemJic2F5NmoifQ.LT4dGB9RjShlozhmAVzm-w";

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [longitude, latitude], // Notă: Mapbox folosește [lng, lat]
        zoom: 12,
      });

      // Adăugăm marker-ul inițial
      // marker.current = new mapboxgl.Marker()
      //   .setLngLat([longitude, latitude])
      //   .addTo(map.current);
    } else {
      // Dacă harta există deja, actualizăm doar poziția
      map.current.setCenter([longitude, latitude]);
      marker.current?.setLngLat([longitude, latitude]);
    }

    if()
    map.current.on("click", async (e) => {
      const { lat, lng } = e.lngLat;
      // console.log("Click coordinates:", lat, lng);

      // Ștergem marker-ul existent dacă există
      if (marker.current) {
        marker.current.remove();
      }

      // Creăm și adăugăm noul marker
      marker.current = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map.current!);

      let city;

      // Loop care rulează de maximum 5 ori cât timp city este undefined
      for (let i = 0; i < 10; i++) {
        const { city: currentCity, country } = await getLocation(lat, lng);
        city = currentCity;

        if (city !== undefined) {
          // console.log(`City found: ${city}, Country: ${country}`);
          passData(city, country);
          break; // Oprește bucla când city nu mai este undefined
        } else {
          // console.log(`City is still undefined. Attempt ${i + 1}`);
        }
      }
    });

    // Cleanup function
    return () => {
      if (map.current) {
        marker.current?.remove();
        map.current.remove();
        map.current = null;
        marker.current = null;
      }
    };
  }, [lat, lng, shouldRender]); // Dependențe actualizate

  return (
    <div
      style={{
        width: "50%",
        height: "200px",
        position: "relative",
        paddingLeft: "20px",
        paddingTop: "50px",
        marginTop: "20px",
        marginLeft: "20px",
        display: shouldRender ? "block" : "none",
      }}
    >
      <div
        ref={mapContainer}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
    </div>
  );
};

export default MapComponent;
