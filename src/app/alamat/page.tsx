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

    const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

            // Success alert
            Swal.fire({
                icon: 'success',
                title: 'Alamat berhasil ditambahkan!',
                showConfirmButton: false,
                timer: 1500,
            });

            // Disable/enable form fields after submission
            setIsProvinsiDisabled(false);
            setIsKabupatenDisabled(true);
            setIsKecamatanDisabled(true);
            setIsKelurahanDisabled(true);

            // Close the modal if it exists
            const modal = document.getElementById('modalTambahData') as HTMLDialogElement | null;
            if (modal) {
                modal.close();
            }

            setDataAlamat((prevDataAlamat) => [...prevDataAlamat, dataForm]);

            // Reset form data
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

        } catch (error) {
            console.error("Error posting form data:", error);
            handleAxiosError(error); // Handle error with a consistent approach
        }
    };

    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Make the POST request to update the address
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/alamat/${currentAlamat?.alamat_id}`,  // Assuming `currentAlamat` contains the address to edit
                currentAlamat,
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
            setCurrentAlamat({
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

            setDataAlamat((prevDataAlamat) =>
                prevDataAlamat.map((alamat) =>
                    alamat.alamat_id === currentAlamat?.alamat_id ? currentAlamat : alamat
                )
            );

        } catch (error) {
            console.error("Error posting form data:", error);
            handleAxiosError(error); // Handle error with a consistent approach
        }
    };

    const handleDeleteAlamat = async (id: number) => {
        // Show confirmation dialog
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Apakah Anda yakin ingin menghapus alamat ini?',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            customClass: {
                confirmButton: 'bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-poppins', // Red color for delete
                cancelButton: 'bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg font-poppins', // Gray color for cancel
            },
        });

        // If the user confirmed the deletion
        if (result.isConfirmed) {
            try {
                // Send DELETE request to your API to delete the address
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/alamat/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('token')}`,
                    },
                });

                // Show success alert
                Swal.fire({
                    icon: 'success',
                    title: 'Alamat berhasil dihapus!',
                    showConfirmButton: false,
                    timer: 1500,
                });

                // Optionally, update your local state to remove the address
                setDataAlamat((prevDataAlamat) =>
                    prevDataAlamat.filter((alamat) => alamat.alamat_id !== id)
                );
            } catch (error) {
                console.error("Error deleting address:", error);
                handleAxiosError(error); // Handle error with a consistent approach
            }
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
            customClass: {
                container: 'font-poppins', // Apply font to the entire dialog container
                confirmButton: 'bg-primary hover:bg-background text-white px-4 rounded-lg font-poppins', // Apply font to the confirm button
                cancelButton: 'bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg font-poppins',
            },
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

                // Update the state to move the selected address to the top
                setDataAlamat((prevDataAlamat) => {
                    const resetAlamat = prevDataAlamat.map((alamat) => ({
                        ...alamat,
                        isPrimary: 0, // Reset all addresses to non-primary
                    }));

                    // Now set the selected address as primary
                    const updatedAlamat = resetAlamat.map((alamat) =>
                        alamat.alamat_id === id ? { ...alamat, isPrimary: 1 } : alamat
                    );

                    // Sort addresses with primary address at the top
                    const sortedAlamat = [
                        ...updatedAlamat.filter((alamat) => alamat.isPrimary === 1),
                        ...updatedAlamat.filter((alamat) => alamat.isPrimary === 0),
                    ];

                    return sortedAlamat;
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
                                <div className="modal-box max-w-3xl">
                                    <h3 className="font-bold text-lg">Form Edit Data</h3>
                                    <form className="flex flex-col mt-4 w-full gap-2 rounded-lg font-poppins" onSubmit={handleSubmitEdit}>
                                        <div className="flex gap-4">
                                            <div className="flex flex-col w-1/2">
                                                <label htmlFor="label_alamat">Label Alamat</label>
                                                <input
                                                    type="text"
                                                    id="label_alamat"
                                                    name="label_alamat"
                                                    defaultValue={currentAlamat?.label_alamat || ""}
                                                    placeholder="Masukkan Label Alamat"
                                                    className="w-full p-2 rounded-md bg-gray-100"
                                                    onChange={handleChangeEdit}
                                                />
                                            </div>
                                            <div className="flex flex-col w-1/2">
                                                <label htmlFor="nama_penerima">Nama Penerima</label>
                                                <input
                                                    type="text"
                                                    id="nama_penerima"
                                                    name="nama_penerima"
                                                    defaultValue={currentAlamat?.nama_penerima || ""}
                                                    placeholder="Masukkan Nama Penerima"
                                                    className="w-full p-2 rounded-md bg-gray-100"
                                                    onChange={handleChangeEdit}
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
                                                    defaultValue={currentAlamat?.no_telepon || ""}
                                                    placeholder="Masukkan No Telepon"
                                                    className="w-full p-2 rounded-md bg-gray-100"
                                                    onChange={handleChangeEdit}
                                                />
                                            </div>
                                            <div className="flex flex-col w-1/2">
                                                <label htmlFor="provinsi">Provinsi</label>
                                                <select
                                                    id="provinsi"
                                                    name="provinsi"
                                                    defaultValue={currentAlamat?.provinsi || ""}
                                                    className="w-full p-2 rounded-md bg-gray-100"
                                                    onChange={handleChangeEdit}
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
                                                    defaultValue={currentAlamat?.kabupaten || ""}
                                                    className="w-full p-2 rounded-md bg-gray-100"
                                                    onChange={handleChangeEdit}
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
                                                    defaultValue={currentAlamat?.kecamatan || ""}
                                                    className="w-full p-2 rounded-md bg-gray-100"
                                                    onChange={handleChangeEdit}
                                                    disabled={isKecamatanDisabled}
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
                                                    defaultValue={currentAlamat?.kelurahan || ""}
                                                    className="w-full p-2 rounded-md bg-gray-100"
                                                    onChange={handleChangeEdit}
                                                    disabled={isKelurahanDisabled}
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
                                                    defaultValue={currentAlamat?.kodepos || ""}
                                                    placeholder="Masukkan Kode Pos"
                                                    className="w-full p-2 rounded-md bg-gray-100"
                                                    onChange={handleChangeEdit}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex flex-col w-1/2">
                                                <label htmlFor="detail">Detail Alamat</label>
                                                <textarea
                                                    id="detail"
                                                    name="detail"
                                                    defaultValue={currentAlamat?.detail || ""}
                                                    placeholder="Masukkan Detail Alamat"
                                                    className="w-full p-2 rounded-md bg-gray-100"
                                                    onChange={handleChangeEdit}
                                                />
                                            </div>
                                            <div className="flex flex-col w-1/2">
                                                <label htmlFor="catatan_kurir">Catatan Kurir</label>
                                                <textarea
                                                    id="catatan_kurir"
                                                    name="catatan_kurir"
                                                    defaultValue={currentAlamat?.catatan_kurir || ""}
                                                    placeholder="Masukkan Catatan Kurir"
                                                    className="w-full p-2 rounded-md bg-gray-100"
                                                    onChange={handleChangeEdit}
                                                />
                                            </div>
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
                                                    <button className="text-primary"
                                                        onClick={() => {
                                                            setCurrentAlamat(alamat)
                                                            fetchKabupaten(alamat.provinsi)
                                                            fetchKecamatan(alamat.kabupaten)
                                                            fetchKelurahan(alamat.kecamatan)
                                                            const modal = document.getElementById('modalEditData') as HTMLDialogElement | null;
                                                            if (modal) {
                                                                modal.showModal();
                                                            }
                                                        }}>
                                                        Ubah
                                                    </button>
                                                    {!alamat.isPrimary && (
                                                        <>
                                                            <button className="p-2 rounded-lg bg-red-600 text-white"
                                                                onClick={() => {
                                                                    handleDeleteAlamat(alamat.alamat_id)
                                                                }}>
                                                                Hapus
                                                            </button>
                                                            <button className="p-2 rounded-lg bg-primary text-white"
                                                                onClick={() => handleJadikanUtama(alamat.alamat_id)}>
                                                                Atur sebagai Utama
                                                            </button>
                                                        </>
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
