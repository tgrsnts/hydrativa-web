"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Keranjang } from "@/lib/interfaces/Keranjang";
import type { Alamat } from "@/lib/interfaces/Alamat";
import { FaLocationDot } from "react-icons/fa6";
import Cookies from "js-cookie";

declare global {
  interface Window {
    snap: {
      pay: (response: PaymentResponse, options: {
        onSuccess: (result: PaymentResult) => void;
        onPending: (result: PaymentResult) => void;
        onError: (error: PaymentError) => void;
        onClose: () => void;
      }) => void;
    };
  }
}

interface PaymentResponse {
  status: string;
  transaction_id: string;
  // Add other properties from the response that are important
}

interface PaymentResult {
  transaction_status: string;
  // Add other properties from the result if needed
}

interface PaymentError {
  code: string;
  message: string;
  // Add other properties related to the error if needed
}



export default function Checkout() {
  const [dataAlamat, setDataAlamat] = useState<Alamat[] | null>(null);
  const [selectedItems, setSelectedItems] = useState<Keranjang[]>([]);
  const [total, setTotal] = useState<number>(0);

  const handlePayment = async () => {
    try {
      // Calculate the total price based on selected items
      const totalPrice = calculateTotalPrice();

      // Prepare the data to send in the POST request
      const requestData = {
        id_item: selectedItems.map(item => item.id),  // Extracts the item IDs
        total: totalPrice,  // Send the total price
      };

      // Send the payment request
      const response = await axios.post(
        'http://127.0.0.1:8000/api/bayar',
        requestData,  // Send the request data
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        }
      );

      if (response && response.data) {
        // Extract the necessary fields from response.data
        const paymentResponse: PaymentResponse = {
          status: response.data.status,  // Assuming status is part of the response
          transaction_id: response.data.transaction_id,  // Extract the transaction ID
        };

        window.snap.pay(paymentResponse, {
          onSuccess: (result) => {
            console.log('Payment successful:', result);
          },
          onPending: (result) => {
            console.log('Payment pending:', result);
          },
          onError: (error) => {
            console.error('Payment error:', error);
          },
          onClose: () => {
            console.log('Payment popup closed');
          },
        });
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };



  const calculateTotalPrice = () => {
    return selectedItems.reduce((total, item) => total + item.harga * item.quantity, 0);
  };


  useEffect(() => {
    const storedItems = sessionStorage.getItem('selectedItems');
    if (storedItems) {
      setSelectedItems(JSON.parse(storedItems)); // Parse to get the array of objects
    }

    const fetchDataAlamat = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/alamat`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        });

        console.log("API Response:", response.data); // Log to check response structure

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

    fetchDataAlamat(); // Call to fetch address data

    const snapScript = 'https://app.sandbox.midtrans.com/snap/snap.js';
    const clientKey = process.env.NEXT_PUBLIC_CLIENT_KEY;

    const script = document.createElement('script');
    if (clientKey) { 
      script.src = snapScript;
      script.setAttribute('data-client-key', clientKey); 
      script.async = true;
      script.type = 'text/javascript';

      document.head.appendChild(script);
    } else {
      console.error("Client key is not defined");
    }


    return () => {
      document.head.removeChild(script);
    }
  }, []);

  useEffect(() => {
    const totalPrice = calculateTotalPrice();
    setTotal(totalPrice); // Update total when items change or the component mounts
  });

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
        <section id="detail" className="py-16 lg:px-36 bg-background mt-16 mx-auto">
          <div className="flex flex-wrap gap justify-center">
            <div className="flex flex-col gap-4 w-full lg:w-2/3 p-2">
              <div className="flex flex-col gap-4 bg-white p-6 rounded-lg font-poppins">
                <div className="text-slate-700 font-semibold">ALAMAT PENGIRIMAN</div>
                <div className="flex items-center gap-2">
                  <FaLocationDot />
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
                {selectedItems && selectedItems.length > 0 && selectedItems.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <img
                      className="w-20 rounded-md"
                      src={item.gambar} // Assuming the image URL is part of the item
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
                      <div>Total Harga</div>
                      <div>Rp {total}</div>
                    </div>
                    <div className="flex justify-between">
                      <div>Total Ongkos Kirim</div>
                      <div>Rp 12.000</div> {/* Static shipping cost */}
                    </div>
                    <div className="divider" />
                    <div className="flex justify-between">
                      <div>Total Belanja</div>
                      <div>Rp 20.000</div> {/* Dynamic total */}
                    </div>
                  </div>
                  <button
                    onClick={handlePayment}

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
            <span className="text-primary text-xl font-semibold">Rp 20.000</span> {/* Dynamic total */}
          </div>
          <div className="flex justify-center items-center">
            <button className="btn-primary">Checkout</button>
          </div>
        </div>
      </div>
    </>
  );
}
