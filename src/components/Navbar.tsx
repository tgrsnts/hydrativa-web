import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";
import Cookies from "js-cookie";

export default function Navbar() {
  const isLoggedIn = Cookies.get('token') !== undefined;

  return (
    <header className="shadow fixed top-0 w-full z-10 h-20 bg-primary">
      <div className="bg-primary flex items-center h-full flex-wrap gap-5 overflow-hidden px-4 py-4 md:px-36 md:mx-auto">
        <Link href="/" className="flex items-center whitespace-nowrap text-2xl">
          <img className="h-8" src="/image/logo-hydrativa-putih.png" alt="Logo" />
        </Link>

        {isLoggedIn ? (
          <div className="hidden lg:flex items-center ml-auto gap-3 h-full">
            <Link
              href="/keranjang"
              className="flex justify-center items-center focus:outline-none text-white hover:bg-background font-medium rounded-md text-sm w-12 aspect-square"
            >
              <FaShoppingCart className="text-white"/>
            </Link>
            <Link
              href="/akun"
              className="flex items-center gap-2 hover:bg-background py-1 px-2 rounded-md"
            >
              <img className="w-10 rounded-full" src="/image/avatar-biru.jpg" alt="User Avatar" />
              <p className="font-semibold text-nowrap text-white">Mochamad Tegar Santoso</p>
            </Link>
          </div>
        ) : (
          <div className="ml-auto flex space-x-2">
            <button
              className="text-white border-2 px-4 py-2 rounded-md border-white cursor-pointer hover:bg-primary hover:border-primary"
              onClick={() => {
                const modal = document.getElementById('modal_login') as HTMLDialogElement | null;
                if (modal) {
                  modal.showModal();
                }
              }}
            >
              Masuk
            </button>
            <button
              className="text-primary border-2 px-4 py-2 rounded-md bg-white cursor-pointer hover:text-white hover:bg-primary hover:border-white"
              onClick={() => {
                const modal = document.getElementById('modal_register') as HTMLDialogElement | null;
                if (modal) {
                  modal.showModal();
                }
              }}
            >
              Daftar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
