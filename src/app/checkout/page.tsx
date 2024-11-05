"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Keranjang } from "@/lib/interfaces/Keranjang";
import { FaLocationDot } from "react-icons/fa6";

export default function Keranjang() {
  const [data, setData] = useState<Keranjang[] | null>([]); // Deklarasikan state products

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/keranjang`, {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log("API Response:", response.data); // Log to check response structure
        setData(response.data.data); // Assuming data is nested within response.data
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setData(null); // Set to null on error
      }
    };


    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <dialog id="modalGantiAlamat" className="modal">
        <div className="flex flex-col gap-4 modal-box w-11/12 max-w-3xl font-poppins">
          <h3 className="font-bold text-lg text-center">Daftar Alamat</h3>
          <a
            href="alamat.html"
            className="w-full p-2 border-2 border-primary text-primary text-center rounded-lg hover:bg-primary hover:text-white"
          >
            Tambah Alamat
          </a>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between p-4 border-2 border-primary bg-green-50 rounded-lg">
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
                <div>
                  <a href="alamat.html" className="text-primary">
                    Ubah
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
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
                <div>Jl Sancang, Kel Babakan, Kec Babakan, Kota Bogor, 12345</div>
                <div>
                  <a href="alamat.html" className="text-primary">
                    Ubah
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-2 justify-center items-end">
                <button className="p-2 border-2 border-primary rounded-lg text-primary hover:bg-primary hover:text-white">
                  Pilih
                </button>
              </div>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <main>
        {/* Menu */}
        <section id="detail" className="py-16 lg:px-36 bg-background mt-16 mx-auto">
          <div className="flex flex-wrap gap justify-center">
            <div className="flex flex-col gap-4 w-full lg:w-2/3 p-2">
              <div className="flex flex-col gap-4 bg-white p-6 rounded-lg font-poppins">
                <div className="text-slate-700 font-semibold">ALAMAT PENGIRIMAN</div>
                <div className="flex items-center gap-2">
                  <FaLocationDot/>
                  <i className="fa-solid fa-location-dot text-primary" />
                  <div>Rumah • Tegar Santoso</div>
                </div>
                <div>
                  Jl. Mawar Indah No. 123, Kel. Melati, Kec. Cempaka, Jakarta, 12345,
                  6281234567890
                </div>
                <div>
                  <button
                    onClick={() => {
                      const modal = document.getElementById('modalGantiAlamat') as HTMLDialogElement | null;
                      if (modal) {
                        modal.showModal();
                      }
                    }}
                    className="px-2 border-2 rounded-lg hover:cursor-pointer hover:border-primary hover:text-primary"
                  >
                    Ganti Alamat
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-4 bg-white p-6 rounded-lg font-poppins">
                <div className="text-slate-700 font-semibold">PESANAN</div>
                <div className="flex gap-4">
                  <img
                    className="w-20 rounded-md"
                    src="/storage/produk/teh stevia.jpeg"
                    alt=""
                  />
                  <div className="flex flex-col w-full">
                    <div>Teh Stevia</div>
                    <div className="flex justify-between">
                      <div>x1</div>
                      <div>Rp. 4.000</div>
                    </div>
                  </div>
                </div>
              </div>              
            </div>
            <div className="w-full lg:w-1/3 p-2">
              <div className="flex flex-col p-6 bg-white gap-2 rounded-lg font-poppins">
                <div className="flex flex-col gap-4">
                  <div className="text-2xl font-bold">Ringkasan Belanja</div>
                  <div className="text-md font-medium">
                    <div className="flex justify-between">
                      <div>Total Harga (2 Barang)</div>
                      <div>Rp 8.000</div>
                    </div>
                    <div className="flex justify-between">
                      <div>Total Ongkos Kirim</div>
                      <div>Rp 12.000</div>
                    </div>
                    <div className="divider" />
                    <div className="flex justify-between">
                      <div>Total Belanja</div>
                      <div>Rp 20.000</div>
                    </div>
                  </div>
                  <button                  
                    className="bg-primary font-poppins font-semibold rounded-lg px-4 py-2 border-2 border-primary text-white text-center w-full hover:bg-white hover:text-primary"
                  >
                    Pilih Pembayaran
                  </button>
                </div>
              </div>
            </div>
          </div>

        </section>
        <Footer />
      </main>
      <div className="pt-2 lg:hidden">
        <div className="drop-shadow-2xl fixed bottom-0 lg:static w-full bg-white lg:bg-transparent p-2 flex flex-row lg:flex-col gap-2 items-center justify-center">
          {/* <button href="" onclick="my_modal.showModal()"
      class="bg-primary focus:ring-primary font-poppins font-semibold rounded-lg px-4 py-2 border-2 border-primary focus:ring-primary text-white text-center w-full hover:bg-secondary">
      <i class="fa-solid fa-cart-shopping"></i>
  </button>
  <button href="" onclick="my_modal.showModal()"
      class="bg-white font-poppins font-semibold rounded-lg px-4 py-2 border-2 border-primary focus:ring-primary text-primary focus:ring-primary text-center w-full hover:bg-primary focus:ring-primary hover:text-white hover:border-white">
      Beli
  </button> */}
          <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
            <button
              data-tooltip-target="tooltip-home"
              type="button"
              className="inline-flex flex-col items-center justify-center px-5 rounded-s-md hover:bg-gray-100 dark:hover:bg-gray-800 group"
            >
              {/* <svg class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
              aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path
                  d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
          </svg> */}
              <i className="fa-solid fa-home text-gray-500 dark:text-gray-400 group-hover:text-primary focus:ring-primary dark:group-hover:text-primary focus:ring-primary" />
              <span className="sr-only">Home</span>
            </button>
            <div
              id="tooltip-home"
              role="tooltip"
              className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
            >
              Home
              <div className="tooltip-arrow" data-popper-arrow="" />
            </div>
            <button
              data-tooltip-target="tooltip-wallet"
              type="button"
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 dark:hover:bg-gray-800 group"
            >
              <svg
                className="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary focus:ring-primary dark:group-hover:text-primary focus:ring-primary"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M11.074 4 8.442.408A.95.95 0 0 0 7.014.254L2.926 4h8.148ZM9 13v-1a4 4 0 0 1 4-4h6V6a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h17a1 1 0 0 0 1-1v-2h-6a4 4 0 0 1-4-4Z" />
                <path d="M19 10h-6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1Zm-4.5 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM12.62 4h2.78L12.539.41a1.086 1.086 0 1 0-1.7 1.352L12.62 4Z" />
              </svg>
              <span className="sr-only">Wallet</span>
            </button>
            <div
              id="tooltip-wallet"
              role="tooltip"
              className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
            >
              Wallet
              <div className="tooltip-arrow" data-popper-arrow="" />
            </div>
            <div className="flex items-center justify-center">
              <button
                data-tooltip-target="tooltip-new"
                type="button"
                className="inline-flex items-center justify-center w-10 h-10 font-medium bg-primary focus:ring-primary rounded-full group focus:ring-4 focus:bg-secondary focus:ring-secondary focus:outline-none dark:focus:ring-secondary"
              >
                <i className="text-white fa-solid fa-cart-shopping" />
                <span className="sr-only">New item</span>
              </button>
            </div>
            <div
              id="tooltip-new"
              role="tooltip"
              className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
            >
              Create new item
              <div className="tooltip-arrow" data-popper-arrow="" />
            </div>
            <button
              data-tooltip-target="tooltip-settings"
              type="button"
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
            >
              <svg
                className="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary focus:ring-primary dark:group-hover:text-primary focus:ring-primary"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2"
                />
              </svg>
              <span className="sr-only">Settings</span>
            </button>
            <div
              id="tooltip-settings"
              role="tooltip"
              className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
            >
              Settings
              <div className="tooltip-arrow" data-popper-arrow="" />
            </div>
            <button
              data-tooltip-target="tooltip-profile"
              type="button"
              className="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-gray-50 dark:hover:bg-gray-800 group"
            >
              <svg
                className="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary focus:ring-primary dark:group-hover:text-primary focus:ring-primary"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
              </svg>
              <span className="sr-only">Profile</span>
            </button>
            <div
              id="tooltip-profile"
              role="tooltip"
              className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
            >
              Profile
              <div className="tooltip-arrow" data-popper-arrow="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
