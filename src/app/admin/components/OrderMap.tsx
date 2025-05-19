'use client';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import Transaksi from '@/lib/interfaces/Transaksi';

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
}

// ✅ Komponen untuk legenda Leaflet
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

export default function OrderMap({
  transactions,
  radius,
  defaultCenter,
  className = '',
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
      </MapContainer>
    </div>
  );
}
