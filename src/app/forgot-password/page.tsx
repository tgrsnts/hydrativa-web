"use client";

import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reset-password-link`, { email: email });
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Cek email untuk atur ulang kata sandi!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      handleAxiosError(error);
    }
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

  return (
    <>
      <main>
        <section className="flex justify-center px-4 lg:px-40 py-20 bg-gray-100 min-h-screen">
          <div className="modal-box font-poppins p-0 w-76 lg:w-96 h-fit flex flex-col">
            <div className="flex items-center bg-primary rounded-t-lg h-24 lg:h-40 p-16">
              <img src="/image/logo-hydrativa-putih.png" alt="HydraTiva Logo" />
            </div>
            <div className="flex flex-col px-8 pt-8 pb-12">
              <h2 className="text-xl lg:text-2xl font-bold text-center text-black w-full mb-2">
                Atur ulang kata sandi
              </h2>
              <p className="mb-4">
                Masukkan alamat email yang terhubung ke akun HydraTiva-mu untuk
                menerima email dari kami.
              </p>
              <form id="forgotPassword" className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Masukkan email"
                    className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div className="flex flex-col mt-2">
                  <button
                    type="submit"
                    className="p-2 rounded-md bg-primary text-white hover:bg-additional2"
                  >
                    Kirim
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
