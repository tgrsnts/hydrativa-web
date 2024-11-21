'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/app/admin/components/Sidebar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { Alat } from '@/lib/interfaces/Alat';

export default function Page() {
    const [alats, setAlats] = useState<Alat[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAlats = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sensor`);
            if (!response.ok) {
                throw new Error('Failed to fetch alat');
            }
            const result = await response.json();
            setAlats(result || []); // Set products directly to the result array
        } catch (error) {
            console.error('Failed to fetch alat:', error);
            setAlats([]);
        } finally {
            setLoading(false);
        }
    };

    const addAlat = async () => {
        const result = await Swal.fire({
            title: 'Apakah anda ingin menambah alat?',
            text: 'Kode Alat akan terbuat secara otomatis!',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
        });
        if (result.isConfirmed) {
            try {

                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/sensor`,
                    {},
                    {
                        headers: {
                            'Content-Type': 'application/json', // Ubah menjadi multipart
                            'Authorization': `Bearer ${Cookies.get('token')}`,
                        },
                    }
                );

                if (response.status === 200) {
                    // Update state tanpa memanggil fetchProducts
                    setAlats((prevAlats) => {
                        if (Array.isArray(prevAlats)) {
                            return [...prevAlats, response.data.alat]; // Spread the previous state and add new product
                        }
                        console.error("prevAlats is not an array:", prevAlats);
                        return prevAlats;
                    });// Tambahkan produk baru ke state
                    Swal.fire({
                        icon: 'success',
                        title: 'Materi berhasil ditambahkan!',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    const modal = document.getElementById('modalTambahData') as HTMLDialogElement | null;
                    modal?.close();
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Terjadi kesalahan',
                    text: 'Mohon coba lagi nanti.',
                    showConfirmButton: false,
                    timer: 1500,
                });
                console.error('Error adding product:', error);
            }
        }
    };

    useEffect(() => {
        fetchAlats();
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
                        className="min-h-screen font-poppins w-full flex flex-col mt-2 pt-10 px-4 pb-20 bg-slate-50"
                    >
                        <div className="flex flex-col gap-4 bg-white p-4 w-full rounded-lg shadow-md">
                            <div className="flex justify-between items-center">
                                <div className="font-semibold">Data Alat</div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="bg-primary hover:bg-background text-white px-4 py-2 rounded-md"
                                        onClick={addAlat}
                                    >
                                        Tambah Data
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <div className='flex justify-center'>
                                    <span className="loading loading-spinner loading-md"></span>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="table rounded-lg">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Kode Alat</th>
                                                <th>Nama Kebun</th>
                                                <th>Luas Kebun</th>
                                                <th>Lokasi Kebun</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {alats.length ? (
                                                alats.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.alat_id}</td>
                                                        <td>
                                                            <p className="line-clamp-3">{item.kebun?.nama_kebun || 'Tidak ada nama kebun'}</p>
                                                        </td>
                                                        <td>{item.kebun?.luas_lahan || 'Tidak tersedia'}</td>
                                                        <td>{item.kebun?.lokasi_kebun || 'Tidak tersedia'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7} className="text-center">
                                                        Tidak ada alat.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>

                                    </table>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
