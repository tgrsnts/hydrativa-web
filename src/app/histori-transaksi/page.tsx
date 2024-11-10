'use client'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import Swal from 'sweetalert2'

export default function HistoriTransaksi() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch transaction data
    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transaksi`, {
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
                                <p className='font-semibold'>Histori Transaksi Saya</p>
                                <p>Melihat daftar transaksi yang anda lakukan.</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
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
                                        <div className="flex justify-end w-full gap-5">
                                            <p>Status: {transaction.status}</p>
                                        </div>
                                        {transaction.produk.map((product) => (
                                            <div key={product.produk_id} className="flex w-full gap-5">
                                                <img className="w-20 rounded-lg" src={`/storage/produk/${product.produk_name.toLowerCase().replace(' ', '_')}.jpeg`} alt={product.produk_name} />
                                                <div className="flex flex-col w-full">
                                                    <div>{product.produk_name}</div>
                                                    <div className="flex justify-between">
                                                        <div>x{product.quantity}</div>
                                                        <div>Rp. {product.harga.toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="bg-primary font-poppins rounded-lg px-4 py-2 border-2 border-primary text-white text-center w-full hover:bg-white hover:text-primary"
                                                >
                                                    {transaction.status === 'success' ? 'Review' : 'Pesanan telah diterima'}
                                                </button>
                                            </div>
                                            <div className="flex justify-end gap-4">
                                                <div>Total Pesanan:</div>
                                                <div className="text-primary">Rp. {transaction.total_harga.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
