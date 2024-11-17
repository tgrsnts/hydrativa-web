'use client'
import Navbar from '@/components/Navbar'
import Sidebar from '@/app/admin/components/Sidebar'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import Swal from 'sweetalert2'
import Transaksi from '@/lib/interfaces/Transaksi'
import Transaction4MonthsChart from '../components/Transaction4MonthsChart'
import RevenueChart from '../components/RevenueChart'

export default function Pesanan() {
    const [transactions, setTransactions] = useState<Transaksi[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    useEffect(() => {
        if (transactions.length === 0) return;

        // Get current month and year
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Filter transactions for the current month and year
        const filteredTransactions = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.created_at); // Adjust `created_at` to your field name
            return (
                transactionDate.getMonth() === currentMonth &&
                transactionDate.getFullYear() === currentYear
            );
        });

        // Calculate total revenue
        const revenue = filteredTransactions.reduce((total, transaction) => {
            return total + transaction.total_harga; // Adjust `amount` to your field name
        }, 0);

        // Set the total revenue and order count
        setTotalRevenue(revenue);
        setTotalOrders(filteredTransactions.length);
    }, [transactions]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transaksi/dashboard`, {
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
                                <p className='font-semibold'>Dashboard</p>
                            </div>
                        </div>

                        <div className='flex gap-2'>
                            <div className="flex flex-col gap-2 rounded-lg bg-white w-full py-4 shadow-md">
                                <div className="flex flex-col gap-2 px-4 py-2">
                                    <p className='font-semibold'>Total Penjualan (Bulan Ini)</p>
                                    {loading ? (
                                        <div className='flex justify-center'>
                                            <span className="loading loading-spinner loading-md"></span>
                                        </div>
                                    ) : (
                                        <p className='text-3xl font-bold'>Rp. {totalRevenue.toLocaleString()}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 rounded-lg bg-white w-full py-4 shadow-md">
                                <div className="flex flex-col gap-2 px-4 py-2">
                                    <p className='font-semibold'>Total Pesanan (Bulan Ini)</p>
                                    {loading ? (
                                        <div className='flex justify-center'>
                                            <span className="loading loading-spinner loading-md"></span>
                                        </div>
                                    ) : (
                                        <p className='text-3xl font-bold'>{totalOrders} Pesanan</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='flex gap-2'>
                            <div className="flex flex-col gap-2 rounded-lg bg-white w-full py-4 shadow-md">
                                <div className="px-4 py-2">
                                    <p className='font-semibold mb-4'>Grafik Total Pendapatan 4 Bulan Terakhir</p>
                                    {loading ? (
                                        <div className='flex justify-center'>
                                            <span className="loading loading-spinner loading-md"></span>
                                        </div>
                                    ) : (
                                        <RevenueChart transactions={transactions} />
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 rounded-lg bg-white w-full py-4 shadow-md">
                                <div className="px-4 py-2">
                                    <p className='font-semibold mb-4'>Grafik Total Pesanan 4 Bulan Terakhir</p>
                                    {loading ? (
                                        <div className='flex justify-center'>
                                            <span className="loading loading-spinner loading-md"></span>
                                        </div>
                                    ) : (
                                        <Transaction4MonthsChart transactions={transactions} />
                                    )}
                                </div>
                            </div>
                        </div>


                    </section>
                </div>
            </div>
        </>
    );
}
