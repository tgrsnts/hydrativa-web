"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Keranjang } from "@/lib/interfaces/Keranjang";
import type { Alamat } from "@/lib/interfaces/Alamat";
import { FaLocationDot } from "react-icons/fa6";
import Cookies from "js-cookie";

export default function Keranjang() {
  const [data, setData] = useState<Keranjang[] | null>(null); // State for products
  const [dataAlamat, setDataAlamat] = useState<Alamat[] | null>(null); // State for addresses

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/keranjang`, {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        });
        console.log("API Response:", response.data); // Log to check response structure
        setData(response.data.data || []); // Assuming data is nested within response.data
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setData(null); // Set to null on error
      }
    };

    const fetchDataAlamat = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/alamat`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        });

        console.log("API Response:", response.data); // Log to check response structure

        // Check if the response data structure contains 'data' array
        if (response.data && Array.isArray(response.data.data)) {
          setDataAlamat(response.data.data); // Set the fetched data directly
        } else {
          setDataAlamat([]); // Set to empty array if data is not an array
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setDataAlamat(null); // Set to null on error
      }
    };

    fetchData();
    fetchDataAlamat(); // Call to fetch address data
  }, []);

  const primaryAddress = dataAlamat?.find(alamat => alamat.isPrimary === 1);

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
            {dataAlamat && dataAlamat.length > 0 ? (
              dataAlamat.map((alamat, index) => (
                <div key={index} className="flex justify-between p-4 border-2 border-primary bg-green-50 rounded-lg">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-4">
                      <div>{alamat.label_alamat}</div>
                      {alamat.isPrimary && (
                        <div className="p-1 border-2 text-sm text-primary border-primary">
                          Utama
                        </div>
                      )}
                    </div>
                    <div className="flex">
                      <div>{alamat.nama_penerima}</div>
                      <div className="divider divider-horizontal before:bg-black after:bg-black" />
                      <div>{alamat.no_telepon}</div>
                    </div>
                    <div>{alamat.detail}, {alamat.kelurahan}, {alamat.kecamatan}, {alamat.kabupaten}, {alamat.provinsi}, {alamat.kodepos}</div>
                    <div>
                      <a href="alamat.html" className="text-primary">
                        Ubah
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {/* Optional buttons for each address */}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                Tidak ada alamat yang tersedia.
              </div>
            )}
          </div>
        </div>
      </dialog>

      <main>
        {/* Menu */}
        <section id="detail" className="py-16 lg:px-36 bg-background mt-16 mx-auto">
          <div className="flex flex-wrap gap justify-center">
            <div className="flex flex-col gap-4 w-full lg:w-2/3 p-2">
              <div className="flex flex-col gap-4 bg-white p-6 rounded-lg font-poppins">
                <div className="text-slate-700 font-semibold">ALAMAT PENGIRIMAN</div>
                <div className="flex items-center gap-2">
                  <FaLocationDot />
                  <i className="fa-solid fa-location-dot text-primary" />
                  {primaryAddress && (
                    <div className="flex flex-col">
                    <div>
                      {primaryAddress.label_alamat} • {primaryAddress.nama_penerima}
                    </div>
                    <div>
                      {primaryAddress.no_telepon}
                    </div>
                    </div>
                  )}
                  
                </div>
                {primaryAddress && (
                  <div>
                    {primaryAddress.detail}, {primaryAddress.kelurahan}, {primaryAddress.kecamatan}, {primaryAddress.kabupaten}, {primaryAddress.provinsi}, {primaryAddress.kodepos}                
                  </div>
                )}
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
                {data && data.length > 0 && data.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <img
                      className="w-20 rounded-md"
                      src={item.imageUrl} // Assuming the image URL is part of the item
                      alt={item.nama_produk} // Use the product name for alt text
                    />
                    <div className="flex flex-col w-full">
                      <div>{item.nama_produk}</div>
                      <div className="flex justify-between">
                        <div>x{item.quantity}</div>
                        <div>Rp. {item.harga}</div>
                      </div>
                    </div>
                  </div>
                ))}
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
        <div className="drop-shadow-2xl fixed bottom-0 lg:relative left-0 right-0 flex justify-between bg-white z-50 p-4">
          <div className="flex items-center gap-2">
            <span className="text-primary text-xl font-semibold">Rp 20.000</span>
          </div>
          <div className="flex justify-center items-center">
            <button className="btn-primary">Checkout</button>
          </div>
        </div>
      </div>
    </>
  );
}