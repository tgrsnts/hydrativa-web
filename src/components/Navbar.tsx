import React from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaShoppingCart, FaStar } from "react-icons/fa";
import axios from "axios";

export default function Navbar() {
  return (
    <header className="shadow fixed top-0 w-full z-10 h-20 bg-primary">
      <div className="font-poppins bg-primary flex items-center h-full flex-wrap gap-5 overflow-hidden px-4 py-4 md:px-36 md:mx-auto">
        <Link href="/" className="flex items-center whitespace-nowrap text-2xl">
          <img className="h-8" src="/image/logo-hydrativa-putih.png" alt="Logo" />
        </Link>

        <div className="hidden lg:flex items-center ml-auto gap-3 h-full">
          <Link
            href="/keranjang"
            className="flex justify-center items-center focus:outline-none text-white hover:bg-background font-medium rounded-md text-sm w-12 aspect-square"
          >
            <FaShoppingCart className="text-white" />
          </Link>
          <Link
            href="/akun"
            className="flex items-center gap-2 hover:bg-background py-1 px-2 rounded-md"
          >
            <img className="w-10 rounded-full" src="/image/avatar-biru.jpg" alt="User Avatar" />
            <p className="font-semibold text-nowrap text-white">Mochamad Tegar Santoso</p>
          </Link>
        </div>
      </div>
    </header>
  );
}
