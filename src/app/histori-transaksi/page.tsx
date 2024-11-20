'use client'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import Swal from 'sweetalert2'
import Link from 'next/link'
import Transaksi from '@/lib/interfaces/Transaksi'
import { FaTruck } from 'react-icons/fa'


declare global {
    interface Window {
        snap: {
            pay: (response: PaymentResponse, options: {
                onSuccess: (result: PaymentResult) => void;
                onPending: (result: PaymentResult) => void;
                onError: (error: PaymentError) => void;
                onClose: () => void;
            }) => void;
        };
    }
}

interface PaymentResponse {
    status: string;
    transaction_id: string;
    // Add other properties from the response that are important
}

interface PaymentResult {
    transaction_status: string;
    // Add other properties from the result if needed
}

interface PaymentError {
    code: string;
    message: string;
    // Add other properties related to the error if needed
}


interface ShipmentHistory {
    date: string;
    desc: string;
    location: string;
}

interface ShipmentSummary {
    awb: string;
    courier: string;
    service: string;
    status: string;
    date: string;
    desc: string;
    amount: string;
    weight: string;
}

interface ShipmentDetail {
    origin: string;
    destination: string;
    shipper: string;
    receiver: string;
}

interface ShipmentResponse {
    status: number;
    message: string;
    data: {
        summary: ShipmentSummary;
        detail: ShipmentDetail;
        history: ShipmentHistory[];
    };
}

const defaultShipmentData: ShipmentResponse = {
    status: 200,
    message: "Successfully tracked package",
    data: {
        summary: {
            awb: "11000098821211",
            courier: "AnterAja",
            service: "SD",
            status: "ON PROCCESS",
            date: "",
            desc: "",
            amount: "0",
            weight: "4000",
        },
        detail: {
            origin: "",
            destination: "*****",
            shipper: "rafa",
            receiver: "subandi",
        },
        history: [
            {
                date: "2024-06-06 16:46:28",
                desc: "CANCEL ORDER.",
                location: "",
            },
            {
                date: "2024-06-05 16:11:09",
                desc: "PENJEMPUTAN PARSEL TERTUNDA KARENA KENDALA INTERNAL.",
                location: "",
            },
            {
                date: "2024-06-05 12:30:01",
                desc: "SATRIA SUDAH DITUGASKAN DAN PARCEL AKAN SEGERA DI-PICKUP.",
                location: "",
            },
            {
                date: "2024-06-05 10:38:10",
                desc: "PICKUP SUDAH DI-REQUEST OLEH SHIPPER, DAN SATRIA AKAN PICKUP PARCEL RABU 5 JUNI 2024.",
                location: "",
            },
        ],
    },
};

export default function HistoriTransaksi() {
    const [transactions, setTransactions] = useState<Transaksi[]>([]);
    const [loading, setLoading] = useState(true);

    const [shipmentData, setShipmentData] = useState<ShipmentResponse>(defaultShipmentData);

    // Fungsi untuk mengambil data status pengiriman
    const fetchTrackingData = async (awb: string) => {
        try {
            const response = await axios.get(
                `https://api.binderbyte.com/v1/track`,
                {
                    params: {
                        api_key: process.env.NEXT_PUBLIC_BINDER_BYTE_API_KEY,
                        courier: "anteraja",
                        awb: awb
                    }
                }
            );

            if (response.status === 200) {
                setShipmentData(response.data);
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Gagal mengambil data status pengiriman.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Terjadi kesalahan saat mengambil data.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    // Panggil fetchTrackingData di dalam handleBayarUlang atau saat status pengiriman perlu diperiksa


    // Fetch transaction data
    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transaksi`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`
                }
            });

            console.log(response)
            setTransactions(response.data);
            if (response.status === 200 || response.status === 201) {
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

    const handleBayarUlang = async (transactionId: number) => {
        try {


            // Send the payment request
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/bayar/${transactionId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('token')}`,
                    },
                }
            );

            if (response && response.data) {
                // Extract the necessary fields from response.data


                console.log(response)

                window.snap.pay(response.data.snaptoken, {
                    onSuccess: () => {
                        handleBayarBerhasil(response.data.transaksi_id)
                    },
                    onPending: () => {
                        window.location.assign('/histori-transaksi')
                    },
                    onError: () => {
                        window.location.assign('/histori-transaksi')
                    },
                    onClose: () => {
                        window.location.assign('/histori-transaksi')
                    },
                });
            }
        } catch (error) {
            console.error("Checkout failed:", error);
        }
    };

    const handleBayarBerhasil = async (transactionId: number) => {
        try {
            // Send the payment request
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/bayar/berhasil/${transactionId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('token')}`,
                    },
                }
            );

            if (response.status == 200) {
                Swal.fire({
                    title: 'Sukses!',
                    text: 'Pesanan telah dibayar.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then(() => {
                    window.location.assign('/histori-transaksi');
                });
            }
        } catch (error) {
            console.error("Checkout failed:", error);
        }
    };



    useEffect(() => {
        fetchData();

        const snapScript = 'https://app.sandbox.midtrans.com/snap/snap.js';
        const clientKey = process.env.NEXT_PUBLIC_CLIENT_KEY;

        const script = document.createElement('script');
        if (clientKey) {
            script.src = snapScript;
            script.setAttribute('data-client-key', clientKey);
            script.async = true;
            script.type = 'text/javascript';

            document.head.appendChild(script);
        } else {
            console.error("Client key is not defined");
        }


        return () => {
            document.head.removeChild(script);
        }
    }, []);

    const handleMarkAsReceived = async (transactionId: number) => {
        // Tampilkan dialog konfirmasi dengan SweetAlert
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Anda akan menandai pesanan ini sebagai diterima.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, tandai sebagai diterima',
            cancelButtonText: 'Tidak, batalkan',
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/sampai/${transactionId}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${Cookies.get('token')}`,
                        },
                    }
                );

                if (response.status === 200) {
                    // Tampilkan alert sukses setelah status diupdate
                    Swal.fire({
                        title: 'Sukses!',
                        text: 'Pesanan telah diterima.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });

                    // Update status lokal di state transaksi
                    setTransactions((prevTransactions) =>
                        prevTransactions.map((transaction) =>
                            transaction.transaksi_id === transactionId
                                ? { ...transaction, status: 'delivered' }
                                : transaction
                        )
                    );
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Gagal menandai pesanan sebagai diterima',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                }
            } catch (error) {
                console.error("Terjadi kesalahan saat mengupdate status pesanan:", error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Terjadi kesalahan saat mengupdate status pesanan.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        }
    };



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
                                <p className='font-semibold'>Histori Transaksi Saya</p>
                                <p>Melihat daftar transaksi yang anda lakukan.</p>
                            </div>
                        </div>
                        <dialog id="modalCekStatusPengiriman" className="modal">
                            <div className="modal-box w-11/12 max-w-2xl">
                                <h3 className="font-bold text-lg">Status Pengiriman</h3>

                                {/* Summary Section */}
                                <div className="py-2">
                                    <p><strong>AWB:</strong> {shipmentData.data.summary.awb}</p>
                                    <p><strong>Kurir:</strong> {shipmentData.data.summary.courier}</p>
                                    <p><strong>Layanan:</strong> {shipmentData.data.summary.service}</p>
                                    <p><strong>Status:</strong> {shipmentData.data.summary.status}</p>
                                    <p><strong>Berat:</strong> {shipmentData.data.summary.weight} gram</p>
                                    <p><strong>Deskripsi:</strong> {shipmentData.data.summary.desc || "Tidak ada informasi."}</p>
                                </div>

                                {/* Detail Section */}
                                <div className="py-2">
                                    <p><strong>Asal:</strong> {shipmentData.data.detail.origin || "Tidak ada informasi"}</p>
                                    <p><strong>Tujuan:</strong> {shipmentData.data.detail.destination}</p>
                                    <p><strong>Pengirim:</strong> {shipmentData.data.detail.shipper}</p>
                                    <p><strong>Penerima:</strong> {shipmentData.data.detail.receiver}</p>
                                </div>

                                {/* History Section */}
                                <div className="py-2">
                                    <h4 className="font-semibold">Riwayat Pengiriman:</h4>
                                    <ol className="overflow-hidden space-y-8">
                                        {shipmentData.data.history.map((item, index) => (
                                            <li
                                                key={index}
                                                className={`relative flex-1 after:content-[''] after:w-0.5 after:h-full ${index === 0 ? 'after:bg-primary' : 'after:bg-gray-200'} after:inline-block after:absolute after:-bottom-10 after:left-4 lg:after:left-5`}
                                            >
                                                <div className="flex items-center font-medium w-full">
                                                    <span
                                                        className={`w-8 h-8 ${index === 0 ? 'bg-primary' : index === 1 ? 'bg-green-50' : 'bg-gray-50'} border-2 ${index === 0 ? 'border-transparent' : 'border-primary'} rounded-full flex justify-center items-center mr-3 text-sm ${index === 0 ? 'text-white' : 'text-primary'} lg:w-10 lg:h-10`}
                                                    >
                                                        {/* {index + 1} */}
                                                    </span>
                                                    <div className="block">
                                                        <h4 className={`text-sm ${index === 0 ? 'text-primary' : 'text-gray-900'}`}>{item.desc}</h4>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                            <form method="dialog" className="modal-backdrop">
                                <button>Close</button>
                            </form>
                        </dialog>

                        <div className="flex flex-col gap-2">
                            {loading ?
                                (
                                    // Skeleton placeholders
                                    Array.from({ length: 3 }).map(
                                        (_, index) => (
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
                                        )
                                    )
                                )
                                :
                                (
                                    transactions.length ?
                                        (
                                            transactions.map((transaction) => (
                                                <div key={transaction.transaksi_id} className="flex gap-4 flex-col bg-white w-full p-4 rounded-lg shadow-md">
                                                    <div className="flex justify-end w-full gap-5">
                                                        {
                                                            transaction.status === 'delivered' ? (
                                                                <p>Status: Pesanan telah diterima</p>
                                                            ) : transaction.status === 'delivering' ? (
                                                                <p>Status: Pesanan sedang dikirim</p>
                                                            ) : transaction.status === 'success' ? (
                                                                <p>Status: Sudah dibayar</p>
                                                            ) : transaction.status === 'pending' ? (
                                                                <p>Status: Belum dibayar</p>
                                                            ) : transaction.status === 'failed' ? (
                                                                <p>Status: Gagal dibayar</p>
                                                            ) : (
                                                                <p>Status: Tidak diketahui</p>
                                                            )
                                                        }
                                                    </div>
                                                    {transaction.transaksi_item.map((transaksi_item) => (
                                                        <div key={transaksi_item.transaksi_item_id} className="flex w-full gap-5">
                                                            <img className="w-20 h-20 rounded-lg" src={transaksi_item.gambar} />
                                                            <div className="flex flex-col w-full">
                                                                <div>{transaksi_item.nama_produk}</div>
                                                                <div className="flex justify-between">
                                                                    <div>x{transaksi_item.quantity}</div>
                                                                    <div>Rp. {transaksi_item.harga.toLocaleString()}</div>
                                                                </div>
                                                                {
                                                                    transaction.status === 'delivered' && transaksi_item.israted == 0 ? (
                                                                        <div className='flex justify-end mt-2'>
                                                                            <Link
                                                                                href="/ulasan"
                                                                                className="text-sm bg-primary font-poppins rounded-lg px-4 py-2 border-2 border-primary text-white text-center hover:bg-white hover:text-primary"
                                                                            >
                                                                                Beri ulasan
                                                                            </Link>
                                                                        </div>) : (null)
                                                                }
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className="flex flex-col gap-2">

                                                        <div className="flex justify-end gap-">
                                                            <div>Total Pesanan:</div>
                                                            <div className="text-primary">Rp. {transaction.total_harga.toLocaleString()}</div>
                                                        </div>
                                                        <div className="flex items-center justify-end gap-8 w-full
                                                        ">

                                                            {
                                                                transaction.status === 'delivering' ? (
                                                                    <>
                                                                        <a onClick={() => {
                                                                            fetchTrackingData(transaction.resi)
                                                                            const modal = document.getElementById('modalCekStatusPengiriman') as HTMLDialogElement | null;
                                                                            if (modal) {
                                                                                modal.showModal();
                                                                            }
                                                                        }} className='flex justify-center items-center gap-2 text-primary hover:underline'><FaTruck /> Cek Status Pengiriman</a>
                                                                        <button
                                                                            onClick={() => handleMarkAsReceived(transaction.transaksi_id)}
                                                                            className="w-60 bg-primary font-poppins rounded-lg px-4 py-2 border-2 border-primary text-white text-center w-full hover:bg-white hover:text-primary"
                                                                        >
                                                                            Pesanan sudah diterima
                                                                        </button>
                                                                    </>
                                                                ) : transaction.status === 'pending' ? (
                                                                    <button
                                                                        onClick={() => handleBayarUlang(transaction.transaksi_id)}
                                                                        className="w-60 bg-primary font-poppins rounded-lg px-4 py-2 border-2 border-primary text-white text-center w-full hover:bg-white hover:text-primary"
                                                                    >
                                                                        Bayar
                                                                    </button>
                                                                ) : (null)
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) :
                                        (
                                            <div className="flex justify-center bg-white w-full p-4 rounded-lg shadow-md">
                                                Tidak ada transaksi.
                                            </div>
                                        )
                                )
                            }
                        </div>
                    </section>
                </div>
            </div >
        </>
    );
}
