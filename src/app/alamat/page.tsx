'use client';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import React, { useEffect, useState } from 'react';
import type { Alamat } from '@/lib/interfaces/Alamat';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

interface Provinsi {
    id: number;
    name: string;
}

interface Kabupaten {
    id: number
    name: string
}

interface Kecamatan {
    id: number
    name: string
}

interface Kelurahan {
    id: number
    name: string
}

export default function Alamat() {
    const [dataAlamat, setDataAlamat] = useState<Alamat[]>([]);
    const [currentAlamat, setCurrentAlamat] = useState<Alamat | null>(null);
    const [loading, setLoading] = useState(true);
    const [provinsi, setProvinsi] = useState<Provinsi[]>([{
        id: 0,
        name: ""
    }]);
    const [kabupaten, setKabupaten] = useState<Kabupaten[]>([{
        id: 0,
        name: ""
    }]);
    const [kecamatan, setKecamatan] = useState<Kecamatan[]>([{
        id: 0,
        name: ""
    }]);
    const [kelurahan, setKelurahan] = useState<Kelurahan[]>([{
        id: 0,
        name: ""
    }]);
    const [isProvinsiDisabled, setIsProvinsiDisabled] = useState(false);
    const [isKabupatenDisabled, setIsKabupatenDisabled] = useState(true);
    const [isKecamatanDisabled, setIsKecamatanDisabled] = useState(true);
    const [isKelurahanDisabled, setIsKelurahanDisabled] = useState(true);

    // Improved form state typing
    const [dataForm, setDataForm] = useState<Alamat>({
        alamat_id: 0,
        label_alamat: '',
        nama_penerima: '',
        no_telepon: '',
        provinsi: '',
        kabupaten: '',
        kecamatan: '',
        kelurahan: '',
        kodepos: '',
        detail: '',
        catatan_kurir: '',
        isPrimary: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDataForm({
            ...dataForm,
            [name]: value,
        });

        if (name === 'provinsi' && value) {
            fetchKabupaten(value); // Fetch Kabupatens when a Provinsi is selected
            setIsKabupatenDisabled(false); // Enable Kabupaten select
        } else if (name === 'kabupaten' && value) {
            setIsProvinsiDisabled(true);
            fetchKecamatan(value); // Fetch Kecamatans when a Kabupaten is selected
            setIsKecamatanDisabled(false); // Enable Kecamatan select
        } else if (name === 'kecamatan' && value) {
            setIsKabupatenDisabled(true);
            fetchKelurahan(value); // Fetch Kelurahans when a Kecamatan is selected
            setIsKelurahanDisabled(false); // Enable Kelurahan select
        } else if (name === 'kelurahan' && value) {
            setIsKecamatanDisabled(true);
        }
    };

    const handleSubmitAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Make the POST request
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/alamat/add`, dataForm, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                },
            });

            Swal.fire({
                icon: 'success',
                title: 'Alamat berhasil ditambahkan!',
                showConfirmButton: false,
                timer: 1500,
            });

            // Reset form fields
            setDataForm({
                alamat_id: 0,
                label_alamat: '',
                nama_penerima: '',
                no_telepon: '',
                provinsi: '',
                kabupaten: '',
                kecamatan: '',
                kelurahan: '',
                kodepos: '',
                detail: '',
                catatan_kurir: '',
                isPrimary: 0,
            });

            // Close the modal if it is open
            const modal = document.getElementById('modalTambahData') as HTMLDialogElement | null;
            if (modal) {
                modal.close();
            }

            // Refresh address list after adding
            await fetchDataAlamat();
        } catch (error) {
            console.error("Error posting form data:", error);
            handleAxiosError(error); // Handle error with a consistent approach
        }
    };

    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Make the PUT request to update the address
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/alamat/edit/${currentAlamat?.alamat_id}`,  // Assuming `currentAlamat` contains the address to edit
                dataForm, 
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('token')}`,
                    },
                }
            );
    
            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Alamat berhasil diupdate!',
                showConfirmButton: false,
                timer: 1500,
            });
    
            // Reset form fields after successful submission (optional if needed)
            setDataForm({
                alamat_id: 0,
                label_alamat: '',
                nama_penerima: '',
                no_telepon: '',
                provinsi: '',
                kabupaten: '',
                kecamatan: '',
                kelurahan: '',
                kodepos: '',
                detail: '',
                catatan_kurir: '',
                isPrimary: 0,
            });
    
            // Close modal after form submission
            const modal = document.getElementById('modalEditData') as HTMLDialogElement | null;
            if (modal) {
                modal.close(); // Close the modal if it exists
            }
    
            // Optionally, refresh the address list after editing
            await fetchDataAlamat();
    
        } catch (error) {
            console.error("Error posting form data:", error);
            handleAxiosError(error); // Handle error with a consistent approach
        }
    };    

    const handleJadikanUtama = async (id: number) => {
        // Show confirmation dialog
        const result = await Swal.fire({
            icon: 'question',
            title: 'Apakah ingin menjadikan alamat ini sebagai alamat utama?',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak',
        });

        // If the user confirmed, proceed with the API request
        if (result.isConfirmed) {
            try {
                // Make the POST request to update the primary address
                await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/alamat/primary/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('token')}`,
                    },
                });

                // Show success alert after updating the address
                Swal.fire({
                    icon: 'success',
                    title: 'Alamat berhasil dijadikan utama!',
                    showConfirmButton: false,
                    timer: 1500,
                });
            } catch (error) {
                console.error("Error posting form data:", error);
                handleAxiosError(error); // Handle error with a consistent approach
            }
        }
    };


    const handleAxiosError = (error: unknown) => {
        if (axios.isAxiosError(error) && error.response) {
            Swal.fire({
                icon: 'error',
                title: error.response.data.message || 'Error',
                showConfirmButton: false,
                timer: 1500,
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Terjadi kesalahan',
                text: 'Mohon coba lagi nanti.',
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    const fetchDataAlamat = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/alamat`, {
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
            handleAxiosError(error); // Pass error to consistent error handling
            setDataAlamat([]); // Set to empty array on error
        } finally {
            setLoading(false);
        }
    };

    const fetchProvinsi = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_MONGODB_API_URL}/getProvinsi`);

            console.log("API Response:", response.data); // Log to check response structure

            // Check if the response data structure contains 'data' array
            if (response.data && Array.isArray(response.data)) {

                setProvinsi(response.data || []); // Set the fetched data directly
            } else {
                setDataAlamat([]); // Set to empty array if data is not an array
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
            handleAxiosError(error); // Pass error to consistent error handling
            setProvinsi([]); // Set to empty array on error
        }
    };

    const fetchKabupaten = async (name: string) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_MONGODB_API_URL}/getKabupaten?nama_provinsi=${name}`);

            console.log("API Response:", response.data); // Log to check response structure

            // Check if the response data structure contains 'data' array
            if (response.data && Array.isArray(response.data)) {

                setKabupaten(response.data || []); // Set the fetched data directly
            } else {
                setDataAlamat([]); // Set to empty array if data is not an array
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
            handleAxiosError(error); // Pass error to consistent error handling
            setKabupaten([]); // Set to empty array on error
        }
    };

    const fetchKecamatan = async (name: string) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_MONGODB_API_URL}/getKecamatan?nama_kabupaten=${name}`);

            console.log("API Response:", response.data); // Log to check response structure

            // Check if the response data structure contains 'data' array
            if (response.data && Array.isArray(response.data)) {
                setKecamatan(response.data || []); // Set the fetched data directly
            } else {
                setKecamatan([]); // Set to empty array if data is not an array
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
            handleAxiosError(error); // Pass error to consistent error handling
            setKecamatan([]); // Set to empty array on error
        }
    };

    const fetchKelurahan = async (name: string) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_MONGODB_API_URL}/getKelurahan?nama_kecamatan=${name}`);

            console.log("API Response:", response.data); // Log to check response structure

            // Check if the response data structure contains 'data' array
            if (response.data && Array.isArray(response.data)) {
                setKelurahan(response.data || []); // Set the fetched data directly
            } else {
                setKelurahan([]); // Set to empty array if data is not an array
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
            handleAxiosError(error); // Pass error to consistent error handling
            setKelurahan([]); // Set to empty array on error
        }
    };


    useEffect(() => {
        fetchProvinsi();
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
                                <div className="modal-box max-w-3xl">
                                    <h3 className="font-bold text-lg">Form Tambah Data</h3>
                                    <form className="flex flex-col mt-4 w-full gap-2 rounded-lg font-poppins" onSubmit={handleSubmitAdd}>
                                        <div className="flex gap-4">
                                            <div className="flex flex-col w-1/2">
                                                <label htmlFor="label_alamat">Label Alamat</label>
                                                <input
                                                    type="text"
                                                    id="label_alamat"
                                                    name="label_alamat"
                                                    placeholder="Masukkan Label Alamat"
                                                    className="w-full p-2 rounded-md bg-gray-100"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="flex flex-col w-1/2">
                                                <label htmlFor="nama_penerima">Nama Penerima</label>
                                                <input
                                                    type="text"
                                                    id="nama_penerima"
                                                    name="nama_penerima"
                                                    placeholder="Masukkan Nama Penerima"
                                                    className="w-full p-2 rounded-md bg-gray-100"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex flex-col w-1/2">
                                                <label htmlFor="no_telepon">No Telepon</label>
                                                <input
                                                    type="text"
                                                    id="no_telepon"
                                                    name="no_telepon"
                                                    placeholder="Masukkan No Telepon"
                                                    className="w-full p-2 rounded-md bg-gray-100"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="flex flex-col w-1/2">
                                                <label htmlFor="provinsi">Provinsi</label>
                                                <select
                                                    id="provinsi"
                                                    name="provinsi"
                                                    className="w-full p-2 rounded-md bg-gray-100"
                                                    onChange={handleChange}
                                                    disabled={isProvinsiDisabled}
                                                >
                                                    <option value="">Pilih Provinsi</option>
                                                    {provinsi.map((item, index) => (
                                                        <option key={index} value={item.name}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex flex-col w-1/2">
                                                <label htmlFor="kabupaten">Kabupaten</label>
                                                <select
                                                    id="kabupaten"
                                                    name="kabupaten"
                                                    className="w-full p-2 rounded-md bg-gray-100"
                                                    onChange={handleChange}
                                                    disabled={isKabupatenDisabled}
                                                >
                                                    <option value="">Pilih Kabupaten</option>
                                                    {kabupaten.map((item, index) => (
                                                        <option key={index} value={item.name}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex flex-col w-1/2">
                                                <label htmlFor="kecamatan">Kecamatan</label>
                                                <select
                                                    id="kecamatan"
                                                    name="kecamatan"
                                                    className="w-full p-2 rounded-md bg-gray-100"
                                                    onChange={handleChange}
                                                    disabled={isKecamatanDisabled} // Disabled until Kabupaten is selected
                                                >
                                                    <option value="">Pilih Kecamatan</option>
                                                    {kecamatan.map((item, index) => (
                                                        <option key={index} value={item.name}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex flex-col w-1/2">
                                                <label htmlFor="kelurahan">Kelurahan</label>
                                                <select
                                                    id="kelurahan"
                                                    name="kelurahan"
                                                    className="w-full p-2 rounded-md bg-gray-100"
                                                    onChange={handleChange}
                                                    disabled={isKelurahanDisabled} // Disabled until Kabupaten is selected
                                                >
                                                    <option value="">Pilih Kelurahan</option>
                                                    {kelurahan.map((item, index) => (
                                                        <option key={index} value={item.name}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex flex-col w-1/2">
                                                <label htmlFor="kodepos">Kode Pos</label>
                                                <input
                                                    type="text"
                                                    id="kodepos"
                                                    name="kodepos"
                                                    placeholder="Masukkan Kode Pos"
                                                    className="w-full p-2 rounded-md bg-gray-100"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex flex-col w-1/2">
                                                <label htmlFor="detail">Detail Alamat</label>
                                                <textarea
                                                    id="detail"
                                                    name="detail"
                                                    placeholder="Masukkan Detail Alamat"
                                                    className="w-full p-2 rounded-md bg-gray-100"
                                                    onChange={handleChange}
                                                ></textarea>
                                            </div>
                                            <div className="flex flex-col w-1/2">
                                                <label htmlFor="catatan_kurir">Catatan Kurir</label>
                                                <textarea
                                                    id="catatan_kurir"
                                                    name="catatan_kurir"
                                                    placeholder="Masukkan Catatan Kurir"
                                                    className="w-full p-2 rounded-md bg-gray-100"
                                                    onChange={handleChange}
                                                ></textarea>
                                            </div>
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
                                    <form className="flex flex-col mt-4 w-full gap-2 rounded-lg font-poppins" onSubmit={handleSubmitEdit}>
                                        <div className="flex flex-col">
                                            <label htmlFor="label_alamat">Label Alamat</label>
                                            <input
                                                type="text"
                                                id="label_alamat"
                                                name="label_alamat"
                                                value={currentAlamat?.label_alamat || ""}
                                                placeholder="Masukkan Label Alamat"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="nama_penerima">Nama Penerima</label>
                                            <input
                                                type="text"
                                                id="nama_penerima"
                                                name="nama_penerima"
                                                value={currentAlamat?.nama_penerima || ""}
                                                placeholder="Masukkan Nama Penerima"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="no_telepon">No Telepon</label>
                                            <input
                                                type="text"
                                                id="no_telepon"
                                                name="no_telepon"
                                                value={currentAlamat?.no_telepon || ""}
                                                placeholder="Masukkan No Telepon"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="detail">Detail Alamat</label>
                                            <textarea
                                                id="detail"
                                                name="detail"
                                                value={currentAlamat?.detail || ""}
                                                placeholder="Masukkan Detail Alamat"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="kelurahan">Kelurahan</label>
                                            <input
                                                type="text"
                                                id="kelurahan"
                                                name="kelurahan"
                                                value={currentAlamat?.kelurahan || ""}
                                                placeholder="Masukkan Kelurahan"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="kecamatan">Kecamatan</label>
                                            <input
                                                type="text"
                                                id="kecamatan"
                                                name="kecamatan"
                                                value={currentAlamat?.kecamatan || ""}
                                                placeholder="Masukkan Kecamatan"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="kabupaten">Kabupaten</label>
                                            <input
                                                type="text"
                                                id="kabupaten"
                                                name="kabupaten"
                                                value={currentAlamat?.kabupaten || ""}
                                                placeholder="Masukkan Kabupaten"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="provinsi">Provinsi</label>
                                            <input
                                                type="text"
                                                id="provinsi"
                                                name="provinsi"
                                                value={currentAlamat?.provinsi || ""}
                                                placeholder="Masukkan Provinsi"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="kodepos">Kode Pos</label>
                                            <input
                                                type="text"
                                                id="kodepos"
                                                name="kodepos"
                                                value={currentAlamat?.kodepos || ""}
                                                placeholder="Masukkan Kode Pos"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="catatan_kurir">Catatan Kurir</label>
                                            <textarea
                                                id="catatan_kurir"
                                                name="catatan_kurir"
                                                value={currentAlamat?.catatan_kurir || ""}
                                                placeholder="Masukkan Catatan Kurir"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                onChange={handleChange}
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

                            {/* <dialog id="modalHapusData" className="modal">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg">Apakah Anda yakin ingin menghapus {currentAlamat?.label_alamat}?</h3>
                                    <div className="flex items-center justify-center h-[100px]">
                                        <i className="inline fa-solid fa-warning fa-2xl text-[100px]" />
                                    </div>
                                    <form className="flex gap-3 w-full">
                                        <button type="button" className="w-full p-2 rounded-md bg-white text-primary border-primary hover:bg-primary hover:text-white">
                                            Tidak
                                        </button>
                                        <button type="submit" className="w-full p-2 rounded-md bg-red-600 text-white hover:bg-red-800">
                                            Ya
                                        </button>
                                    </form>
                                </div>
                                <form method="dialog" className="modal-backdrop">
                                    <button>close</button>
                                </form>
                            </dialog> */}

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
                                                        setCurrentAlamat(alamat);
                                                        const modal = document.getElementById('modalEditData') as HTMLDialogElement | null;
                                                        modal?.showModal();
                                                    }}>
                                                        Ubah
                                                    </a>
                                                    {!alamat.isPrimary && (
                                                        <button className="p-2 border-2 rounded-lg bg-primary text-white"
                                                            onClick={() => handleJadikanUtama(alamat.alamat_id)}>
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
