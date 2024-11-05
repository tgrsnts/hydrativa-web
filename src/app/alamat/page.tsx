'use client'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import React from 'react'

export default function Akun() {

    return (
        <>
        <Navbar/>
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
                                <div className="flex justify-between p-4 border-2 rounded-lg">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-4">
                                            <div>Rumah</div>
                                            <div className="p-1 border-2 text-sm text-primary border-primary">
                                                Utama
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div>Tegar Santoso</div>
                                            <div className="divider divider-horizontal before:bg-black after:bg-black" />
                                            <div>081234567890</div>
                                        </div>
                                        <div>
                                            Jl. Mawar Indah No. 123, Kel. Melati, Kec. Cempaka, Jakarta, 12345
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        <a href="" className="text-primary">
                                            Ubah
                                        </a>
                                        {/* <button class="p-2 border-2 rounded-lg">Atur sebagai Utama</button> */}
                                    </div>
                                </div>
                                <div className="flex justify-between p-4 border-2 rounded-lg">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-4">
                                            <div>Kantor</div>
                                            {/* <div class="p-1 border-2 text-sm">Utama</div> */}
                                        </div>
                                        <div className="flex">
                                            <div>Tegar Santoso</div>
                                            <div className="divider divider-horizontal before:bg-black after:bg-black" />
                                            <div>081234567890</div>
                                        </div>
                                        <div>
                                            Jl. Mawar Indah No. 123, Kel. Melati, Kec. Cempaka, Jakarta, 12345
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        <a href="" className="text-primary">
                                            Ubah
                                        </a>
                                        <button className="p-2 border-2 rounded-lg bg-primary text-white">
                                            Atur sebagai Utama
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

        
            

        </>
    )
}
