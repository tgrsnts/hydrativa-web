import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";


export default function Navbar() {
  return (
    <header className="shadow fixed top-0 w-full z-10 h-20 bg-primary">
        <div className="bg-primary relative flex justify-between lg:justify-start flex-col lg:flex-row lg:h-20 overflow-hidden px-4 py-4 md:px-36 md:mx-auto md:flex-wrap md:items-center">
          <Link href="/" className="flex items-center whitespace-nowrap text-2xl">
            <img className="h-8" src="/image/logo-hydrativa-putih.png" alt="Logo" />
          </Link>
          {/* Hamburger Menu for Mobile */}
          <input type="checkbox" className="peer hidden" id="navbar-open" />
          <label className="absolute top-7 right-8 cursor-pointer md:hidden" htmlFor="navbar-open">
            <span className="sr-only">Toggle Navigation</span>
            <i className="fa-solid fa-bars h-6 w-6 text-white" />
          </label>
          {/* Navigation Menu */}
          <nav aria-label="Header Navigation" className="peer-checked:max-h-60 max-h-0 w-full lg:w-auto flex-col flex lg:flex-row lg:max-h-full overflow-hidden transition-all duration-300 lg:items-center lg:ml-auto">
            <ul className="flex flex-col lg:flex-row lg:space-y-0 space-y-4 items-center lg:ml-auto font-poppins font-semibold">
              <li className="text-white border-b-2 border-primary md:mr-12 hover:border-white">
                <Link href="#hero">Home</Link>
              </li>
              <li className="text-white border-b-2 border-primary md:mr-12 hover:border-white">
                <Link href="#our-products">Produk</Link>
              </li>
              <li className="text-white border-b-2 border-primary md:mr-12 hover:border-white">
                <Link href="/keranjang">
                  <FaShoppingCart className="text-white" />
                </Link>
              </li>
              <button
                className="text-white border-2 md:mr-12 px-4 py-2 rounded-md border-white cursor-pointer hover:bg-primary hover:border-primary"
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
                className="text-primary border-2 md:mr-12 px-4 py-2 rounded-md bg-white cursor-pointer hover:text-white hover:bg-primary hover:border-white"
                onClick={() => {
                  const modal = document.getElementById('modal_register') as HTMLDialogElement | null;
                  if (modal) {
                    modal.showModal();
                  }
                }}
              >
                Daftar
              </button>
            </ul>
          </nav>
        </div>
      </header>
  );
}
