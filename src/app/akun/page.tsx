import NavbarUser from '@/components/NavbarUser'
import Sidebar from '@/components/Sidebar'
import React from 'react'

export default function Akun() {

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
                                                        defaultValue="tgrsnts"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="pr-4">
                                                    <label htmlFor="" className="block text-left">
                                                        Nama
                                                    </label>
                                                </td>
                                                <td className="pl-4 py-1">
                                                    <input
                                                        className="w-full p-2 border-2 rounded-lg"
                                                        type="text"
                                                        defaultValue="Mochamad Tegar Santoso"
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
                                                        defaultValue="tegarsantoso72@gmail.com"
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
                                                        defaultValue={"089670522489"}
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
                                                            defaultValue="Laki-laki"                                                    
                                                        />
                                                        <label htmlFor="">Laki-laki</label>
                                                    </div>
                                                    <div className="flex items-center  gap-1">
                                                        <input
                                                            className="accent-primary"
                                                            name="jenis_kelamin"
                                                            type="radio"
                                                            defaultValue="Perempuan"
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
