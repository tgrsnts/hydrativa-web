'use client';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import React, { useEffect, useState } from 'react';
import { Alamat } from '@/lib/interfaces/Alamat';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Akun() {
    const [dataAlamat, setDataAlamat] = useState<Alamat[] | null>(null); // State for addresses
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDataAlamat = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/alamat`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('token')}`,
                    },
                });

                console.log("API Response:", response.data); // Log to check response structure

                // Check if the response data structure contains 'data' array
                if (response.data && Array.isArray(response.data)) {
                    setLoading(false);
                    setDataAlamat(response.data); // Set the fetched data directly
                } else {
                    setDataAlamat([]); // Set to empty array if data is not an array
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setDataAlamat(null); // Set to null on error
            }
        };

        fetchDataAlamat(); // Call to fetch address data
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
                        className="min-h-screen font-poppins w-full flex flex-col mt-2 pt-10 px-4 pb-20 bg-background"
                    >
                        <div className="flex flex-col bg-white p-4 w-full rounded-lg">
                            <div className="flex justify-between">
                                <div className="flex flex-col">
                                    <div className="font-semibold">Alamat Saya</div>
                                    <div>Kelola alamat Anda.</div>
                                </div>
                                <button
                                    type="submit"
                                    className="bg-primary hover:bg-[#035700] text-white px-3 py-1 rounded-md"
                                // onClick={() => {
                                //     document.getElementById('modalTambahData')!.showModal();
                                // }}
                                >
                                    Tambah Alamat
                                </button>
                            </div>
                            <div className="divider" />
                            <div className="flex flex-col gap-4">
                                {loading ? (
                                    <div className='flex justify-center'>
                                        <span className="loading loading-spinner loading-md"></span>
                                    </div>
                                ) : (
                                    dataAlamat && dataAlamat.length > 0 ? (
                                        dataAlamat.map((alamat, index) => (
                                            <div
                                                key={index}
                                                className={`flex justify-between p-4 border-2 rounded-lg ${alamat.isPrimary ? 'border-second' : ''}`}
                                            >

                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-4">
                                                        <div>{alamat.label_alamat}</div>
                                                        {alamat.isPrimary === 1 && ( // Only show "Utama" if isPrimary is 1
                                                            <div className="px-2 py-1 border-2 text-sm text-primary border-primary rounded-md">
                                                                Utama
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className='text-xl font-semibold'>{alamat.nama_penerima}</div>
                                                        <div>{alamat.no_telepon}</div>
                                                    </div>
                                                    <div>
                                                        {alamat.detail}, {alamat.kelurahan}, {alamat.kecamatan}, {alamat.kabupaten}, {alamat.provinsi}, {alamat.kodepos}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2 items-end">
                                                    <a href="" className="text-primary">
                                                        Ubah
                                                    </a>
                                                    {!alamat.isPrimary && (
                                                        <button className="p-2 border-2 rounded-lg bg-primary text-white">
                                                            Atur sebagai Utama
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-gray-500">
                                            Tidak ada alamat yang tersedia.
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
