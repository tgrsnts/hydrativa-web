'use client'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import React from 'react'

export default function Akun() {

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
                        className="min-h-screen font-poppins w-full flex gap-2 flex-col mt-2 pt-10 px-4 pb-20 bg-background"
                    >
                        <div className="flex gap-2 rounded-lg bg-white w-full py-4">
                            <div className="px-4 py-2">Status</div>
                            <div className="px-4 py-2 text-[#047D00] rounded-lg border-2 border-[#047D00] bg-green-50 hover:bg-green-50 hover:text-[#047D00] hover:border-[#047D00]">
                                Semua
                            </div>
                            <div className="px-4 py-2 rounded-lg border-2 border-gray-300 hover:bg-green-50 hover:text-[#047D00] hover:border-[#047D00]">
                                Belum Bayar
                            </div>
                            <div className="px-4 py-2 rounded-lg border-2 border-gray-300 hover:bg-green-50 hover:text-[#047D00] hover:border-[#047D00]">
                                Sedang Dikemas
                            </div>
                            <div className="px-4 py-2 rounded-lg border-2 border-gray-300 hover:bg-green-50 hover:text-[#047D00] hover:border-[#047D00]">
                                Dikirim
                            </div>
                            <div className="px-4 py-2 rounded-lg border-2 border-gray-300 hover:bg-green-50 hover:text-[#047D00] hover:border-[#047D00]">
                                Selesai
                            </div>
                            <div className="px-4 py-2 rounded-lg border-2 border-gray-300 hover:bg-green-50 hover:text-[#047D00] hover:border-[#047D00]">
                                Dibatalkan
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-4 flex-col bg-white w-full p-4 rounded-lg">
                                <div className="flex w-full gap-5">
                                    <img className="w-20" src="image/product/Artboard 25.png" alt="" />
                                    <div className="flex flex-col gap- w-full">
                                        <div>Jagung</div>
                                        <div className="flex justify-between">
                                            <div>x1</div>
                                            <div>Rp. 4.000</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex w-full gap-5">
                                    <img className="w-20" src="image/product/Artboard 32.png" alt="" />
                                    <div className="flex flex-col gap- w-full">
                                        <div>Brokoli</div>
                                        <div className="flex justify-between">
                                            <div>x1</div>
                                            <div>Rp. 4.000</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2">
                                        <i className="fa-solid fa-truck" />
                                        <div>Pesanan telah sampai</div>
                                    </div>
                                    <div className="flex justify-end gap-4">
                                        <div>Total Pesanan:</div>
                                        <div className="text-primary">Rp. 8.000</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 flex-col bg-white w-full p-4 rounded-lg">
                                <div className="flex w-full gap-5">
                                    <img className="w-20" src="image/product/Artboard 25.png" alt="" />
                                    <div className="flex flex-col gap- w-full">
                                        <div>Jagung</div>
                                        <div className="flex justify-between">
                                            <div>x1</div>
                                            <div>Rp. 4.000</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex w-full gap-5">
                                    <img className="w-20" src="image/product/Artboard 32.png" alt="" />
                                    <div className="flex flex-col gap- w-full">
                                        <div>Brokoli</div>
                                        <div className="flex justify-between">
                                            <div>x1</div>
                                            <div>Rp. 4.000</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2">
                                        <i className="fa-solid fa-truck" />
                                        <div>Pesanan telah sampai</div>
                                    </div>
                                    <div className="flex justify-end gap-4">
                                        <div>Total Pesanan:</div>
                                        <div className="text-primary">Rp. 8.000</div>
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
