'use client';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import React, { useEffect, useState } from 'react';
import { Alamat } from '@/lib/interfaces/Alamat';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Akun() {
    const [dataAlamat, setDataAlamat] = useState<Alamat[]>([]);
    const [currentAlamat, setCurrentAlamat] = useState<Alamat | null>(null);
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
                    setDataAlamat(response.data || []); // Set the fetched data directly
                } else {
                    setDataAlamat([]); // Set to empty array if data is not an array
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setDataAlamat([]); // Set to null on error
            } finally {
                setLoading(false);
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
                        className="min-h-screen font-poppins w-full flex flex-col mt-2 pt-10 px-4 pb-20 bg-slate-50"
                    >
                        <div className="flex flex-col bg-white p-4 w-full rounded-lg shadow-md">
                            <div className="flex justify-between">
                                <div className="flex flex-col">
                                    <div className="font-semibold">Alamat Saya</div>
                                    <div>Kelola alamat Anda.</div>
                                </div>
                                <button
                                    type="submit"
                                    className="bg-primary hover:bg-background text-white px-4 rounded-lg"
                                    onClick={() => {
                                        const modal = document.getElementById('modalTambahData') as HTMLDialogElement | null;
                                        if (modal) {
                                            modal.showModal();
                                        }
                                    }}
                                >
                                    Tambah Alamat
                                </button>
                            </div>
                            <dialog id="modalTambahData" className="modal">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg">Form Tambah Data</h3>
                                    <form className="flex flex-col mt-4 w-full gap-2 rounded-lg font-poppins">
                                        <div className="flex flex-col">
                                            <label htmlFor="label_alamat">Label Alamat</label>
                                            <input type="text" id="label_alamat" placeholder="Masukkan Label Alamat" className="w-full p-2 rounded-md bg-gray-100" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="nama_penerima">Nama Penerima</label>
                                            <input type="text" id="nama_penerima" placeholder="Masukkan Nama Penerima" className="w-full p-2 rounded-md bg-gray-100" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="no_telepon">No Telepon</label>
                                            <input type="text" id="no_telepon" placeholder="Masukkan No Telepon" className="w-full p-2 rounded-md bg-gray-100" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="detail">Detail Alamat</label>
                                            <textarea id="detail" placeholder="Masukkan Detail Alamat" className="w-full p-2 rounded-md bg-gray-100"></textarea>
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="kelurahan">Kelurahan</label>
                                            <input type="text" id="kelurahan" placeholder="Masukkan Kelurahan" className="w-full p-2 rounded-md bg-gray-100" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="kecamatan">Kecamatan</label>
                                            <input type="text" id="kecamatan" placeholder="Masukkan Kecamatan" className="w-full p-2 rounded-md bg-gray-100" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="kabupaten">Kabupaten</label>
                                            <input type="text" id="kabupaten" placeholder="Masukkan Kabupaten" className="w-full p-2 rounded-md bg-gray-100" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="provinsi">Provinsi</label>
                                            <input type="text" id="provinsi" placeholder="Masukkan Provinsi" className="w-full p-2 rounded-md bg-gray-100" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="kodepos">Kode Pos</label>
                                            <input type="text" id="kodepos" placeholder="Masukkan Kode Pos" className="w-full p-2 rounded-md bg-gray-100" />
                                        </div>                                        
                                        <div className="flex flex-col">
                                            <label htmlFor="catatan_kurir">Catatan Kurir</label>
                                            <textarea id="catatan_kurir" placeholder="Masukkan Catatan Kurir" className="w-full p-2 rounded-md bg-gray-100"></textarea>
                                        </div>
                                        <div className="flex gap-2 mt-2 mb-4">
                                            <input type="checkbox" id="isPrimary" className="w-fit p-2 rounded-md bg-gray-100" />
                                            <label htmlFor="isPrimary">Jadikan Alamat Utama</label>
                                        </div>
                                        <div className="flex flex-col mt-2">
                                            <button type="submit" className="p-2 rounded-md bg-primary text-white">Tambah</button>
                                        </div>
                                    </form>
                                </div>
                                <form method="dialog" className="modal-backdrop">
                                    <button>close</button>
                                </form>
                            </dialog>

                            <dialog id="modalEditData" className="modal">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg">Form Edit Data</h3>
                                    <form className="flex flex-col mt-4 w-full gap-2 rounded-lg font-poppins">
                                        <div className="flex flex-col">
                                            <label htmlFor="label_alamat">Label Alamat</label>
                                            <input
                                                type="text"
                                                id="label_alamat"
                                                defaultValue={currentAlamat?.label_alamat}
                                                placeholder="Masukkan Label Alamat"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="nama_penerima">Nama Penerima</label>
                                            <input
                                                type="text"
                                                id="nama_penerima"
                                                defaultValue={currentAlamat?.nama_penerima}
                                                placeholder="Masukkan Nama Penerima"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="no_telepon">No Telepon</label>
                                            <input
                                                type="text"
                                                id="no_telepon"
                                                defaultValue={currentAlamat?.no_telepon}
                                                placeholder="Masukkan No Telepon"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="detail">Detail Alamat</label>
                                            <textarea
                                                id="detail"
                                                defaultValue={currentAlamat?.detail}
                                                placeholder="Masukkan Detail Alamat"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="kelurahan">Kelurahan</label>
                                            <input
                                                type="text"
                                                id="kelurahan"
                                                defaultValue={currentAlamat?.kelurahan}
                                                placeholder="Masukkan Kelurahan"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="kecamatan">Kecamatan</label>
                                            <input
                                                type="text"
                                                id="kecamatan"
                                                defaultValue={currentAlamat?.kecamatan}
                                                placeholder="Masukkan Kecamatan"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="kabupaten">Kabupaten</label>
                                            <input
                                                type="text"
                                                id="kabupaten"
                                                defaultValue={currentAlamat?.kabupaten}
                                                placeholder="Masukkan Kabupaten"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="provinsi">Provinsi</label>
                                            <input
                                                type="text"
                                                id="provinsi"
                                                defaultValue={currentAlamat?.provinsi}
                                                placeholder="Masukkan Provinsi"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="kodepos">Kode Pos</label>
                                            <input
                                                type="text"
                                                id="kodepos"
                                                defaultValue={currentAlamat?.kodepos}
                                                placeholder="Masukkan Kode Pos"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                            />
                                        </div>                                        
                                        <div className="flex flex-col">
                                            <label htmlFor="catatan_kurir">Catatan Kurir</label>
                                            <textarea
                                                id="catatan_kurir"
                                                defaultValue={currentAlamat?.catatan_kurir}
                                                placeholder="Masukkan Catatan Kurir"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                            />
                                        </div>
                                        <div className="flex flex-col mt-2">
                                            <button type="submit" className="p-2 rounded-md bg-primary text-white">Simpan</button>
                                        </div>
                                    </form>
                                </div>
                                <form method="dialog" className="modal-backdrop">
                                    <button>close</button>
                                </form>
                            </dialog>
                            <dialog id="modalHapusData" className="modal">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg">Apakah Anda yakin ingin menghapus {currentAlamat?.label_alamat}?</h3>
                                    <div className="flex items-center justify-center h-[100px]">
                                        <i className="inline fa-solid fa-warning fa-2xl text-[100px]" />
                                    </div>
                                    <form className="flex gap-3 w-full">
                                        <button type="button" className="w-full p-2 rounded-md bg-white text-primary border-primary hover:bg-primary hover:text-white">
                                            Tidak
                                        </button>
                                        <button type="submit" className="w-full p-2 rounded-md bg-red-600 text-white hover:bg-red-800" onClick={() => deleteProduct(currentProduct?.id)}>
                                            Ya
                                        </button>
                                    </form>
                                </div>
                                <form method="dialog" className="modal-backdrop">
                                    <button>close</button>
                                </form>
                            </dialog>

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
                                                    <a href="" className="text-primary" onClick={() => {
                                                        setCurrentProduct(alamat);
                                                        const modal = document.getElementById('modalEditData') as HTMLDialogElement | null;
                                                        modal?.showModal();
                                                    }}>
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
