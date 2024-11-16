import React from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [dataForm, setDataForm] = useState({ username: "", password: "" });
  const [dataRegisterForm, setDataRegisterForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const closeModal = (modalId: string) => {
    const modal = document.getElementById(modalId) as HTMLDialogElement | null;
    if (modal?.close) {
      modal.close();
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataForm({
      ...dataForm,
      [name]: value,
    });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataRegisterForm({
      ...dataRegisterForm,
      [name]: value,
    });
  };

  const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response) {
      Swal.fire({
        icon: "error",
        title: error.response.data.message || "Error",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan",
        text: "Mohon coba lagi nanti.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, dataForm);

      if (res.data.token) {
        Cookies.set("token", res.data.token, { expires: 7, path: "/" });
        Cookies.set("name", res.data.user.name, { expires: 7, path: "/" });
        if (res.data.user.gambar) {
          Cookies.set("gambar", res.data.user.gambar, { expires: 7, path: "/" });
        }
        Cookies.set("role", res.data.user.role, { expires: 7, path: "/" });
        closeModal('modal_login');
        window.location.href = "/dashboard";
      }
    } catch (error) {
      closeModal('modal_login')
      handleAxiosError(error);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, dataRegisterForm);

      if (res.data.token) {
        closeModal('modal_register');
      }
    } catch (error) {
      closeModal('modal_login')
      handleAxiosError(error);
    }
  };


  useEffect(() => {
    const clientToken = Cookies.get('token');
    setToken(clientToken || null);
  }, []);

  return (
    <>
      <header className="shadow fixed top-0 w-full z-10 h-20 bg-primary">
        <div className="bg-primary relative flex justify-between lg:justify-start flex-col lg:flex-row lg:h-20 overflow-hidden px-4 py-4 md:px-36 md:mx-auto md:flex-wrap md:items-center">
          <Link href="/" className="flex items-center whitespace-nowrap text-2xl">
            <img className="h-8" src="/image/logo-hydrativa-putih.png" alt="Logo" />
          </Link>
          <input type="checkbox" className="peer hidden" id="navbar-open" />
          <label className="absolute top-7 right-8 cursor-pointer md:hidden" htmlFor="navbar-open">
            <span className="sr-only">Toggle Navigation</span>
            <i className="fa-solid fa-bars h-6 w-6 text-white" />
          </label>
          <nav aria-label="Header Navigation" className="peer-checked:max-h-60 max-h-0 w-full lg:w-auto flex-col flex lg:flex-row lg:max-h-full overflow-hidden transition-all duration-300 lg:items-center lg:ml-auto">
            <ul className="flex flex-col lg:flex-row lg:space-y-0 space-y-4 items-center lg:ml-auto font-poppins font-semibold">
              <li className="text-white border-b-2 border-primary md:mr-12 hover:border-white">
                <Link href="/#hero">Beranda</Link>
              </li>
              <li className="text-white border-b-2 border-primary md:mr-12 hover:border-white">
                <Link href="/#our-products">Produk</Link>
              </li>
              <li className="md:mr-12">
                <Link
                  href="/keranjang"
                  className="flex justify-center items-center focus:outline-none text-white hover:bg-background font-medium rounded-md text-sm w-12 aspect-square hover:text-decoration-none"
                >
                  <FaShoppingCart className="text-white" />
                </Link>
              </li>
              {
                token ? (
                  <div className="hidden lg:flex items-center ml-auto gap-3 h-full">
                    <Link
                      href="/akun"
                      className="flex items-center gap-2 hover:bg-background py-1 px-2 rounded-md"
                    >
                      { Cookies.get('gambar') ? (<img className="w-10 rounded-full" src={Cookies.get("gambar")} alt="User Avatar" />) : (null) }
                      <p className="font-semibold text-nowrap text-white">{Cookies.get('name')}</p>
                    </Link>
                  </div>
                ) : (
                  <>
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
                  </>
                )
              }
            </ul>
          </nav>
        </div>
      </header>

      {/* Modal Login */}
      <dialog id="modal_login" className="modal backdrop-blur-lg">
        <div className="modal-box font-poppins p-0 w-76 lg:w-96 flex flex-col">
          <div className="flex items-center bg-primary rounded-t-lg h-24 lg:h-40 p-16">
            <img src="/image/logo-hydrativa-putih.png" alt="" />
          </div>
          <div className="px-8 pt-4 pb-12">
            <h2 className="text-2xl lg:text-4xl font-bold text-center text-black w-full mb-4">Login</h2>
            <form id="loginForm" onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="flex flex-col">
                <label htmlFor="username">Nama Pengguna</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={dataForm.username}
                  onChange={handleChange}
                  placeholder="Masukkan nama pengguna"
                  className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="password">Kata Sandi</label>
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
                    placeholder="Masukkan kata sandi"
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
                  Masuk
                </button>
              </div>
            </form>
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
                Registrasi!
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={() => closeModal('modal_login')}>Tutup</button>
        </form>
      </dialog>

      {/* Modal Register */}
      <dialog id="modal_register" className="modal backdrop-blur-lg">
        <div className="modal-box font-poppins p-0 w-76 lg:w-96 flex flex-col">
          <div className="flex items-center bg-primary rounded-t-lg h-24 lg:h-40 p-16">
            <img src="/image/logo-hydrativa-putih.png" alt="" />
          </div>
          <div className="px-8 pt-4 pb-12">
            <h2 className="text-2xl lg:text-4xl font-bold text-center text-black w-full mb-4">Registrasi</h2>
            <form id="registerForm" onSubmit={handleRegisterSubmit} className="flex flex-col gap-2">
              <div className="flex flex-col">
                <label htmlFor="name">Nama</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={dataRegisterForm.name}
                  onChange={handleRegisterChange}
                  placeholder="Masukkan nama"
                  className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="username">Nama Pengguna</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={dataRegisterForm.username}
                  onChange={handleRegisterChange}
                  placeholder="Masukkan nama pengguna"
                  className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={dataRegisterForm.email}
                  onChange={handleRegisterChange}
                  placeholder="Masukkan email"
                  className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="register-password">Kata Sandi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center px-2">
                    <input
                      className="hidden"
                      id="toggle-password-register"
                      type="checkbox"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    />
                    <label
                      className="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer"
                      htmlFor="toggle-password-register"
                    >
                      {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </label>
                  </div>
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    id="register-password"
                    name="password"
                    value={dataRegisterForm.password}
                    onChange={handleRegisterChange}
                    placeholder="Masukkan password"
                    className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <button
                  type="submit"
                  className="p-2 rounded-md bg-primary text-white hover:bg-additional2"
                >
                  Register
                </button>
              </div>
            </form>

          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={() => closeModal('modal_register')}>Tutup</button>
        </form>
      </dialog>
    </>
  );
}
