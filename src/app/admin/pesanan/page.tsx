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


export default function Pesanan() {
    const [transactions, setTransactions] = useState<Transaksi[]>([]);
    const [loading, setLoading] = useState(true);
    const [radius, setRadius] = useState(10000); // meter
    const defaultCenter: [number, number] = [-6.595038, 106.816635]; // Bogor

    // Filter berdasarkan radius
    const filteredTransactions = transactions.filter((transaction) => {
        const lat = transaction.alamat.latitude;
        const lng = transaction.alamat.longitude;

        if (!lat || !lng) return false;

        const distance = L.latLng(lat, lng).distanceTo(defaultCenter);
        return distance <= radius;
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

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Navbar />
            <div className="flex">
                <div className="flex">
                    <div className="flex min-h-screen w-80 flex-col bg-primary py-4 text-gray-700">
                        <Sidebar />
                    </div>
                </div>
                <div className="mt-12 flex flex-col w-full">
                    <section
                        id="dashboard"
                        className="min-h-screen font-poppins w-full flex gap-2 flex-col mt-2 pt-10 px-4 pb-20 bg-slate-50"
                    >
                        <div className="flex flex-col gap-2 rounded-lg bg-white w-full py-4 shadow-md">
                            <div className="px-4 py-2">
                                <p className='font-semibold'>Pesanan</p>
                                <p>Melihat daftar pesanan yang anda terima.</p>
                            </div>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="radius" className="block mb-1 text-sm font-medium">Radius (meter): {radius}</label>
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
                        <div className="flex gap-2">
                            <OrderMap
                                className='w-1/2 h-[500px] rounded overflow-hidden'
                                transactions={filteredTransactions}
                                defaultCenter={defaultCenter}
                                radius={radius}
                            />
                            <div className="flex flex-col gap-2 w-1/2 overflow-scroll">
                                {loading ? (
                                    // Skeleton placeholders
                                    Array.from({ length: 3 }).map((_, index) => (
                                        <div key={index} className="flex gap-4 flex-col bg-white w-full p-4 rounded-lg shadow-md animate-pulse">
                                            <div className="flex justify-end w-full gap-5">
                                                <div className="h-4 skeleton rounded w-24"></div>
                                            </div>
                                            <div className="flex w-full gap-5">
                                                <div className="w-20 h-20 skeleton rounded-lg"></div>
                                                <div className="flex flex-col w-full gap-2">
                                                    <div className="h-4 skeleton rounded w-1/2"></div>
                                                    <div className="h-4 skeleton rounded w-1/3"></div>
                                                </div>
                                            </div>
                                            <div className="flex w-full gap-5">
                                                <div className="w-20 h-20 skeleton rounded-lg"></div>
                                                <div className="flex flex-col w-full gap-2">
                                                    <div className="h-4 skeleton rounded w-1/2"></div>
                                                    <div className="h-4 skeleton rounded w-1/3"></div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between">
                                                <div className="h-8 skeleton rounded w-32"></div>
                                                <div className="h-4 skeleton rounded w-20"></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    // Render transactions if not loading
                                    transactions.map((transaction) => (
                                        <div key={transaction.transaksi_id} className="flex gap-4 flex-col bg-white w-full p-4 rounded-lg shadow-md">
                                            <div className="flex justify-between w-full gap-5">
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
                                            <div className="flex flex-col w-full gap-2">
                                                <div className="flex flex-col gap-2 w-full">
                                                    {transaction.transaksi_item.map((transaksi_item) => (
                                                        <div key={transaksi_item.transaksi_item_id} className="flex w-full gap-5">
                                                            <img className="w-20 rounded-lg" src={transaksi_item.gambar} />
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
                                                            className="w-full p-2 border-2 rounded-lg"
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
                                                            className="bg-primary font-poppins rounded-lg px-4 py-2 border-2 border-primary text-white text-center w-full hover:bg-white hover:text-primary"
                                                        >
                                                            Konfirmasi
                                                        </button>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => generatePDF(transactions)}
                                                    className="bg-primary font-poppins rounded-lg px-4 py-2 text-white"
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
