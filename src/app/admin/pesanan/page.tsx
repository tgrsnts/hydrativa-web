'use client'
import Navbar from '@/components/Navbar'
import Sidebar from '@/app/admin/components/Sidebar'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import Swal from 'sweetalert2'
import Transaksi from '@/lib/interfaces/Transaksi'
import jsPDF from 'jspdf'
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import OrderMap from '@/app/admin/components/OrderMap';
import { FaCalendar, FaRoute } from "react-icons/fa";


export default function Pesanan() {
    const [transactions, setTransactions] = useState<Transaksi[]>([]);
    const [loading, setLoading] = useState(true);
    const [radius, setRadius] = useState(10000); // meter
    const defaultCenter: [number, number] = [-6.595038, 106.816635]; // Bogor
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [trackRouteTarget, setTrackRouteTarget] = useState<[number, number] | null>(null)



    // Filter berdasarkan radius
    const filteredTransactions = transactions.filter((transaction) => {
        const lat = transaction.alamat.latitude;
        const lng = transaction.alamat.longitude;

        if (!lat || !lng) return false;

        const distance = L.latLng(lat, lng).distanceTo(defaultCenter);
        const isInRadius = distance <= radius;

        // Filter berdasarkan status jika dipilih
        const matchStatus = selectedStatus === '' || transaction.status === selectedStatus;

        // Filter berdasarkan bulan dan tahun jika dipilih
        const createdAt = new Date(transaction.created_at); // Pastikan `created_at` ada di objek transaksi
        const matchMonth = selectedMonth === '' || createdAt.getMonth() + 1 === Number(selectedMonth);
        const matchYear = selectedYear === '' || createdAt.getFullYear() === Number(selectedYear);

        return isInRadius && matchStatus && matchMonth && matchYear;
    });


    const handleResi = (transaksiId: number, resi: string) => {
        // Update the transactions array to set the resi
        setTransactions((prevTransactions) =>
            prevTransactions.map((transaction) =>
                transaction.transaksi_id === transaksiId
                    ? { ...transaction, resi }
                    : transaction
            )
        );
    };

    const generatePDF = (transactions: Transaksi[]) => {
        const doc = new jsPDF();

        // Set up fonts and starting position
        doc.setFontSize(16);
        doc.text('Label Pengiriman', 20, 20);
        let yOffset = 30; // Starting Y position for text

        transactions.forEach((transaction) => {
            // Transaction ID and status
            doc.setFontSize(12);
            doc.text(`Transaction ID: ${transaction.transaksi_id}`, 20, yOffset);
            doc.text(`Status: ${transaction.status}`, 20, yOffset + 10);
            yOffset += 20;

            // Shipping Address
            doc.setFontSize(14);
            doc.text('Alamat Pengiriman:', 20, yOffset);
            yOffset += 10;

            doc.setFontSize(12);
            doc.text(`Penerima: ${transaction.alamat.nama_penerima}`, 20, yOffset);
            yOffset += 10;
            doc.text(`Telepon: ${transaction.alamat.no_telepon}`, 20, yOffset);
            yOffset += 10;
            doc.text(`${transaction.alamat.detail}, ${transaction.alamat.kelurahan}, ${transaction.alamat.kecamatan}`, 20, yOffset);
            yOffset += 10;
            doc.text(`${transaction.alamat.kabupaten}, ${transaction.alamat.provinsi}, ${transaction.alamat.kodepos}`, 20, yOffset);
            yOffset += 15;

            // Order items
            doc.setFontSize(14);
            doc.text('Pesanan:', 20, yOffset);
            yOffset += 10;

            transaction.transaksi_item.forEach((item) => {
                doc.setFontSize(12);
                doc.text(`Item: ${item.nama_produk} x${item.quantity}`, 20, yOffset);
                doc.text(`Harga: Rp. ${item.harga.toLocaleString()}`, 150, yOffset);
                yOffset += 10;
            });

            // Tracking number (resi)
            doc.setFontSize(14);
            doc.text('Nomor Resi Pengiriman:', 20, yOffset);
            yOffset += 10;
            if (transaction.status === 'delivering') {
                doc.text(`Resi: ${transaction.resi}`, 20, yOffset);
            } else {
                doc.text('Resi: Belum tersedia', 20, yOffset);
            }
            yOffset += 15;

            // Add space between each transaction
            yOffset += 10;
        });

        // Save the document
        doc.save('shipping-label.pdf');
    };


    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transaksi/admin`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`
                }
            });

            if (response.status === 200 || response.status === 201) {
                setTransactions(response.data);
            } else {
                console.warn("Failed to fetch transactions:", response.data);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while fetching transaction history.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleUpdateResi = async (transaksiId: number) => {
        const transaction = transactions.find((t) => t.transaksi_id === transaksiId);
        if (!transaction || !transaction.resi) return; // Ensure we have a valid resi to update

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/transaksi/resi/${transaksiId}`,
                { resi: transaction.resi },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`
                    }
                }
            );

            if (response.status === 200 || response.status === 201) {
                await Swal.fire({
                    title: 'Berhasil!',
                    text: 'Berhasil memasukan resi pengiriman!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                setTransactions((prevTransactions) =>
                    prevTransactions.map((transaction) =>
                        transaction.transaksi_id === transaksiId
                            ? { ...transaction, status: "delivering" }
                            : transaction
                    )
                );
            } else {
                console.warn("Failed to update resi:", response.data);
            }
        } catch (error) {
            console.error("Error updating resi:", error);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while updating resi.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleTrackRoute = (transaction: Transaksi) => {
        // **UPDATED HERE for transaction coordinates**
        const latStr = String(transaction.alamat.latitude); // Ensure it's a string before parsing
        const lngStr = String(transaction.alamat.longitude);

        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);

        if (isNaN(lat) || isNaN(lng)) {
            console.warn(`Could not parse coordinates for transaction ID: <span class="math-inline">\{transaction\.transaksi\_id\}\. Original values\: '</span>{latStr}', '${lngStr}'`);
            // Handle this case
            return false;
        }
        // Now lat and lng are floating-point numbers

        if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
            const target: [number, number] = [lat, lng];
            if (trackRouteTarget && trackRouteTarget[0] === target[0] && trackRouteTarget[1] === target[1]) {
                setTrackRouteTarget(null);
            } else {
                setTrackRouteTarget(target);
            }
        } else {
            Swal.fire('Error', 'Koordinat alamat transaksi tidak tersedia atau formatnya salah.', 'error');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Navbar />
            <div className="flex">
                <div className="flex">
                    <div className="flex flex-col bg-primary py-4 w-80 min-h-screen text-gray-700">
                        <Sidebar />
                    </div>
                </div>
                <div className="flex flex-col mt-12 w-full">
                    <section
                        id="dashboard"
                        className="flex flex-col gap-2 bg-slate-50 mt-2 px-4 pt-10 pb-20 w-full min-h-screen font-poppins"
                    >
                        <div className="flex flex-col gap-2 bg-white shadow-md py-4 rounded-lg w-full">
                            <div className="px-4 py-2">
                                <p className='font-semibold'>Pesanan</p>
                                <p>Melihat daftar pesanan yang anda terima.</p>
                            </div>
                        </div>
                        <div className="gap-2 grid grid-cols-3">
                            <div className="flex items-center space-x-2 bg-white drop-shadow px-3 py-2 rounded-lg">
                                <label htmlFor="radius" className="block w-full font-medium text-sm">Radius : {radius / 1000} km</label>
                                <input
                                    type="range"
                                    id="radius"
                                    min={1000}
                                    max={50000}
                                    step={1000}
                                    value={radius}
                                    onChange={(e) => setRadius(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center space-x-2 bg-white drop-shadow px-3 py-2 rounded-lg">
                                <label htmlFor="">Status :</label>
                                <select name="" id="" value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}>
                                    <option value="">Semua Status</option>
                                    <option value="success">Sudah Dibayar</option>
                                    <option value="delivering">Sedang Dikirim</option>
                                    <option value="delivered">Terkirim</option>
                                </select>
                            </div>
                            <div className="flex items-center space-x-2 bg-white drop-shadow px-3 py-2 rounded-lg">
                                <FaCalendar className="text-gray-400" />
                                <select className="bg-transparent focus:outline-none text-gray-800" value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}>
                                    <option value="">Bulan</option>
                                    <option value="01">Januari</option>
                                    <option value="02">Februari</option>
                                    <option value="03">Maret</option>
                                    <option value="04">April</option>
                                    <option value="05">Mei</option>
                                    <option value="06">Juni</option>
                                    <option value="07">Juli</option>
                                    <option value="08">Agustus</option>
                                    <option value="09">September</option>
                                    <option value="10">Oktober</option>
                                    <option value="11">November</option>
                                    <option value="12">Desember</option>
                                </select>
                                <select
                                    className="bg-transparent focus:outline-none text-gray-800"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                >
                                    <option value="">Tahun</option>
                                    {Array.from({ length: 10 }, (_, i) => {
                                        const year = 2025 - i;
                                        return <option key={year} value={year}>{year}</option>;
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <OrderMap
                                className='rounded w-1/2 h-[500px] overflow-hidden'
                                transactions={filteredTransactions}
                                defaultCenter={defaultCenter}
                                radius={radius}
                                targetCoordinatesForRoute={trackRouteTarget}
                            />
                            <div className="flex flex-col gap-2 w-1/2 overflow-scroll">
                                {loading ? (
                                    // Skeleton placeholders
                                    Array.from({ length: 3 }).map((_, index) => (
                                        <div key={index} className="flex flex-col gap-4 bg-white shadow-md p-4 rounded-lg w-full animate-pulse">
                                            <div className="flex justify-end gap-5 w-full">
                                                <div className="rounded w-24 h-4 skeleton"></div>
                                            </div>
                                            <div className="flex gap-5 w-full">
                                                <div className="rounded-lg w-20 h-20 skeleton"></div>
                                                <div className="flex flex-col gap-2 w-full">
                                                    <div className="rounded w-1/2 h-4 skeleton"></div>
                                                    <div className="rounded w-1/3 h-4 skeleton"></div>
                                                </div>
                                            </div>
                                            <div className="flex gap-5 w-full">
                                                <div className="rounded-lg w-20 h-20 skeleton"></div>
                                                <div className="flex flex-col gap-2 w-full">
                                                    <div className="rounded w-1/2 h-4 skeleton"></div>
                                                    <div className="rounded w-1/3 h-4 skeleton"></div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between">
                                                <div className="rounded w-32 h-8 skeleton"></div>
                                                <div className="rounded w-20 h-4 skeleton"></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    // Render transactions if not loading
                                    filteredTransactions.map((transaction) => (
                                        <div key={transaction.transaksi_id} className="flex flex-col gap-4 bg-white shadow-md p-4 rounded-lg w-full">
                                            <div className="flex justify-between gap-5 w-full">
                                                {/* <div className='flex gap-2'>
                                                <input type="checkbox" id='siap-kirim' />
                                                <label htmlFor="siap-kirim">Siap Dikirim</label>
                                            </div> */}
                                                <div>
                                                    Pembeli: {transaction.pembeli}
                                                </div>
                                                {
                                                    transaction.status === 'delivered' ? (
                                                        <p>Status: Pesanan telah diterima</p>
                                                    ) : transaction.status === 'delivering' ? (
                                                        <p>Status: Pesanan sedang dikirim</p>
                                                    ) : transaction.status === 'success' ? (
                                                        <p>Status: Sudah dibayar</p>
                                                    ) : (
                                                        <p>Status: Tidak diketahui</p>
                                                    )
                                                }
                                            </div>
                                            <div className="flex flex-col gap-2 w-full">
                                                <div className="flex flex-col gap-2 w-full">
                                                    {transaction.transaksi_item.map((transaksi_item) => (
                                                        <div key={transaksi_item.transaksi_item_id} className="flex gap-5 w-full">
                                                            <img className="rounded-lg w-20" src={transaksi_item.gambar} />
                                                            <div className="flex flex-col w-full">
                                                                <div className='font-semibold'>{transaksi_item.nama_produk}</div>
                                                                <div className="flex justify-between">
                                                                    <div>x{transaksi_item.quantity}</div>
                                                                    <div>Rp. {transaksi_item.harga.toLocaleString()}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="divider divider-horizontal"></div>
                                                <div className='flex flex-col w-full'>
                                                    <p className='font-semibold'>Alamat</p>
                                                    <div className="flex flex-col">
                                                        <div>
                                                            {transaction.alamat.label_alamat} • {transaction.alamat.nama_penerima}
                                                        </div>
                                                        <div>
                                                            {transaction.alamat.no_telepon}
                                                        </div>
                                                        <div>
                                                            {transaction.alamat.detail}, {transaction.alamat.kelurahan}, {transaction.alamat.kecamatan}, {transaction.alamat.kabupaten}, {transaction.alamat.provinsi}, {transaction.alamat.kodepos}
                                                        </div>
                                                        <button
                                                            onClick={() => handleTrackRoute(transaction)}
                                                            className={`... ${trackRouteTarget
                                                                ? 'bg-red-500 hover:bg-red-600 px-4 py-2 w-fit rounded-lg text-white'
                                                                : 'bg-primary hover:bg-white px-4 py-2 rounded-lg text-white w-fit hover:border-primary hover:text-primary border-2' // Default class
                                                                }`}
                                                            title='Route'
                                                        >
                                                            {
                                                                trackRouteTarget
                                                                    ? "Hapus Petunjuk"
                                                                    : "Petunjuk"
                                                            }
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="divider divider-horizontal"></div>
                                                <div className='flex flex-col gap-2 w-full'>
                                                    <label className='font-semibold' htmlFor={`resi${transaction.transaksi_id}`}>Nomor Resi</label>
                                                    {transaction.status == 'delivering' ? (
                                                        <p>{transaction.resi}</p>
                                                    ) : (
                                                        <input
                                                            onChange={(e) => {
                                                                handleResi(transaction.transaksi_id, e.target.value);
                                                            }}
                                                            className="p-2 border-2 rounded-lg w-full"
                                                            type="text"
                                                            name="resi"
                                                            placeholder="Masukkan no resi"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between">
                                                <div className="flex items-center gap-2">
                                                    {transaction.status == 'delivering' ? (
                                                        null
                                                    ) : (
                                                        <button
                                                            onClick={() => handleUpdateResi(transaction.transaksi_id)}
                                                            className="bg-primary hover:bg-white px-4 py-2 border-2 border-primary rounded-lg w-full font-poppins text-white hover:text-primary text-center"
                                                        >
                                                            Konfirmasi
                                                        </button>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => generatePDF(transactions)}
                                                    className="bg-primary px-4 py-2 rounded-lg font-poppins text-white"
                                                >
                                                    Download PDF
                                                </button>
                                                <div className="flex justify-end gap-4">
                                                    <div>Total Pesanan:</div>
                                                    <div className="text-primary">Rp. {transaction.total_harga.toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
