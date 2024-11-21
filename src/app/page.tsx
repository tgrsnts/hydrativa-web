"use client";

import { useState, useEffect } from "react";
// import { FcGoogle } from "react-icons/fc";
import { FaStar } from "react-icons/fa";
import Footer from "@/components/Footer";
import { Produk } from "@/lib/interfaces/Produk";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import axios from "axios";
import Swal from "sweetalert2";
import { Materi } from "@/lib/interfaces/Materi";


export default function Home() {
  const [products, setProducts] = useState<Produk[]>([]);
  const [materis, setMateris] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(true);

  const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response) {
      Swal.fire({
        icon: 'error',
        title: error.response.data.message || 'Error',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Terjadi kesalahan',
        text: 'Mohon coba lagi nanti.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produk`);
        const result = await response.json();
        setProducts((result.data || []).slice(0, 4));
      } catch (error) {
        handleAxiosError(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBerita = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materi`);
        const result = await response.json();
        setMateris((result || []).slice(0, 4));
      } catch (error) {
        handleAxiosError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchBerita();
  }, []);

  return (
    <>
      {/* <!-- Navbar --> */}
      <Navbar />

      <main>
        {/* Hero */}
        {/* <section id="hero">
          <div
            className="bg-cover bg-center h-screen relative"
            style={{ backgroundImage: 'url("/image/foto-kebun.jpg")' }}
          >
            <div className="absolute inset-0 bg-black opacity-50" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
              <h1 className="text-white px-4 text-2xl lg:text-5xl font-poppins font-bold mb-2">
                HydraTiva
              </h1>
            </div>
          </div>
        </section> */}

        <section id="carousel" className="">
          <div className="carousel w-full">
            <div id="slide1" className="carousel-item relative w-full">
              <img
                src="/image/iklan-stevia.png"
                className="w-full" />
              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide4" className="btn btn-circle">❮</a>
                <a href="#slide2" className="btn btn-circle">❯</a>
              </div>
            </div>
            <div id="slide2" className="carousel-item relative w-full">
              <img
                src="/image/iklan-buku.png"
                className="w-full" />
              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide1" className="btn btn-circle">❮</a>
                <a href="#slide3" className="btn btn-circle">❯</a>
              </div>
            </div>
            <div id="slide3" className="carousel-item relative w-full">
              <img
                src="/image/iklan-aplikasi.png"
                className="w-full" />
              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide2" className="btn btn-circle">❮</a>
                <a href="#slide4" className="btn btn-circle">❯</a>
              </div>
            </div>            
          </div>
        </section>

        {/* <section id="news">
          <div
            className="bg-cover bg-center h-screen relative"
            style={{ backgroundImage: 'url("/image/background-buku.png")' }}
          >
            
            <img
              src="/image/buku.png"
              className="absolute left-1/4 lg:left-40 top-1/2 transform -translate-y-1/2"
              alt="Buku"
            />

            
            <img
              src="/image/logo-buku.png"
              className="absolute right-0 top-12 p-4"
              alt="Logo"
            />

            
            <div className="absolute flex flex-col items-center gap-4 text-4xl lg:text-6xl font-semibold right-1/4 lg:right-40 top-1/2 transform -translate-y-1/2">
              <p className="text-white">CARA PEMAKAIAN</p>
              <p className="bg-primary text-white w-fit px-6 py-4">ALAT HYDRATIVA</p>
            </div>
          </div>
        </section> */}


        {/* Know About Us */}
        <section id="news" className="px-4 lg:px-40 py-20 bg-gray-100">
          <div className="container mx-auto text-center">
            <h2 className="text-xl lg:text-5xl text-center font-poppins font-bold mb-8 text-primary">
              Berita
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
              {loading ? (
                // Show skeleton loader when loading is true
                Array(2).fill(0).map((_, index) => (
                  <div
                    // Adjusted path as needed
                    className="hover:cursor-pointer flex flex-col w-full lg:w-full bg-white rounded-lg shadow-md transition-transform duration-300 transform hover:bg-gray-100 hover:scale-105"
                    key={`skeleton-${index}`} // Unique key for each skeleton
                  >

                    <div className="skeleton h-72 mb-2 w-full rounded-t-lg rounded-b-none"></div>
                    <div className="h-20 flex flex-col items-start p-4 pt-0 gap-2">
                      <div className="skeleton h-4 w-28"></div>
                      <div className="skeleton h-4 w-20"></div>
                      <div className="skeleton h-4 w-16"></div>
                    </div>

                  </div>
                ))
              ) : (
                // Once loading is false, render the actual products
                Array.isArray(materis) && materis.map((materi) => (
                  <Link
                    href={`/berita/${materi.id}`} // Adjusted path with dynamic product ID
                    className="flex flex-col w-full lg:w-full bg-white rounded-lg shadow-md transition-transform duration-300 transform hover:bg-gray-100 hover:scale-105"
                    key={materi.id} // Ensure unique keys
                  >
                    <img
                      src={materi.gambar} // Path gambar sesuai dengan data produk
                      alt={materi.judul} // Menggunakan nama produk sebagai alt
                      className="h-72 object-cover mb-2 rounded-t-lg"
                    />
                    <div className="h-20 flex flex-col items-start p-4 pt-0 gap-2">
                      <div className="h-4">
                        <p className="text-sm lg:text-lg font-poppins font-semibold">
                          {materi.judul} {/* Menggunakan properti yang benar */}
                        </p>
                      </div>
                      <div className="h-4">
                        <div className="font-poppins text-gray-700 text-sm">Sumber: {materi.sumber}</div>
                      </div>
                      <div className="h-4">
                        <div className="font-poppins text-gray-600 text-sm">{materi.waktu}</div>
                      </div>
                    </div>
                  </Link>
                ))
              )}

            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Link
              href="/berita"
              className="font-poppins text-white px-4 py-2 rounded-md bg-primary border-2 border-white cursor-pointer hover:text-primary hover:bg-white hover:border-primary"
            >
              Lihat Selengkapnya
            </Link>
          </div>
        </section>


        {/* Our Products */}
        <section id="our-products" className="px-4 lg:px-36 py-20 bg-primary">
          <div className="container mx-auto text-center">
            <h2 className="text-xl lg:text-5xl text-center font-poppins font-bold mb-8 text-white">
              Produk Kami
            </h2>
            {/* Accordion Horizontal

      <div class="flex justify-center">
          <div class="w-32 h-16  mx-2 flex items-center justify-center">
              <p class="text-red-500 border-b border-b-4 w-full py-2 border-red-500 cursor-pointer">All</p>
          </div>
          <div class="w-32 h-16  mx-2 flex items-center justify-center cursor-pointer">
              <p class="border-b border-b-4 w-full py-2">Buah Tropis</p>
          </div>
          <div class="w-32 h-16  mx-2 flex items-center justify-center cursor-pointer">
              <p class="border-b border-b-4 w-full py-2">Buah Sub-Tropis</p>
          </div>
      </div> */}
            {/* Card */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {loading ? (
                // Show skeleton loader when loading is true
                Array(4).fill(0).map((_, index) => (
                  <div
                    // Adjusted path as needed
                    className="hover:cursor-pointer flex flex-col w-full lg:w-full bg-white rounded-lg shadow-md transition-transform duration-300 transform hover:bg-gray-100 hover:scale-105"
                    key={`skeleton-${index}`} // Unique key for each skeleton
                  >

                    <div className="skeleton h-72 mb-2 w-full rounded-t-lg rounded-b-none"></div>
                    <div className="h-20 flex flex-col items-start p-4 pt-0 gap-2">
                      <div className="skeleton h-4 w-28"></div>
                      <div className="skeleton h-4 w-20"></div>
                      <div className="skeleton h-4 w-16"></div>
                    </div>

                  </div>
                ))
              ) : (
                // Once loading is false, render the actual products
                Array.isArray(products) && products.map((product) => (
                  <Link
                    href={`/detail/${product.id}`} // Adjusted path with dynamic product ID
                    className="flex flex-col w-full lg:w-full bg-white rounded-lg shadow-md transition-transform duration-300 transform hover:bg-gray-100 hover:scale-105"
                    key={product.id} // Ensure unique keys
                  >
                    <img
                      src={product.gambar} // Path gambar sesuai dengan data produk
                      alt={product.nama_produk} // Menggunakan nama produk sebagai alt
                      className="h-72 object-cover mb-2 rounded-t-lg"
                    />
                    <div className="h-20 flex flex-col items-start p-4 pt-0 gap-2">
                      <div className="h-4">
                        <p className="text-sm lg:text-lg font-poppins font-semibold">
                          {product.nama_produk} {/* Menggunakan properti yang benar */}
                        </p>
                      </div>
                      <div className="h-4">
                        <div className="font-poppins text-gray-700 text-sm">Rp {product.harga.toLocaleString()}</div>
                      </div>
                      <div className="h-4">
                        <div className="flex items-center justify-start gap-1 h-4">
                          <FaStar className="text-yellow-400" />
                          <div className="font-poppins text-gray-600 text-sm">{product.final_rating}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
            <div className="flex justify-end mt-4">
              <Link
                href="/dashboard"
                className="font-poppins text-primary px-4 py-2 rounded-md bg-white border-2 border-primary cursor-pointer hover:text-white hover:bg-primary hover:border-white"
              >
                Lihat Selengkapnya
              </Link>
            </div>
          </div>
        </section>


        <section id="kontak" className="px-4 py-32 bg-gray-100">
          <div className="flex flex-col lg:flex-row gap-10 justify-center items-center rounded-lg w-full mx-auto font-poppins">
            <div className="lg:w-1/2 flex justify-center items-center">
              <div className="relative bg-primary rounded-full w-64 h-64">
                <img className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2" src="/image/mockup.png" alt="" />
              </div>
            </div>
            <div className="lg:w-1/2">
              <p className="text-4xl font-semibold text-primary my-3">Unduh Aplikasi Kami</p>
              <p className="text-primary text-justify me-10">
                HydraTiva adalah aplikasi yang dirancang untuk meningkatkan produktivitas dan efisiensi di sektor perkebunan tanaman Stevia. Dengan menggabungkan teknologi IoT (Internet of Things),  HydraTiva memungkinkan petani untuk memantau kondisi lahan secara real-time dan membantu penyaluran hasil perkebunan stevia.
              </p>
              <button type="button" className="font-poppins flex items-center justify-center w-48 mt-6 text-white bg-black rounded-lg h-14">
                <div className="mr-3">
                  <svg viewBox="30 336.7 120.9 129.2" width="30">
                    <path fill="#FFD400" d="M119.2,421.2c15.3-8.4,27-14.8,28-15.3c3.2-1.7,6.5-6.2,0-9.7  c-2.1-1.1-13.4-7.3-28-15.3l-20.1,20.2L119.2,421.2z">
                    </path>
                    <path fill="#FF3333" d="M99.1,401.1l-64.2,64.7c1.5,0.2,3.2-0.2,5.2-1.3  c4.2-2.3,48.8-26.7,79.1-43.3L99.1,401.1L99.1,401.1z">
                    </path>
                    <path fill="#48FF48" d="M99.1,401.1l20.1-20.2c0,0-74.6-40.7-79.1-43.1  c-1.7-1-3.6-1.3-5.3-1L99.1,401.1z">
                    </path>
                    <path fill="#3BCCFF" d="M99.1,401.1l-64.3-64.3c-2.6,0.6-4.8,2.9-4.8,7.6  c0,7.5,0,107.5,0,113.8c0,4.3,1.7,7.4,4.9,7.7L99.1,401.1z">
                    </path>
                  </svg>
                </div>
                <div className="font-poppins">
                  <div className="text-xs font-poppins">
                    Dapatkan di
                  </div>
                  <div className="mt-1 text-xl font-semibold font-poppins">
                    Google Play
                  </div>
                </div>
              </button>
            </div>
          </div>


        </section>

        <Footer />

      </main>
    </>
  );
}
