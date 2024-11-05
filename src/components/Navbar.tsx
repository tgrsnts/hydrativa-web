import React from "react";
import { IoIosSearch } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";


export default function Navbar() {
  return (
    <header className="font-poppins shadow fixed top-0 w-full z-10 h-20 bg-primary">
      <div className="bg-primary flex items-center h-full flex-wrap gap-5 overflow-hidden px-4 py-4 md:px-36 md:mx-auto md:flex-wrap md:items-center">
        <Link href="/">
          <img className="h-8" src="/image/logo-hydrativa-putih.png" alt="" />
        </Link>
        <div className="hidden lg:flex items-center ml-auto gap-3 h-full">
          <div className="flex">
            {/* <button type="button" onclick="my_modal_1.showModal()"
                  class="focus:outline-none text-white hover:bg-gray-200 font-medium rounded-md text-sm w-12 aspect-square">
                  <i class="text-gray-600 fa-solid fa-bell fa-lg"></i>
              </button> */}
            <Link
              href="/keranjang"
              className="flex justify-center items-center focus:outline-none text-white hover:bg-background font-medium rounded-md text-sm w-12 aspect-square"
            >
              <FaShoppingCart className="text-white"/>
              <i className="text-gray-600 fa-solid fa-cart-shopping fa-lg" />
            </Link>
          </div>
          <Link
            href="/akun"
            className="flex items-center gap-2 hover:bg-background py-1 px-2 rounded-md"
          >
            <img className="w-10 rounded-full" src="/image/avatar-biru.jpg" alt="" />
            <p className="font-semibold text-nowrap text-white">Mochamad Tegar Santoso</p>
          </Link>
        </div>
      </div>
    </header>
  );
}
