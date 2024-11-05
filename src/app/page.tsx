"use client";

import { useState, useEffect } from "react";
// import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash, FaShoppingCart, FaStar } from "react-icons/fa";
import Footer from "@/components/Footer";
import { Produk } from "@/lib/interfaces/Produk";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";


export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [dataForm, setDataForm] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Produk[]>([]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const closeModal = (modalId: string) => {
    const modal = document.getElementById(modalId) as HTMLDialogElement | null;
    if (modal?.close) {
      modal.close();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataForm({
      ...dataForm,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, dataForm);

      // Check if the response has a token
      if (res.data.token) {
        setError(null);
        // Save the token in cookies
        Cookies.set("token", res.data.token, { expires: 7, path: "/" });
        // Optionally, save user data if you need it later
        Cookies.set("user", JSON.stringify(res.data.user), { expires: 7, path: "/" });
        window.location.href = "/dashboard";
      } else {
        setError("Login failed: No token returned.");
      }
    } catch (error) {
      setError("An error occurred during login.");
      console.error("Error posting form data:", error);
    }
  };


  useEffect(() => {
    setIsClient(true);
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produk`);
        const result = await response.json();
        setProducts(result);
      } catch (fetchError) {
        console.error("Failed to fetch products:", fetchError);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      {/* <!-- Navbar --> */}
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

      {/* <!-- Modal Login --> */}
      <dialog id="modal_login" className="modal backdrop-blur-lg">
        <div className="modal-box font-poppins p-0 w-76 lg:w-96 flex flex-col">
          <div className="flex items-center bg-primary rounded-t-lg h-24 lg:h-40 p-16">
            <img src="/image/logo-hydrativa-putih.png" alt="" />
          </div>
          <div className="px-8 pt-4 pb-12">
            <h2 className="text-2xl lg:text-4xl font-bold text-center text-black w-full mb-4">Login</h2>
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
                <Link
                  href=""
                  className="mt-1 text-sm text-primary hover:text-additional2 hover:underline hover:underline-offset-4"
                >
                  Lupa password?
                </Link>
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
            {/* <div className="divider">atau masuk dengan</div>
            <button className="mt-2 flex justify-center items-center gap-2 w-full border-2 rounded-md py-1 text-black hover:bg-gray-100 hover:text-additional2">
              <FcGoogle />
              Google
            </button> */}

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
          <div className="flex items-center bg-primary rounded-t-lg h-24 lg:h-40 p-16">
            <img src="/image/logo-hydrativa-putih.png" alt="" />
          </div>
          <div className="px-8 pt-4 pb-12">
            <h2 className="text-2xl lg:text-4xl font-bold text-center text-black w-full mb-4">Daftar</h2>
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
            {/* <div className="divider">atau daftar dengan</div>
            <button className="mt-2 flex justify-center items-center gap-2 w-full border-2 rounded-md py-1 text-black hover:bg-gray-100 hover:text-additional2">
              <FcGoogle />
              Google
            </button> */}
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
        {/* Display the error message if one exists */}
        {error && <p style={{ color: "red" }}>{error}</p>}


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
                  <Link
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
                  </Link>
                ))
              ) : (
                // <p>Loading products...</p> // Menangani kondisi ketika tidak ada produk
                <>
                  <Link
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
                  </Link>

                  <Link
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
                  </Link>

                  <Link
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
                  </Link>

                  <Link
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
                  </Link>
                </>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <Link
                href="/dashboard"
                className="font-poppins text-primary border-2 px-4 py-2 rounded-md bg-white cursor-pointer hover:text-white hover:bg-primary hover:border-white"
              >
                Lihat Selengkapnya
              </Link>
            </div>
          </div>
        </section>


        <section id="kontak" className="px-4 py-20 bg-gray-100">
          <div className="flex flex-row gap-10 justify-center items-center rounded-lg w-full mx-auto font-poppins">
            <div className="w-1/2 flex justify-center items-center">
              <div className="bg-primary rounded-full w-60 h-60">
                <img src="/image/mockup.png" alt="" />
              </div></div>
            <div className="w-1/2">
              <p className="text-4xl font-semibold text-primary">Unduh Aplikasi Kami</p>
              <p className="text-primary">
                HydraTiva adalah aplikasi yang dirancang untuk meningkatkan produktivitas dan efisiensi di sektor perkebunan tanaman Stevia. Dengan menggabungkan teknologi IoT (Internet of Things),  HydraTiva memungkinkan petani untuk memantau kondisi lahan secara real-time dan membantu penyaluran hasil perkebunan stevia.
              </p>
              <button type="button" className="font-poppins flex items-center justify-center w-48 mt-3 text-white bg-black rounded-lg h-14">
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
                    GET IT ON
                  </div>
                  <div className="mt-1 font-sans text-xl font-semibold font-poppins">
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
