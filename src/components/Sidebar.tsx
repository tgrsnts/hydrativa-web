'use client'
import { usePathname } from 'next/navigation'
import React from 'react'
export default function Sidebar() {
    const pathname = usePathname()

    return (
        <nav className="flex flex-col gap-1 pr-12 font-sans text-base font-normal text-blue-gray-700">
            <a href="/" className="flex items-center whitespace-nowrap text-2xl">
                <img
                    className="ml-8 w-32 lg:w-24"
                    src="image/logo-hydrativa-putih.png"
                    alt=""
                />
            </a>
            <a
                href="/akun"
                className={`mt-8 ${pathname=='/akun' ? 'text-primary bg-white' : 'text-white'} font-poppins font-semibold flex items-center w-full py-4 pl-16 leading-tight transition-all rounded-r-lg outline-none text-start hover:bg-white hover:text-primary focus:bg-white focus:text-primary active:bg-white active:text-primary`}
            >
                <div className="grid mr-4 place-items-center">
                    <i className="fa-solid fa-user" />
                </div>
                Profil
            </a>
            <a
                href="/alamat"
                className={`${pathname=='/alamat' ? 'text-primary bg-white' : 'text-white'} font-poppins font-semibold flex items-center w-full py-4 pl-16 leading-tight transition-all rounded-r-lg outline-none text-start hover:bg-white hover:text-primary focus:bg-white focus:text-primary active:bg-white active:text-primary`}
            >
                <div className="grid mr-4 place-items-center">
                    <i className="fa-solid fa-location-dot" />
                </div>
                Alamat
            </a>
            <a
                href="/pembelian"
                className={`${pathname=='/pembelian' ? 'text-primary bg-white' : 'text-white'} font-poppins font-semibold flex items-center w-full py-4 pl-16 leading-tight transition-all rounded-r-lg outline-none text-start hover:bg-white hover:text-primary focus:bg-white focus:text-primary active:bg-white active:text-primary`}
            >
                <div className="grid mr-4 place-items-center">
                    <i className="fa-solid fa-bag-shopping" />
                </div>
                Pembelian
            </a>
            <a
                href='/'
                className="text-white font-poppins font-semibold flex items-center w-full py-4 pl-16 leading-tight transition-all rounded-r-lg outline-none text-start hover:bg-white hover:text-primary focus:bg-white focus:text-primary active:bg-white active:text-primary"
            >
                <div className="grid mr-4 place-items-center">
                    <i className="fa-solid fa-right-from-bracket" />
                </div>
                Log Out
            </a>
        </nav>
    )
}
