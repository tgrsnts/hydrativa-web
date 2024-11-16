"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Keranjang } from "@/lib/interfaces/Keranjang";
import type { Alamat } from "@/lib/interfaces/Alamat";
import { FaLocationDot } from "react-icons/fa6";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

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
  const [primaryAlamat, setPrimaryAlamat] = useState<Alamat | null>(null);
  const [selectedAlamatId, setSelectedAlamatId] = useState(0);
  const [selectedItems, setSelectedItems] = useState<Keranjang[]>([]);
  const [total, setTotal] = useState<number>(0);


  const closeModal = (modalId: string) => {
    const modal = document.getElementById(modalId) as HTMLDialogElement | null;
    if (modal?.close) {
      modal.close();
    }
  };

  const handleGantiAlamat = async (alamatId: number) => {
    // Update the selected address ID
    setSelectedAlamatId(alamatId);

    await closeModal('modalGantiAlamat')
    await Swal.fire({
      title: 'Berhasil!',
      text: 'Berhasil mengganti alamat pengiriman!',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  };

  const handlePayment = async () => {
    try {
      // Calculate the total price
      const totalPrice = calculateTotalPrice();
      let requestData;

      // Check if it's a direct purchase
      if (sessionStorage.getItem('isBeliLangsung') === "1") {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/keranjang/add`,
          {
            id_produk: selectedItems[0].id_produk,
            quantity: selectedItems[0].quantity,
          },
          {
            headers: {
              'Authorization': `Bearer ${Cookies.get('token')}`,
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          requestData = {
            id_alamat: selectedAlamatId,
            id_item: [response.data.data.transaksi_item_id],
            total: totalPrice,
          };
        } else {
          console.warn("Failed to add product to cart:", response.data);
          return; // Exit if the cart addition fails
        }
      } else {
        // Normal purchase flow
        requestData = {
          id_alamat: selectedAlamatId,
          id_item: selectedItems.map(item => item.id),
          total: totalPrice,
        };
      }

      // Send the payment request
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/bayar`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        }
      );

      if (response && response.data) {
        // Initiate the payment process
        window.snap.pay(response.data.snaptoken, {
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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/alamat`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        });

        console.log("API Response:", response.data); // Log to check response structure

        if (response.data && Array.isArray(response.data)) {
          setDataAlamat(response.data); // Set the fetched data directly
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

    if (dataAlamat) {
      const primary = dataAlamat.find((alamat) => alamat.isPrimary === 1);

      if (primary) {
        setPrimaryAlamat(primary);
        setSelectedAlamatId(primary.alamat_id);
      } else {
        setPrimaryAlamat(null);
      }
    }
  });


  return (
    <>
      <Navbar />
      <dialog id="modalGantiAlamat" className="modal">
        <div className="flex flex-col gap-4 modal-box w-11/12 max-w-3xl font-poppins">
          <h3 className="font-bold text-lg text-center">Daftar Alamat</h3>
          <a
            href="/alamat"
            className="w-full p-2 bg-primary hover:bg-background text-white text-center rounded-lg"
          >
            Tambah Alamat
          </a>
          <div className="flex flex-col gap-4">
            {dataAlamat && dataAlamat.length > 0 ? (
              dataAlamat.map((alamat, index) => (
                <div
                  key={index}
                  className={`flex justify-between p-4 border-2 rounded-lg hover:cursor-pointer
                     ${alamat.isPrimary ? 'border-second' : ''}`}
                  onClick={() => {
                    handleGantiAlamat(alamat.alamat_id)
                  }}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-4">
                      <div>{alamat.label_alamat}</div>
                      {alamat.isPrimary === 1 && ( // Only show "Utama" if isPrimary is 1
                        <div className="px-2 py-1 border-2 text-sm text-primary border-primary rounded-md">
                          Utama
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className='text-xl font-semibold'>{alamat.nama_penerima}</div>
                      <div>{alamat.no_telepon}</div>
                    </div>
                    <div>
                      {alamat.detail}, {alamat.kelurahan}, {alamat.kecamatan}, {alamat.kabupaten}, {alamat.provinsi}, {alamat.kodepos}
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
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={() => closeModal('modalGantiAlamat')}>Tutup</button>
        </form>
      </dialog>

      <main>
        <section id="detail" className="py-16 lg:px-36 bg-slate-50 mt-16 mx-auto">
          <div className="flex flex-wrap gap justify-center">
            <div className="flex flex-col gap-4 w-full lg:w-2/3 p-2">
              <div className="flex flex-col gap-4 bg-white shadow-md p-6 rounded-lg font-poppins">
                <div className="text-slate-700 font-semibold">ALAMAT PENGIRIMAN</div>
                <div className="flex items-center gap-2">
                  <FaLocationDot />
                  {primaryAlamat && (
                    <div className="flex flex-col">
                      <div>
                        {primaryAlamat.label_alamat} • {primaryAlamat.nama_penerima}
                      </div>
                      <div>
                        {primaryAlamat.no_telepon}
                      </div>
                    </div>
                  )}
                </div>
                {primaryAlamat && (
                  <div>
                    {primaryAlamat.detail}, {primaryAlamat.kelurahan}, {primaryAlamat.kecamatan}, {primaryAlamat.kabupaten}, {primaryAlamat.provinsi}, {primaryAlamat.kodepos}
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
                    className="px-4 py-2 bg-primary hover:bg-background text-white rounded-lg"
                  >
                    Ganti Alamat
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-4 bg-white shadow-md p-6 rounded-lg font-poppins">
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
              <div className="flex flex-col p-6 bg-white shadow-md gap-2 rounded-lg font-poppins">
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
                    className="bg-primary hover:bg-background text-white font-poppins rounded-lg px-4 py-2 text-center w-full"
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
