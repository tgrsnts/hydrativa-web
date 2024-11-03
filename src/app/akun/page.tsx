'use client';

import NavbarUser from '@/components/NavbarUser';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/lib/hooks/auth';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { User } from '@/lib/interfaces/User';

export default function Akun() {
    const [isClient, setIsClient] = useState(false);
    const [userData, setUserData] = useState<User | null>(null);

    const { user, logout } = useAuth(
        { middleware: 'user'}
    );

    const onClickLogout = () => {
        Swal.fire({
            title: "Anda yakin?",
            text: "Anda akan logout!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#6A9944",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
            } else {
                Swal.fire("Cancelled", "Logout cancelled", "error");
            }
        });
    };

    // const getUserInfo = async () => {
    //     var res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
    //         headers: {
    //             'content-type': 'text/json',
    //             'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //         }
    //     })
    //         .then(function (response) {
    //             setUserData(response.data.data);
    //         }).catch(function (error) {
    //             if (error.response && error.response.status === 401) {
    //                 Swal.fire({
    //                     icon: 'error',
    //                     title: error.response.data.message,
    //                     showConfirmButton: false,
    //                     timer: 1500
    //                 })
    //                 logout()
    //             } else {
    //                 Swal.fire({
    //                     icon: 'error',
    //                     title: 'error terjadi',
    //                     text: 'mohon coba lagi nanti.',
    //                     showConfirmButton: false,
    //                     timer: 1500
    //                 });
    //             }
    //         })
    // }

    useEffect(() => {
        setIsClient(true)
        if (!user) return
        // getUserInfo()
        console.log(userData)
    }, [user])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prevUserData) => prevUserData ? { ...prevUserData, [name]: value } : null);
    };

    return (
        <>
            <div className="flex">
                <div className="flex">
                    <div className="flex min-h-screen w-80 flex-col bg-primary py-4 text-gray-700">
                        <Sidebar />
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <NavbarUser />
                    <section
                        id="dashboard"
                        className="min-h-screen font-poppins w-full flex flex-col mt-4 pt-10 px-4 pb-20 bg-gray-100"
                    >
                        <div className="flex flex-col bg-white p-4 w-full rounded-lg">
                            <div className="font-semibold">Akun Saya</div>
                            <div>Kelola informasi profil Anda.</div>
                            <div className="divider" />
                            <form action="" className="flex w-full">
                                <div className="w-1/4 flex flex-col items-center gap-4">
                                    <img className="w-full" src="image/avatar-biru.jpg" alt="" />
                                    <input
                                        type="file"
                                        id="gambar"
                                        placeholder="gambar"
                                        className="w-full rounded-md bg-gray-100 file:mr-5 file:py-1 file:px-3 file:border-none file:w-full file:bg-gray-100 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-green-50 hover:file:text-primary focus:outline-none focus:ring focus:ring-primary focus-border-primary"
                                    />
                                </div>
                                <div className="flex w-3/4 pl-8">
                                    <table className="w-full">
                                        <tbody>
                                            <tr>
                                                <td className="w-1/4 pr-4">
                                                    <label htmlFor="" className="block text-left">
                                                        Username
                                                    </label>
                                                </td>
                                                <td className="w-3/4 pl-4 py-1">
                                                    <input
                                                        className="w-full p-2 border-2 rounded-lg"
                                                        type="text"
                                                        value={user?.username || ''}
                                                        onChange={handleInputChange}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="pr-4">
                                                    <label htmlFor="" className="block text-left">
                                                        Nama Depan
                                                    </label>
                                                </td>
                                                <td className="pl-4 py-1">
                                                    <input
                                                        className="w-full p-2 border-2 rounded-lg"
                                                        type="text"
                                                        value={user?.firstname || ''}
                                                        onChange={handleInputChange}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="pr-4">
                                                    <label htmlFor="" className="block text-left">
                                                        Nama Belakang
                                                    </label>
                                                </td>
                                                <td className="pl-4 py-1">
                                                    <input
                                                        className="w-full p-2 border-2 rounded-lg"
                                                        type="text"
                                                        value={user?.lastname || ''}
                                                        onChange={handleInputChange}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="pr-4">
                                                    <label htmlFor="" className="block text-left">
                                                        Email
                                                    </label>
                                                </td>
                                                <td className="pl-4 py-1">
                                                    <input
                                                        className="w-full p-2 border-2 rounded-lg"
                                                        type="email"
                                                        value={user?.email || ''}
                                                        onChange={handleInputChange}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="pr-4">
                                                    <label htmlFor="" className="block text-left">
                                                        Telepon
                                                    </label>
                                                </td>
                                                <td className="pl-4 py-1">
                                                    <input
                                                        className="w-full p-2 border-2 rounded-lg"
                                                        type="text"
                                                        value={user?.telepon || ''}
                                                        onChange={handleInputChange}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="pr-4">
                                                    <label htmlFor="" className="block text-left">
                                                        Jenis Kelamin
                                                    </label>
                                                </td>
                                                <td className="pl-4 py-1 flex gap-8">
                                                    <div className="flex items-center gap-1">
                                                        <input
                                                            className="accent-primary"
                                                            name="jenis_kelamin"
                                                            type="radio"
                                                            checked={user?.jenis_kelamin === "Laki-laki"}
                                                            onChange={handleInputChange}
                                                        />
                                                        <label htmlFor="">Laki-laki</label>
                                                    </div>
                                                    <div className="flex items-center  gap-1">
                                                        <input
                                                            className="accent-primary"
                                                            name="jenis_kelamin"
                                                            type="radio"
                                                            checked={user?.jenis_kelamin === "Perempuan"}
                                                            onChange={handleInputChange}
                                                        />
                                                        <label htmlFor="">Perempuan</label>
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
                        </div>
                    </section>
                </div>
            </div>

        </>
    )
}
