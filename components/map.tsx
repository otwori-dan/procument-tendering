import React, { useRef } from "react";

import dynamic from 'next/dynamic';
import { Card } from "./ui/card";
import { Pointer } from "lucide-react";

const LeafletMap = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false,
});
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {
  ssr: false,
});
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });


interface MapProps {
  product: any;
  onCoordinatesChange?: (latitude: number, longitude: number) => void;
}

const Map = ({ product,onCoordinatesChange }: MapProps) => {
  const mapRef = useRef(null);
const [latitude, setLatitude] = React.useState(0);
const [longitude, setLongitude] = React.useState(0);
const [isLocationAllowed, setIsLocationAllowed] = React.useState(false);

React.useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      setIsLocationAllowed(true);
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);

      if (onCoordinatesChange) {
        onCoordinatesChange(position.coords.latitude, position.coords.longitude);
      }
    });
  } else {
     
    console.log("Geolocation is not supported by this browser.");
  }
}
, [
  setLatitude,
  setLongitude,
]);


  return ( 
<>
{
  !isLocationAllowed && (
    <Card className="text-center p-4">
      <h2>Location not allowed</h2>
      <p>
        Please enable location to view the map
      </p>

      <Pointer size={64} className="m-auto" />


    </Card>
  )
}
{
  isLocationAllowed && (
    <>
     <h4 className="text-center py-2 text-2xl font-bold">Tender Location</h4>

    <MapContainer  center={[latitude, longitude]} zoom={13} ref={mapRef} style={{height: "60vh", width: "100%"}} className=" z-20" scrollWheelZoom={false}>
    <TileLayer
       attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
     />
   <Marker position={[latitude, longitude]}>
     <Popup>
       
        <h4 className="text-center py-2 text-sm font-light italic">
          Your {product}(tender) is located at {latitude}, {longitude}
         
          </h4>
       
     </Popup>
   </Marker>
 </MapContainer>
    </>
  
    
  )
}
</>
  );
};

export default Map;