'use client';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import Transaksi from '@/lib/interfaces/Transaksi';
import LeafletRoutingMachine from '@/app/admin/components/LeafletRoutingMachine';

const customIcon = new L.Icon({
  iconUrl: '/image/marker-icon.png',
  iconSize: [41, 41],
  iconAnchor: [20, 20],
  popupAnchor: [1, -34],
  shadowUrl: '/image/marker-shadow.png',
  shadowSize: [41, 41],
});

const pusatIcon = new L.Icon({
  iconUrl: '/image/marker-pusat.png',
  iconSize: [41, 41],
  iconAnchor: [20, 20],
  popupAnchor: [1, -34],
});

interface OrderMapProps {
  transactions: Transaksi[];
  defaultCenter: [number, number];
  radius: number;
  className?: string;
  targetCoordinatesForRoute?: [number, number] | null;
}

const Legend = () => {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend');
      div.innerHTML = `
        <div style="
  background-color: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  padding: 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  line-height: 1.625;
  display: flex;
  flex-direction: column;
  gap: 4px;
">
  <p style="font-weight: 600; margin-bottom: 4px;">Legenda</p>

  <div style="display: flex; align-items: center; gap: 4px;">
    <span style="
      display: inline-block;
      width: 16px;
      height: 16px;
      background-color: #1A5319;
      border-radius: 2px;
      margin-right: 8px;
    "></span>
    <span>Radius Jangkauan</span>
  </div>

  <div style="display: flex; align-items: center; gap: 4px;">
    <img src="/image/marker-pusat.png" alt="pusat" style="width: 16px; height: 16px; margin-right: 8px;" />
    <span>Lokasi Anda</span>
  </div>

  <div style="display: flex; align-items: center; gap: 4px;">
    <img src="/image/marker-icon.png" alt="transaksi" style="width: 16px; height: 16px; margin-right: 8px;" />
    <span>Transaksi Aktif</span>
  </div>
</div>

      `;
      return div;
    };

    legend.addTo(map);
    return () => {
      map.removeControl(legend);
    };
  }, [map]);

  return null;
};

const MapUpdater: React.FC<{
  defaultCenter: [number, number];
  radius: number;
  transactions: Transaksi[];
  targetCoordinatesForRoute?: [number, number] | null;
  // We will get circleInstance via prop if possible, or try to find it
  // For simplicity, let's assume the <Circle> is always rendered by the parent
  // and we try to get its bounds without needing an explicit ref pass for now.
  // The key is to avoid the failing L.circle().getBounds() if possible.
}> = ({ defaultCenter, radius, transactions, targetCoordinatesForRoute }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !(map as any)._loaded) {
      // console.log("MapUpdater: Map not loaded yet.");
      return;
    }

    const bounds = L.latLngBounds([]);
    let circleBoundsCalculated = false;

    // Attempt to find the main <Circle> layer if possible - this is more robust
    // This is a bit of a hack, relying on the fact that we have one main radius circle
    let mainCircleLayer: L.Circle | null = null;
    map.eachLayer(layer => {
      if (layer instanceof L.Circle && (layer as L.Circle).getRadius() === radius && layer.getLatLng().equals(L.latLng(defaultCenter))) {
        // This condition might be too specific or not always true if multiple circles exist
        // A more reliable way would be to pass a ref or an ID.
        // For now, let's assume it's the one representing our radius.
        if (!mainCircleLayer) mainCircleLayer = layer as L.Circle; // Take the first match
      }
    });

    if (mainCircleLayer) {
      try {
        const currentCircleBounds = mainCircleLayer.getBounds();
        if (currentCircleBounds && currentCircleBounds.isValid()) {
          bounds.extend(currentCircleBounds);
          circleBoundsCalculated = true;
          // console.log("MapUpdater: Extended bounds with existing map circle.");
        } else {
          // console.warn("MapUpdater: Bounds from existing map Circle are invalid.");
        }
      } catch (error) {
        console.error("MapUpdater: Error getting bounds from existing map Circle:", error);
      }
    }

    // If we couldn't get bounds from an existing circle on the map,
    // and as a last resort, we might try the temporary circle IF AND ONLY IF absolutely necessary
    // and we acknowledge it's the source of the error.
    // For now, to AVOID THE ERROR, we will NOT use the temporary L.circle().getBounds()
    // if ( !circleBoundsCalculated && defaultCenter && /* ... */ radius > 0 ) {
    //   console.warn("MapUpdater: Could not find existing circle, avoiding temp circle creation due to known error.");
    //   // The problematic code would go here:
    //   // const tempCircle = L.circle(L.latLng(defaultCenter), { radius });
    //   // const tempCircleBounds = tempCircle.getBounds(); // THIS IS LINE 107
    //   // ...
    // }


    transactions.forEach(transaction => {
      const lat = transaction.alamat.latitude;
      const lng = transaction.alamat.longitude;
      if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
        bounds.extend(L.latLng(lat, lng));
      }
    });


    if (bounds.isValid()) { // Only fit if bounds are valid
      if (!targetCoordinatesForRoute) { // Don't interfere if routing machine is active
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    } else if (defaultCenter && !targetCoordinatesForRoute) {
      // Fallback if no valid bounds (e.g. no transactions, and circle bounds failed/skipped)
      // map.setView(defaultCenter, 11); // Adjust zoom as needed
    }

  }, [map, defaultCenter, radius, transactions, targetCoordinatesForRoute, (map as any)?._loaded]);
  // Note: Iterating map.eachLayer inside useEffect can be tricky if layers change frequently,
  // but for a stable radius circle, it might be okay.

  return null;
};

export default function OrderMap({
  transactions,
  radius,
  defaultCenter,
  className = '',
  targetCoordinatesForRoute = null
}: OrderMapProps) {
  return (
    <div className={`${className}`}>
      <MapContainer center={defaultCenter} zoom={12} scrollWheelZoom={true} className="z-0 w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={defaultCenter} icon={pusatIcon}>
          <Popup>
            <strong>Lokasi Anda</strong><br />
            Kota Bogor
          </Popup>
        </Marker>

        <Circle center={defaultCenter} radius={radius} pathOptions={{ color: '#1A5319' }} />

        {transactions.map((transaction) => {
          const lat = transaction.alamat.latitude;
          const lng = transaction.alamat.longitude;
          if (!lat || !lng) return null;

          const distance = L.latLng(lat, lng).distanceTo(defaultCenter);
          if (distance > radius) return null;

          return (
            <Marker
              key={transaction.transaksi_id}
              position={[lat, lng]}
              icon={customIcon}
            >
              <Popup>
                <strong>Nama Pemesan : {transaction.alamat.nama_penerima}</strong><br />
                Alamat Tujuan : {transaction.alamat.kabupaten}, {transaction.alamat.provinsi}
              </Popup>
            </Marker>
          );
        })}

        {/* ✅ Tambahkan komponen legenda di sini */}
        <Legend />
        <MapUpdater defaultCenter={defaultCenter} radius={radius} transactions={transactions} targetCoordinatesForRoute={targetCoordinatesForRoute} />

        {targetCoordinatesForRoute && (
          <LeafletRoutingMachine
            startWaypoint={defaultCenter}
            endWaypoint={targetCoordinatesForRoute} // This should be [lat, lng]
            lineColor="#FF6347"
          />
        )}

      </MapContainer>
    </div>
  );
}
