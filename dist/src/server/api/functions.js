"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDistance = exports.getCurrentDateTime = void 0;
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
    return `${date} at ${time}`;
};
exports.getCurrentDateTime = getCurrentDateTime;
const client = new google_maps_services_js_1.Client({});
const calculateDistance = async (origin, destination) => {
    const response = await client.distancematrix({
        params: {
            origins: [origin],
            destinations: [destination],
            key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        },
    });
    if (!response.data?.rows[0]?.elements[0]) {
        throw new Error("No distance found");
    }
    const distanceString = response.data.rows[0].elements[0].distance.text;
    const durationString = response.data.rows[0].elements[0].duration.text;
    const distance = parseFloat(distanceString.replace(/[^\d.]/g, ""));
    const duration = parseFloat(durationString.replace(/[^\d.]/g, ""));
    const geocodeResponse = await client.reverseGeocode({
        params: {
            latlng: [destination.lat, destination.lng],
            key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        },
    });
    if (!geocodeResponse.data?.results[0]) {
        throw new Error("No location found");
    }
    const location = geocodeResponse.data.results[0].formatted_address;
    return { distance, duration, location };
};
exports.calculateDistance = calculateDistance;
