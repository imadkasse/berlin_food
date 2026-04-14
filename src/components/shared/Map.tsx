"use client";

import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { useState, useCallback } from "react";
import { MapPin } from "lucide-react";

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  defaultCenter?: { lat: number; lng: number };
}

// Inner component to access the Map instance
const LocateButton = ({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) => {
  const map = useMap();

  const handleLocate = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      // Move the map
      if (map) {
        map.panTo({ lat: latitude, lng: longitude });
        map.setZoom(16);
      }

      // Trigger selection
      onLocationSelect(latitude, longitude);
    });
  };

  return (
    <button
      type="button"
      onClick={handleLocate}
      className="absolute bottom-4 right-4 z-20 bg-primary text-on-primary p-3 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
      title="Use my current location">
      <MapPin className="w-5 h-5" />
    </button>
  );
};

export function MapPicker({
  onLocationSelect,
  defaultCenter = { lat: 36.75, lng: 3.05 }, // Default to Algiers center
}: MapPickerProps) {
  const [markerPos, setMarkerPos] = useState<google.maps.LatLngLiteral | null>(
    null,
  );

  const handleMapClick = useCallback(
    (e: any) => {
      const newPos = { lat: e.detail.latLng.lat, lng: e.detail.latLng.lng };
      setMarkerPos(newPos);
      onLocationSelect(newPos.lat, newPos.lng);
    },
    [onLocationSelect],
  );

  const handleManualLocation = (lat: number, lng: number) => {
    setMarkerPos({ lat, lng });
    onLocationSelect(lat, lng);
  };

  return (
    <div className="relative w-full h-full  rounded-lg overflow-hidden border-2 border-outline-variant/20 shadow-inner">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={12}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          onClick={handleMapClick}
          className="w-full h-full">
          {markerPos && <Marker position={markerPos} />}
          <LocateButton onLocationSelect={handleManualLocation} />
        </Map>
      </APIProvider>
    </div>
  );
}
