// // with google maps (need Card and get API KEY)
// "use client";

// import {
//   APIProvider,
//   Map,
//   Marker,
//   useMap,
//   useMapsLibrary,
// } from "@vis.gl/react-google-maps";
// import { useEffect, useState } from "react";

// interface Location {
//   lat: number;
//   lng: number;
// }

// interface RouteMapProps {
//   currentLocation: Location;
//   customerLocation: Location;
// }

// // Inner component to handle the routing logic
// const Directions = ({
//   origin,
//   destination,
// }: {
//   origin: Location;
//   destination: Location;
// }) => {
//   const map = useMap();
//   const routesLibrary = useMapsLibrary("routes");
//   const [directionsService, setDirectionsService] =
//     useState<google.maps.DirectionsService>();
//   const [directionsRenderer, setDirectionsRenderer] =
//     useState<google.maps.DirectionsRenderer>();

//   // 1. Initialize the Google Maps Directions services
//   useEffect(() => {
//     if (!routesLibrary || !map) return;
//     setDirectionsService(new routesLibrary.DirectionsService());

//     // suppressMarkers prevents default A/B pins so our custom ones show up
//     setDirectionsRenderer(
//       new routesLibrary.DirectionsRenderer({
//         map,
//         suppressMarkers: true,
//         polylineOptions: {
//           strokeColor: "#3b82f6", // Blue route line
//           strokeWeight: 5,
//         },
//       }),
//     );
//   }, [routesLibrary, map]);

//   // 2. Calculate and display the route when locations change
//   useEffect(() => {
//     if (!directionsService || !directionsRenderer) return;

//     directionsService
//       .route({
//         origin,
//         destination,
//         travelMode: google.maps.TravelMode.DRIVING,
//       })
//       .then((response) => {
//         // This automatically adjusts the zoom and center to fit the whole road!
//         directionsRenderer.setDirections(response);
//       })
//       .catch((error) => {
//         // IF THE ROAD DOESN'T SHOW, CHECK YOUR BROWSER CONSOLE FOR THIS ERROR
//         console.error("🚨 Directions request failed:", error);
//         if (error.code === "REQUEST_DENIED") {
//           console.error(
//             "Make sure the 'Directions API' is enabled in Google Cloud Console.",
//           );
//         }
//       });
//   }, [directionsService, directionsRenderer, origin, destination]);

//   return null;
// };

// export function RouteMap({ currentLocation, customerLocation }: RouteMapProps) {
//   return (
//     <div className="relative w-full h-[500px] rounded-lg overflow-hidden border-2 border-outline-variant/20 shadow-inner">
//       <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
//         <Map
//           defaultCenter={currentLocation} // <--- ADDED: Centers map on load
//           defaultZoom={13} // <--- ADDED: Sets initial zoom
//           gestureHandling={"greedy"}
//           disableDefaultUI={true}
//           className="w-full h-full">
//           {/* Custom markers for Origin and Destination */}
//           <Marker position={currentLocation} title="Your Location" />
//           <Marker position={customerLocation} title="Customer Location" />

//           {/* The component that calculates and draws the road */}
//           <Directions origin={currentLocation} destination={customerLocation} />
//         </Map>
//       </APIProvider>
//     </div>
//   );
// }
"use client";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";

// ✅ FIX مشكلة اختفاء الماركر
delete (L.Icon.Default.prototype as { _getIconUrl: string | undefined })
  ._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface Location {
  lat: number;
  lng: number;
}

interface RouteMapProps {
  currentLocation: Location;
  customerLocation: Location;
}

export default function RouteMap({
  currentLocation,
  customerLocation,
}: RouteMapProps) {
  const [route, setRoute] = useState<[number, number][]>([]);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${currentLocation.lng},${currentLocation.lat};${customerLocation.lng},${customerLocation.lat}?overview=full&geometries=geojson`;

        const res = await fetch(url);
        const data = await res.json();

        if (!data.routes || data.routes.length === 0) {
          console.error("No route found");
          return;
        }

        const coords = data.routes[0].geometry.coordinates;

        // تحويل [lng, lat] → [lat, lng]
        const formatted: [number, number][] = coords.map(
          ([lng, lat]: [number, number]) => [lat, lng],
        );

        setRoute(formatted);
      } catch (err) {
        console.error("Error fetching route:", err);
      }
    };

    fetchRoute();
  }, [currentLocation, customerLocation]);

  return (
    <div className="w-full h-[500px]">
      <MapContainer
        center={currentLocation}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full rounded-lg">
        {/* 🗺️ Map tiles من OpenStreetMap */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 📍 Markers */}
        <Marker position={currentLocation} />
        <Marker position={customerLocation} />

        {/* 🛣️ Route */}
        {route.length > 0 && <Polyline positions={route} />}
      </MapContainer>
    </div>
  );
}
