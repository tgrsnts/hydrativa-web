"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Produk } from "@/lib/interfaces/Produk";

export default function Dashboard() {
  const [products, setProducts] = useState<Produk[]>([]); // Deklarasikan state products

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/produk'); // Ganti dengan URL API kamu
      const result = await response.json();
      setProducts(result.data); // Ambil data dari response dan set ke state
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        {/* Menu */}
        <section id="menu" className="mt-4 px-4 lg:px-36 py-20 bg-gray-100">
          <div className="container mx-auto text-center">
            {/* <div class="w-full carousel rounded-box">
              <div class="carousel-item w-full">
                  <a href="detail_jumat_berkah.html">
                      <img src="image/dashboard-slider.png" class="w-full"
                          alt="Tailwind CSS Carousel component" />
                  </a>
              </div>
              <div class="carousel-item w-full">
                  <img src="image/dashboard-slider.png" class="w-full" alt="Tailwind CSS Carousel component" />
              </div>
              <div class="carousel-item w-full">
                  <img src="image/dashboard-slider.png" class="w-full" alt="Tailwind CSS Carousel component" />
              </div>
              <div class="carousel-item w-full">
                  <img src="image/dashboard-slider.png" class="w-full" alt="Tailwind CSS Carousel component" />
              </div>
              <div class="carousel-item w-full">
                  <img src="image/dashboard-slider.png" class="w-full" alt="Tailwind CSS Carousel component" />
              </div>
              <div class="carousel-item w-full">
                  <img src="image/dashboard-slider.png" class="w-full" alt="Tailwind CSS Carousel component" />
              </div>
              <div class="carousel-item w-full">
                  <img src="image/dashboard-slider.png" class="w-full" alt="Tailwind CSS Carousel component" />
              </div>
          </div> */}
            {/* Accordion Horizontal */}
            {/* <div class="flex justify-center font-poppins mb-4">
              <div class="w-32 h-16  mx-2 flex items-center justify-center cursor-pointer">
                  <button
                      class="w-full py-2 border-b-4 border-primary focus:ring-primary hover:text-primary focus:ring-primary focus:border-primary focus:ring-primary focus:text-primary focus:ring-primary focus:border-primary focus:ring-primary text-primary focus:ring-primary">
                      All</button>
              </div>
              <div class="w-32 h-16  mx-2 flex items-center justify-center cursor-pointer">
                  <button
                      class="w-full py-2 border-b-4 border-gray-100  hover:text-primary focus:ring-primary focus:border-primary focus:ring-primary focus:text-primary focus:ring-primary focus:border-primary focus:ring-primary ">
                      Makanan
                  </button>
              </div>
              <div class="w-32 h-16  mx-2 flex items-center justify-center cursor-pointer">
                  <button
                      class="w-full py-2 border-b-4 border-gray-100  hover:text-primary focus:ring-primary focus:border-primary focus:ring-primary focus:text-primary focus:ring-primary focus:border-primary focus:ring-primary ">
                      Minuman
                  </button>
              </div>
          </div> */}
            {/* Card */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:justify-center">
              {products.length > 0 ? (
                products.map((product) => (
                  <a
                    href="/detail.html" // Ganti dengan path yang sesuai
                    className="flex flex-col w-full lg:w-full bg-white rounded-lg shadow-md transition-transform duration-300 transform hover:bg-gray-100 hover:scale-105"
                    key={product.id} // Pastikan ada key untuk setiap elemen
                  >
                    <img
                      src={`/image/${product.gambar}`} // Path gambar sesuai dengan data produk
                      alt={product.nama} // Menggunakan nama produk sebagai alt
                      className="w-full object-cover mb-2 rounded-t-lg"
                    />
                    <h3 className="text-sm lg:text-lg font-poppins font-semibold">
                      {product.nama} {/* Menggunakan properti yang benar */}
                    </h3>
                    <div className="flex items-center justify-center gap-1">
                      <i className="fa-solid fa-star text-yellow-400" />
                      <div className="font-poppins text-gray-600">4.5</div>
                    </div>
                    <div className="font-poppins text-gray-700 mb-2">Rp {product.harga}</div>
                    <div className="mt-auto">
                      <button className="bg-white ring-2 ring-primary text-primary rounded-md px-4 py-1 font-poppins mb-4 hover:ring-2 hover:ring-primary hover:bg-primary hover:text-white">
                        Beli
                      </button>
                    </div>
                  </a>
                ))
              ) : (
                // <p>Loading products...</p> // Menangani kondisi ketika tidak ada produk
                <>
                  <a
                    href="detail.html"
                    className="flex flex-col w-full lg:w-full bg-white rounded-lg shadow-md transition-transform duration-300 transform hover:bg-gray-100 hover:scale-105"
                  >
                    <img
                      src="image/Group 185.png"
                      alt="Ayam Goreng"
                      className="w-full object-cover mb-2 rounded-t-lg"
                    />
                    <h3 className="text-sm lg:text-lg font-poppins font-semibold">HydraTiva</h3>
                    <div className="flex items-center justify-center gap-1">
                      <i className="fa-solid fa-star text-yellow-400" />
                      <div className="font-poppins text-gray-600">4.5</div>
                    </div>
                    <div className="font-poppins text-gray-700 mb-2">Rp 1.500.000</div>
                    <div className="mt-auto">
                      {/* <button
                          class="bg-primary rounded-md px-4 py-1 font-poppins text-white mb-4 hover:ring-2 hover:ring-primary hover:bg-white hover:text-primary">Beli</button> */}
                      <button className="bg-white ring-2 ring-primary text-primary rounded-md px-4 py-1 font-poppins mb-4 hover:ring-2 hover:ring-primary hover:bg-primary hover:text-white">
                        Beli
                      </button>
                    </div>
                  </a>
                  <a
                    href="detail.html"
                    className="flex flex-col w-full lg:w-full bg-white rounded-lg shadow-md transition-transform duration-300 transform hover:bg-gray-100 hover:scale-105"
                  >
                    <img
                      src="image/Group 186.png"
                      alt="Es Jeruk"
                      className="w-full object-cover mb-2 rounded-t-lg"
                    />
                    <h3 className="text-sm lg:text-lg font-poppins font-semibold">
                      Daun Stevia Kering
                    </h3>
                    <div className="flex items-center justify-center gap-1">
                      <i className="fa-solid fa-star text-yellow-400" />
                      <div className="font-poppins text-gray-600">4.5</div>
                    </div>
                    <div className="font-poppins text-gray-700 mb-2">Rp 150.000</div>
                    <div className="mt-auto">
                      {/* <button
                          class="bg-primary rounded-md px-4 py-1 font-poppins text-white mb-4 hover:ring-2 hover:ring-primary hover:bg-white hover:text-primary">Beli</button> */}
                      <button className="bg-white ring-2 ring-primary text-primary rounded-md px-4 py-1 font-poppins mb-4 hover:ring-2 hover:ring-primary hover:bg-primary hover:text-white">
                        Beli
                      </button>
                    </div>
                  </a>
                  <a
                    href="detail.html"
                    className="flex flex-col w-full lg:w-full bg-white rounded-lg shadow-md transition-transform duration-300 transform hover:bg-gray-100 hover:scale-105"
                  >
                    <img
                      src="image/teh stevia.jpeg"
                      alt="Nasi"
                      className="w-full object-cover mb-2 rounded-t-lg"
                    />
                    <h3 className="text-sm lg:text-lg font-poppins font-semibold">
                      Teh Stevia
                    </h3>
                    <div className="flex items-center justify-center gap-1">
                      <i className="fa-solid fa-star text-yellow-400" />
                      <div className="font-poppins text-gray-600">4.5</div>
                    </div>
                    <div className="font-poppins text-gray-700 mb-2">Rp 120.000</div>
                    <div className="mt-auto">
                      {/* <button
                          class="bg-primary rounded-md px-4 py-1 font-poppins text-white mb-4 hover:ring-2 hover:ring-primary hover:bg-white hover:text-primary">Beli</button> */}
                      <button className="bg-white ring-2 ring-primary text-primary rounded-md px-4 py-1 font-poppins mb-4 hover:ring-2 hover:ring-primary hover:bg-primary hover:text-white">
                        Beli
                      </button>
                    </div>
                  </a>
                  <a
                    href="detail.html"
                    className="flex flex-col w-full lg:w-full bg-white rounded-lg shadow-md transition-transform duration-300 transform hover:bg-gray-100 hover:scale-105"
                  >
                    <img
                      src="image/liquid stevia.jpeg"
                      alt="Es teh"
                      className="w-full object-cover mb-2 rounded-t-lg"
                    />
                    <h3 className="text-sm lg:text-lg font-poppins font-semibold">
                      Liquid Stevia
                    </h3>
                    <div className="flex items-center justify-center gap-1">
                      <i className="fa-solid fa-star text-yellow-400" />
                      <div className="font-poppins text-gray-600">4.5</div>
                    </div>
                    <div className="font-poppins text-gray-700 mb-2">Rp 96.000</div>
                    <div className="mt-auto">
                      {/* <button
                          class="bg-primary rounded-md px-4 py-1 font-poppins text-white mb-4 hover:ring-2 hover:ring-primary hover:bg-white hover:text-primary">Beli</button> */}
                      <button className="bg-white ring-2 ring-primary text-primary rounded-md px-4 py-1 font-poppins mb-4 hover:ring-2 hover:ring-primary hover:bg-primary hover:text-white">
                        Beli
                      </button>
                    </div>
                  </a>
                </>
              )}
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
