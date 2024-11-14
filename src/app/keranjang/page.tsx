"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Keranjang } from "@/lib/interfaces/Keranjang";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import Link from "next/link";


export default function Keranjang() {
  const [data, setData] = useState<Keranjang[]>([]); // Set initial state to empty array
  const [selectedItems, setSelectedItems] = useState<number[]>([]); // State for selected items
  const [loading, setLoading] = useState(true);

  const router = useRouter() 

  const handleBeliClick = () => {
    if (selectedItems.length === 0) {
      Swal.fire({
        title: 'Oops!',
        text: 'Pilih barang yang ingin dibeli terlebih dahulu.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    // Proceed with the purchase
    const selectedItemsData = data.filter(item => selectedItems.includes(item.id));
    sessionStorage.setItem('selectedItems', JSON.stringify(selectedItemsData));
    router.push('/checkout');
  };



  // Handle individual item checkbox change
  const handleCheckboxChange = (id: number) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(itemId => itemId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Handle "Select All" checkbox change
  const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = data?.map(item => item.id) || [];
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };

  // Calculate the total for selected items
  const selectedTotal = data
    .filter(item => selectedItems.includes(item.id))
    .reduce((acc, item) => acc + (item.harga || 0) * (item.quantity || 0), 0);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/keranjang`, {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        });
        console.log("API Response:", response);
        setData(response.data); // Set data from API
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setData([]); // Set to null on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <section id="detail" className="py-16 lg:px-36 bg-background mt-16 mx-auto">
          <div className="flex flex-wrap gap justify-center">
            <div className="flex flex-col gap-4 w-full lg:w-2/3 p-2">
              <div className="flex flex-col gap-4 bg-white p-6 rounded-lg font-poppins">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    id="checkAll"
                    className="w-4 h-4 accent-primary"
                    onChange={handleSelectAllChange}
                    checked={data && selectedItems.length === data.length} // Check if all are selected
                  />
                  <div className="flex w-full justify-between">
                    <div>Pilih Semua</div>
                    <div>Hapus</div>
                  </div>
                </div>
              </div>
              {loading ? (
                <div className="flex flex-col gap-4 bg-white p-6 rounded-lg font-poppins">
                  <div className='flex justify-center'>
                    <span className="loading loading-spinner loading-md"></span>
                  </div>
                </div>
              ) : (
                data.length > 0 ? (
                  data.map((item) => (
                    <div key={item.id} className="flex flex-col gap-4 bg-white p-6 rounded-lg font-poppins">
                      <div className="flex gap-4">
                        <input
                          type="checkbox"
                          className="item-checkbox w-4 h-4 accent-primary"
                          checked={selectedItems.includes(item.id)} // Check if this item is selected
                          onChange={() => handleCheckboxChange(item.id)} // Handle individual checkbox
                        />
                        <img
                          className="w-20 rounded-md"
                          src={item.gambar}
                          alt={item.nama_produk}
                        />
                        <div className="flex flex-col w-full">
                          <div>{item.nama_produk}</div>
                          <div className="flex justify-between">
                            <div>x{item.quantity}</div>
                            <div>Rp. {item.harga}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col gap-4 bg-white p-6 rounded-lg font-poppins">
                    <p className="font-semibold text-2xl text-center">Keranjangmu masih kosong nih :(</p>
                    <p className="text-xl text-center">Yuk, isi dengan produk-produk stevia terbaik dari kami!</p>
                    <div className="flex justify-center">
                      <Link
                        href="/dashboard"
                        className="bg-primary font-poppins font-semibold rounded-lg px-12 py-2 border-2 border-primary text-white text-center w-fit hover:bg-white hover:text-primary"
                      >
                        Mulai Belanja
                      </Link>
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="w-full lg:w-1/3 p-2">
              <div className="flex flex-col p-6 bg-white gap-2 rounded-lg font-poppins">
                <div className="flex flex-col gap-4">
                  <div className="text-2xl font-bold">Ringkasan Belanja</div>
                  <div className="text-md font-medium">
                    <div className="flex justify-between">
                      <div>Total Belanja</div>
                      <div>Rp {selectedTotal?.toLocaleString()}</div> {/* Display selected total */}
                    </div>
                  </div>
                  <button
                    onClick={handleBeliClick}
                    className={`bg-primary font-poppins font-semibold rounded-lg px-4 py-2 border-2 border-primary text-white text-center w-full hover:bg-white hover:text-primary ${!data || data.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Beli
                  </button>

                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}

