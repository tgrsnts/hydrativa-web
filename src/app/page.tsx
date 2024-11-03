"use client";

import { useState, useEffect, FormEvent } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash, FaShoppingCart, FaStar } from "react-icons/fa";
import Footer from "@/components/Footer";
import { Produk } from "@/lib/interfaces/Produk";
import axios from "axios";
import Cookies from "js-cookie";

export default function Home() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const closeModal = (modalId: string) => {
    const modal = document.getElementById(modalId) as HTMLDialogElement | null;
    if (modal?.close) {
      modal.close();
    }
  };

  const [dataForm, setDataForm] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const [products, setProducts] = useState<Produk[]>([]); // Deklarasikan state products

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({
      ...dataForm,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(process.env.NEXT_PUBLIC_API_URL +'/login', dataForm);
      setError(null);
      console.log(res.data);
      Cookies.set('token', res.data, {
        expires: 7,
        path: '/'
      })
      window.location.href = '/dashboard'
    } catch (err) {
      setError(err.response?.data?.message);
      console.error("Error posting form data:", err.response?.data?.message);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL +'/produk'); // Ganti dengan URL API kamu
      const result = await response.json();
      setProducts(result.data); // Ambil data dari response dan set ke state
    };

    fetchProducts();
  }, []);

  return (
    <>
      {/* <!-- Navbar --> */}
      <header className="shadow fixed top-0 w-full z-10 h-20 bg-primary">
        <div className="bg-primary relative flex justify-between lg:justify-start flex-col lg:flex-row lg:h-20 overflow-hidden px-4 py-4 md:px-36 md:mx-auto md:flex-wrap md:items-center">
          <a href="/" className="flex items-center whitespace-nowrap text-2xl">
            <img className="h-8" src="image/logo-hydrativa-putih.png" alt="Logo" />
          </a>
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
                <a href="#hero">Home</a>
              </li>
              <li className="text-white border-b-2 border-primary md:mr-12 hover:border-white">
                <a href="#our-products">Produk</a>
              </li>
              <li className="text-white border-b-2 border-primary md:mr-12 hover:border-white">
                <a href="#cart">
                  <FaShoppingCart className="text-white" />
                </a>
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

      {/* <!-- Modal Login --> */}
      <dialog id="modal_login" className="modal backdrop-blur-lg">
        <div className="modal-box font-poppins p-0 w-76 lg:w-96 flex flex-col">
          <div className="flex items-center bg-primary rounded-t-lg h-24 lg:h-40">
            <h2 className="text-2xl lg:text-5xl font-bold text-center text-white w-full">Login</h2>
          </div>
          <div className="px-8 pt-4 pb-12">
            <form id="loginForm" onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="flex flex-col">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={dataForm.username}
                  onChange={handleChange}
                  placeholder="Masukkan username"                  
                  className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="password">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center px-2">
                    <input
                      className="hidden"
                      id="toggle-password"
                      type="checkbox"
                      checked={isPasswordVisible}
                      onChange={togglePasswordVisibility}
                    />
                    <label
                      className="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer"
                      htmlFor="toggle-password"
                    >
                      {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                    </label>
                  </div>
                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={dataForm.password}
                    onChange={handleChange}
                    placeholder="Masukkan password"
                    className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <a
                  href=""
                  className="mt-1 text-sm text-primary hover:text-additional2 hover:underline hover:underline-offset-4"
                >
                  Lupa password?
                </a>
              </div>
              <div className="flex flex-col mt-2">
                <button
                  type="submit"
                  className="p-2 rounded-md bg-primary text-white hover:bg-additional2"
                >
                  Login
                </button>
              </div>
            </form>
            <div className="divider">atau masuk dengan</div>
            <button className="mt-2 flex justify-center items-center gap-2 w-full border-2 rounded-md py-1 text-black hover:bg-gray-100 hover:text-additional2">
              <FcGoogle />
              Google
            </button>

            <div className="mt-2 text-center">
              Belum punya akun?{" "}
              <button
                className="text-primary hover:text-additional2 hover:underline hover:underline-offset-4"
                onClick={() => {
                  closeModal('modal_login');
                  const modal = document.getElementById('modal_register') as HTMLDialogElement | null;
                  if (modal) {
                    modal.showModal();
                  }
                }}
              >
                Daftar!
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={() => closeModal('modal_login')}>close</button>
        </form>
      </dialog>

      {/* <!-- Modal Register --> */}
      <dialog id="modal_register" className="modal backdrop-blur-lg">
        <div className="modal-box font-poppins p-0 w-76 lg:w-96 flex flex-col">
          <div className="flex items-center bg-primary rounded-t-lg h-24 lg:h-40">
            <h2 className="text-2xl lg:text-5xl font-bold text-center text-white w-full">Daftar</h2>
          </div>
          <div className="px-8 pt-4 pb-12">
            <form id="registerForm" className="flex flex-col gap-2">
              <div className="flex flex-col">
                <label htmlFor="namaRegister">Nama</label>
                <input
                  type="text"
                  id="namaRegister"
                  name="nama"
                  placeholder="Masukkan nama"
                  className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-primary focus:border-primary"
                  required
                />

              </div>
              <div className="flex flex-col">
                <label htmlFor="username-register">Username</label>
                <input
                  type="text"
                  id="username-register"
                  name="username"
                  placeholder="Masukkan username"
                  className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-primary focus:border-primary"
                  required
                />

              </div>
              <div className="flex flex-col">
                <label htmlFor="email-register">Email</label>
                <input
                  type="email"
                  id="email-register"
                  name="email"
                  placeholder="Masukkan email"
                  className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-primary focus:border-primary"
                  required
                />

              </div>
              <div className="flex flex-col">
                <label htmlFor="password-register">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center px-2">
                    <input
                      className="hidden"
                      id="toggle-register-password"
                      type="checkbox"
                      checked={isPasswordVisible}
                      onChange={togglePasswordVisibility}
                    />
                    <label
                      className="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer"
                      htmlFor="toggle-register-password"
                    >
                      {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                    </label>
                  </div>
                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    id="password-register"
                    placeholder="Masukkan password"
                    className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-primary focus:border-primary"
                    required
                  />

                </div>
              </div>
              <div className="flex flex-col mt-4">
                <button
                  type="submit"
                  className="p-2 rounded-md bg-primary text-white hover:bg-additional2"
                >
                  Daftar
                </button>
              </div>
            </form>
            <div className="divider">atau daftar dengan</div>
            <button className="mt-2 flex justify-center items-center gap-2 w-full border-2 rounded-md py-1 text-black hover:bg-gray-100 hover:text-additional2">
              <FcGoogle />
              Google
            </button>
            <div className="mt-2 text-center">
              Sudah punya akun?{" "}
              <button
                className="text-primary hover:text-additional2 hover:underline hover:underline-offset-4"
                onClick={() => {
                  closeModal('modal_register');
                  const modal = document.getElementById('modal_login') as HTMLDialogElement | null;
                  if (modal) {
                    modal.showModal();
                  }
                }}
              >
                Login!
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={() => closeModal('modal_register')}>close</button>
        </form>
      </dialog>

      <main>
        {/* Hero */}
        <section id="hero">
          <div
            className="bg-cover bg-center h-screen relative"
            style={{ backgroundImage: 'url("image/IMG_2597.jpg")' }}
          >
            <div className="absolute inset-0 bg-black opacity-50" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
              <h1 className="text-white px-4 text-2xl lg:text-5xl font-poppins font-bold mb-2">
                HydraTiva
              </h1>
            </div>
          </div>
        </section>


        {/* Know About Us */}
        <section className="px-4 lg:px-40 py-20 bg-gray-100">
          <div className="container mx-auto flex flex-col lg:flex-row gap-5 items-start justify-center">
            <img className="w-full lg:w-72" src="image/tentang.png" alt="" />
            <div>
              <h2 className="text-xl lg:text-5xl font-poppins font-bold mb-2 lg:mb-6">
                HydraTiva.
              </h2>
              <p className="text-sm lg:text-lg text-justify font-poppins text-gray-700">
                HydraTiva adalah aplikasi yang dirancang untuk meningkatkan
                produktivitas dan efisiensi di sektor perkebunan tanaman Stevia.
                Dengan menggabungkan teknologi IoT (Internet of Things) dan analisis
                data yang canggih, HydraTiva memungkinkan petani untuk memantau
                kondisi lahan secara real-time, mengatur penyiraman secara otomatis
                maupun manual, dan membantu penyaluran hasil perkebunan stevia.
                Aplikasi ini memberikan informasi kadar tanah kebun stevia, histori
                penyiraman lahan stevia, dan rekomendasi tindakan berdasarkan data
                yang terkumpul dari sensor yang tersebar di seluruh lahan stevia.
              </p>
            </div>
          </div>
        </section>


        {/* Our Products */}
        <section id="our-products" className="px-4 lg:px-36 py-20 bg-primary">
          <div className="container mx-auto text-center">
            <h2 className="text-xl lg:text-5xl text-center font-poppins font-bold mb-8 text-white">
              Our Products
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
              {products.length > 0 ? (
                products.map((product) => (
                  <a
                    href={`/detail/${product.id}`} // Ganti dengan path yang sesuai
                    className="flex flex-col w-full lg:w-full bg-white rounded-lg shadow-md transition-transform duration-300 transform hover:bg-gray-100 hover:scale-105"
                    key={product.id} // Pastikan ada key untuk setiap elemen
                  >
                    <img
                      src={`/storage/produk/${product.gambar}`} // Path gambar sesuai dengan data produk
                      alt={product.nama} // Menggunakan nama produk sebagai alt
                      className="w-full object-cover mb-2 rounded-t-lg"
                    />
                    <div className="flex flex-col items-start p-4 pt-0">
                      <p className="text-sm lg:text-lg font-poppins font-semibold">
                        {product.nama} {/* Menggunakan properti yang benar */}
                      </p>
                      <div className="font-poppins text-gray-700">Rp {product.harga}</div>
                      <div className="flex items-center justify-start gap-1">
                        <FaStar className="text-yellow-400"></FaStar>
                        <div className="font-poppins text-gray-600">4.5</div>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                // <p>Loading products...</p> // Menangani kondisi ketika tidak ada produk
                <>
                  <a
                    href={`/detail/1`} // Adjusted path as needed
                    className="flex flex-col w-full lg:w-full bg-white rounded-lg shadow-md transition-transform duration-300 transform hover:bg-gray-100 hover:scale-105"
                    key="product1"
                  >
                    <img
                      src="/storage/produk/Group 185.png"
                      alt="Ayam Goreng"
                      className="w-full object-cover mb-2 rounded-t-lg"
                    />
                    <div className="flex flex-col items-start p-4 pt-0">
                      <p className="text-sm lg:text-lg font-poppins font-semibold">HydraTiva</p>
                      <div className="font-poppins text-gray-700">Rp 1.500.000</div>
                      <div className="flex items-center justify-start gap-1">
                        <FaStar className="text-yellow-400"></FaStar>
                        <div className="font-poppins text-gray-600">4.5</div>
                      </div>
                      
                    </div>
                  </a>

                  <a
                    href={`/detail/2`}
                    className="flex flex-col w-full lg:w-full bg-white rounded-lg shadow-md transition-transform duration-300 transform hover:bg-gray-100 hover:scale-105"
                    key="product2"
                  >
                    <img
                      src="/storage/produk/Group 186.png"
                      alt="Es Jeruk"
                      className="w-full object-cover mb-2 rounded-t-lg"
                    />
                    <div className="flex flex-col items-start p-4 pt-0">
                      <p className="text-sm lg:text-lg font-poppins font-semibold">Daun Stevia Kering</p>
                      <div className="font-poppins text-gray-700">Rp 150.000</div>
                      <div className="flex items-center justify-start gap-1">
                        <FaStar className="text-yellow-400"></FaStar>
                        <div className="font-poppins text-gray-600">4.5</div>
                      </div>                      
                    </div>
                  </a>

                  <a
                    href={`/detail/3`}
                    className="flex flex-col w-full lg:w-full bg-white rounded-lg shadow-md transition-transform duration-300 transform hover:bg-gray-100 hover:scale-105"
                    key="product3"
                  >
                    <img
                      src="/storage/produk/teh stevia.jpeg"
                      alt="Nasi"
                      className="w-full object-cover mb-2 rounded-t-lg"
                    />
                    <div className="flex flex-col items-start p-4 pt-0">
                      <p className="text-sm lg:text-lg font-poppins font-semibold">Teh Stevia</p>
                      <div className="font-poppins text-gray-700">Rp 120.000</div>
                      <div className="flex items-center justify-start gap-1">
                        <FaStar className="text-yellow-400"></FaStar>
                        <div className="font-poppins text-gray-600">4.5</div>
                      </div>                      
                    </div>
                  </a>

                  <a
                    href={`/detail/4`}
                    className="flex flex-col w-full lg:w-full bg-white rounded-lg shadow-md transition-transform duration-300 transform hover:bg-gray-100 hover:scale-105"
                    key="product4"
                  >
                    <img
                      src="/storage/produk/liquid stevia.jpeg"
                      alt="Es teh"
                      className="w-full object-cover mb-2 rounded-t-lg"
                    />
                    <div className="flex flex-col items-start p-4 pt-0">
                      <p className="text-sm lg:text-lg font-poppins font-semibold">Liquid Stevia</p>
                      <div className="font-poppins text-gray-700">Rp 96.000</div>
                      <div className="flex items-center justify-start gap-1">
                        <FaStar className="text-yellow-400"></FaStar>
                        <div className="font-poppins text-gray-600">4.5</div>
                      </div>                      
                    </div>
                  </a>
                </>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <a
                href="/dashboard"
                className="font-poppins text-primary border-2 px-4 py-2 rounded-md bg-white cursor-pointer hover:text-white hover:bg-primary hover:border-white"
              >
                Lihat Selengkapnya
              </a>
            </div>
          </div>
        </section>


        <section id="kontak" className="px-4 py-20 bg-gray-100">
          <div className="flex flex-col gap-10 justify-center bg-white rounded-lg w-full lg:w-1/2 mx-auto font-poppins">
            <div className="flex items-center bg-primary rounded-t-lg h-40">
              <h2 className="text-xl lg:text-5xl font-bold text-center text-white w-full">
                Kontak
              </h2>
            </div>
            <div className="w-full flex flex-wrap px-8 lg:px-8 pb-10 lg:pb-16">
              {/* <div class="flex flex-col w-full lg:w-1/2 transition duration-300 hover:drop-shadow-2xl">
                  <iframe
                      src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d990.8655974168457!2d106.808518!3d-6.589305!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c57776d4956d%3A0x7d23c109e11fa013!2%20Makan%20HydraTiva!5e0!3m2!1sid!2sid!4v1716653576602!5m2!1sid!2sid"
                      class="flex flex-col w-full lg:h-full rounded-lg" style="border:0;" allowfullscreen=""
                      loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
              </div> */}
              <form
                action=""
                className="flex flex-col mt-8 lg:mt-0 w-full lg:ps-4 gap-2 rounded-lg transition duration-300 font-poppins"
              >
                <h2 className="text-xl lg:text-2xl font-bold text-center w-full">
                  Hubungi Kami
                </h2>
                <div className="flex flex-col">
                  <label htmlFor="nama">Nama</label>
                  <input
                    type="text"
                    id="nama"
                    placeholder="Masukan nama anda"
                    className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-primary focus-border-primary"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="telepon">No. Telepon</label>
                  <input
                    type="text"
                    id="telepon"
                    placeholder="Masukan nomor telepon anda"
                    className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-primary focus-border-primary"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Masukan email anda"
                    className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-primary focus-border-primary"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="subjek">Subjek</label>
                  <input
                    type="text"
                    id="subjek"
                    placeholder="Subjek"
                    className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-primary focus-border-primary"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="pesan">Pesan</label>
                  <textarea
                    name=""
                    id="pesan"
                    placeholder="Pesan anda"
                    className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-primary focus-border-primary"
                    defaultValue={""}
                  />
                </div>
                <div className="flex flex-col mt-4 lg:mt-auto">
                  {/* <button type="submit"
                          class="p-2 rounded-md bg-primary text-white hover:bg-additional2">Kirim</button> */}
                  <button
                    type="submit"
                    className="p-2 rounded-md bg-white text-primary ring-2 ring-primary hover:bg-primary hover:text-white"
                  >
                    Kirim
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <Footer />

      </main>
    </>
  );
}
