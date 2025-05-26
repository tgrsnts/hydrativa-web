'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Don't forget the CSS
import { useMap } from 'react-leaflet';

interface LeafletRoutingMachineProps {
  startWaypoint: L.LatLngExpression;
  endWaypoint: L.LatLngExpression;
  lineColor?: string;
}

const LeafletRoutingMachine: React.FC<LeafletRoutingMachineProps> = ({
  startWaypoint,
  endWaypoint,
  lineColor = '#0398fc', // Default route color
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !startWaypoint || !endWaypoint) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(startWaypoint),
        L.latLng(endWaypoint)
      ],
      routeWhileDragging: true,
      show: true, // Set to false if you don't want the turn-by-turn panel
      // addWaypoints: false, // Prevent users from adding more waypoints by drag&drop
      // draggableWaypoints: false, // Prevent dragging existing waypoints
      fitSelectedRoutes: true, // Automatically zoom to the route
      lineOptions: {
        styles: [{ color: lineColor, opacity: 0.8, weight: 6 }],
        // extendToWaypoints: false, // Optional: do not draw lines to waypoints if they are off-route
        // missingRouteStyles: [{color: 'gray', opacity: 0.5, weight: 4, dashArray: '7,12'}] // Style for parts of the route that couldn't be calculated
      },
      createMarker: function () {
        // Return null to prevent Leaflet Routing Machine from adding its own markers
        // We'll use the markers already present in OrderMap
        return null;
      },
      // You can customize the itinerary instructions panel
      // collapsible: true, // Makes the instruction panel collapsible
      // showAlternatives: false // If you want to show alternative routes
    }).addTo(map);

    // Cleanup function to remove the control when the component unmounts or waypoints change
    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, startWaypoint, endWaypoint, lineColor]); // Re-run effect if map or waypoints change

  return null; // This component does not render any visible JSX itself
};

export default LeafletRoutingMachine;