'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { User } from '@/lib/interfaces/User';
import Cookies from "js-cookie";
import Swal from 'sweetalert2';

export default function Akun() {
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);    

    const getUserInfo = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                }
            });
            setLoading(false);
            setUserData(response.data);
            Cookies.set("name", response.data.name, { expires: 7, path: "/" });
            Cookies.set("gambar", response.data.gambar, { expires: 7, path: "/" })
        } catch (error) {
            setLoading(false);
            handleAxiosError(error);
        }
    };

    const updateUserPhoto = async (file: File) => {
        const formData = new FormData();
        formData.append('gambar', file);

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/me/photo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                }
            });
            Swal.fire({
                icon: 'success',
                title: 'Foto profil berhasil diperbarui!',
                showConfirmButton: false,
                timer: 1500,
            });
            getUserInfo();  // Refresh user data after photo update
        } catch (error) {
            handleAxiosError(error);
        }
    };

    const updateUserInfo = async (e: React.FormEvent) => {
        e.preventDefault(); // Mencegah perilaku submit form standar

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/me/update`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                }
            });
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil diperbarui!',
                showConfirmButton: false,
                timer: 1500,
            });
            getUserInfo();
        } catch (error) {
            handleAxiosError(error);
        }
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setUserData((prevUserData) =>
            prevUserData
                ? { ...prevUserData, [name]: type === 'radio' ? value : checked ? checked : value }
                : null
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
                updateUserPhoto(selectedFile);  // Directly upload when file is selected
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

    useEffect(() => {
        getUserInfo();
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
                            <div className="font-semibold">Akun Saya</div>
                            <div>Kelola informasi profil Anda.</div>
                            <div className="divider" />
                            {loading ? (
                                <div className='flex justify-center'>
                                    <span className="loading loading-spinner loading-md"></span>
                                </div>
                            ) : (
                                <form onSubmit={updateUserInfo} className="flex w-full">
                                    <div className="w-1/4 flex flex-col items-center gap-4">
                                        <img className="w-full" src={userData?.gambar} alt="Foto Profil" />
                                        <input
                                            type="file"
                                            id="gambar"
                                            name="gambar"
                                            onChange={handleFileChange}
                                            className="w-full rounded-md bg-gray-100 file:mr-5 file:py-1 file:px-3 file:border-none file:w-full file:bg-gray-100 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-green-50 hover:file:text-primary focus:outline-none focus:ring focus:ring-primary focus-border-primary"
                                        />
                                    </div>
                                    <div className="flex w-3/4 pl-8">
                                        <table className="w-full">
                                            <tbody>
                                                <tr>
                                                    <td className="w-1/4 pr-4">
                                                        <label htmlFor="username" className="block text-left">Nama Pengguna</label>
                                                    </td>
                                                    <td className="w-3/4 pl-4 py-1">
                                                        <input
                                                            className="w-full p-2 border-2 rounded-lg"
                                                            type="text"
                                                            name="username"
                                                            value={userData?.username || ''}
                                                            onChange={handleInputChange}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="pr-4">
                                                        <label htmlFor="name" className="block text-left">Nama Lengkap</label>
                                                    </td>
                                                    <td className="pl-4 py-1">
                                                        <input
                                                            className="w-full p-2 border-2 rounded-lg"
                                                            type="text"
                                                            name="name"
                                                            value={userData?.name || ''}
                                                            onChange={handleInputChange}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="pr-4">
                                                        <label htmlFor="email" className="block text-left">Email</label>
                                                    </td>
                                                    <td className="pl-4 py-1">
                                                        <input
                                                            disabled
                                                            className="w-full p-2 border-2 rounded-lg"
                                                            type="email"
                                                            name="email"
                                                            value={userData?.email || ''}
                                                            onChange={handleInputChange}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="pr-4">
                                                        <label htmlFor="telepon" className="block text-left">Telepon</label>
                                                    </td>
                                                    <td className="pl-4 py-1">
                                                        <input
                                                            className="w-full p-2 border-2 rounded-lg"
                                                            type="text"
                                                            name="telepon"
                                                            value={userData?.telepon || ''}
                                                            onChange={handleInputChange}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="pr-4">
                                                        <label htmlFor="jenis_kelamin" className="block text-left">Jenis Kelamin</label>
                                                    </td>
                                                    <td className="pl-4 py-1 flex gap-8">
                                                        <div className="flex items-center gap-1">
                                                            <input
                                                                className="accent-primary"
                                                                name="jenis_kelamin"
                                                                type="radio"
                                                                value="Laki-laki"
                                                                checked={userData?.jenis_kelamin === 'Laki-laki'}
                                                                onChange={handleInputChange}
                                                            />
                                                            <label>Laki-laki</label>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <input
                                                                className="accent-primary"
                                                                name="jenis_kelamin"
                                                                type="radio"
                                                                value="Perempuan"
                                                                checked={userData?.jenis_kelamin === 'Perempuan'}
                                                                onChange={handleInputChange}
                                                            />
                                                            <label>Perempuan</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="pr-4" />
                                                    <td className="pl-4 pt-8">
                                                        <button
                                                            type="submit"
                                                            className="bg-primary hover:bg-[#237F20] text-white px-4 py-2 rounded-md"
                                                        >
                                                            Simpan
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </form>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
