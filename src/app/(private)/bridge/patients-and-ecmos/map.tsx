"use client";
import React, { useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";

interface Coordinates {
  lat: number;
  lng: number;
}

interface ECMO {
  model: string;
  serial: string;
  type: string;
  inUse: boolean;
  lat: number;
  lng: number;
  hospital: string;
}

const arizonaCenter: Coordinates = { lat: 33.17795445168746,  lng: -111.57610942387014 };
const zoomLevel = 7.5;

const mapStyles = [
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]

const mapOptions = {
  mapTypeControl: false,
  streetViewControl: false,
};

interface MapProps {
  ecmoList: ECMO[];
}

const Map: React.FC<MapProps> = ({ ecmoList }) => {
  const [selectedECMO, setSelectedECMO] = useState<ECMO | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="w-3/4 h-full bg-grey-500">
      <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }}
          center={arizonaCenter}
          zoom={zoomLevel} 
          options={mapOptions}
          >
        {ecmoList.map((ecmo, index) => (
          <Marker
            key={index}
            position={{ lat: ecmo.lat, lng: ecmo.lng }}
            onClick={() => setSelectedECMO(ecmo)}
          />
        ))}

        {selectedECMO && (
          <InfoWindow
            position={{ lat: selectedECMO.lat, lng: selectedECMO.lng }}
            onCloseClick={() => setSelectedECMO(null)}
          >
            <div>
              <h2>{selectedECMO.model}</h2>
              <p><strong>Hospital:</strong> {selectedECMO.hospital}</p>
              <p><strong>Serial:</strong> {selectedECMO.serial}</p>
              <p><strong>Type:</strong> {selectedECMO.type}</p>
              <p><strong>Status: </strong><span className={selectedECMO.inUse ? "text-red-600" : "text-green-600"}>
                  {selectedECMO.inUse ? "In Use" : "Available"}
                </span></p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;
