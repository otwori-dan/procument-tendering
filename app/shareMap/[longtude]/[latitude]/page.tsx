"use client";
import React, { useRef } from 'react'
import dynamic from 'next/dynamic';
import { Pointer } from "lucide-react";
import { Card } from '@/components/ui/card';
import Layout from '@/components/Layout';
import "leaflet/dist/leaflet.css";
import markerIcon from "../../../../public/marker-icon.png"
import L from 'leaflet';
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

type Props = {
 params:{
    longtude: string
    latitude: string
 }
}
const markerIconUrl = markerIcon.src as string;
const customIcon = L.icon({
    iconUrl: markerIconUrl,
    iconSize: [32, 32], // adjust the size as needed
    // other icon options
  });

const Map = ({ params  }: Props) => {
  const mapRef = useRef(null);
 const { latitude, longtude} = params
 const long = parseFloat(longtude)
 const lat = parseFloat(latitude)
const [isLocationAllowed, setIsLocationAllowed] = React.useState(false);

React.useEffect(() => {
    if(long <=0 && lat <=0){
         window.location.href="/Admin.Dashboard"
    }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((_position) => {
      setIsLocationAllowed(true);
    });
  } else {
     
    console.log("Geolocation is not supported by this browser.");
  }
}
, [
 longtude,latitude
]);


  return ( 
<Layout>
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

    <MapContainer  center={[lat, long]} zoom={13} ref={mapRef} style={{height: "60vh", width: "100%"}} className=" z-20" scrollWheelZoom={false}>
    <TileLayer
       attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
     />
   <Marker position={[lat, long]} icon={customIcon}>
     <Popup>
       
        <h4 className="text-center py-2 text-sm font-light italic">
          Your (tender) is located at {latitude}, {longtude}
         
          </h4>
       
     </Popup>
   </Marker>
 </MapContainer>
    </>
  
    
  )
}
</Layout>
  );
};

export default Map;