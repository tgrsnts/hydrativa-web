'use client';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
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

export default function OrderMap({
  transactions,
  radius,
  defaultCenter,
  className = '',
}: OrderMapProps) {
  

  return (
    <div className={`${className}`}>
      <MapContainer center={defaultCenter} zoom={12} scrollWheelZoom={true} className="h-full w-full z-0">
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

        {/* Circle berdasarkan radius */}
        <Circle center={defaultCenter} radius={radius} pathOptions={{ color: 'blue' }} />

        {/* Marker transaksi dalam radius */}
        {transactions.map((transaction) => {
          const lat = transaction.alamat.latitude;
          const lng = transaction.alamat.longitude;

          if (!lat || !lng) return null;

          // Hitung jarak antara pusat dan marker
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
      </MapContainer>
    </div>
  );
}
