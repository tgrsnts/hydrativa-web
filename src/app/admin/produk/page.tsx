'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/app/admin/components/Sidebar';
import { useState, useEffect } from 'react';
import { Produk } from '@/lib/interfaces/Produk';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaPencil, FaTrash } from 'react-icons/fa6';
import Swal from 'sweetalert2';

export default function Page() {
    const [products, setProducts] = useState<Produk[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentProduct, setCurrentProduct] = useState<Produk | null>(null); // State to hold the selected product

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produk`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const result = await response.json();
            setProducts(result || []); // Set products directly to the result array
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: number | undefined) => {
        if (!id) return; // Early exit if there's no valid ID
        try {
            await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/produk/delete/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                }
            });
            fetchProducts(); // Refresh products after deleting
            const modal = document.getElementById('modalHapusData') as HTMLDialogElement | null;
            modal?.close(); // Close delete confirmation modal
        } catch (error) {
            if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: error.response.data.message,
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
        }
    };
    

    useEffect(() => {
        
        fetchProducts();
    }, []);

    return (
        <>
            <Navbar />
            <div className="flex">
                <div className="flex min-h-screen w-80 flex-col bg-primary py-4 text-gray-700">
                    <Sidebar />
                </div>
                <div className="mt-12 flex flex-col w-full">
                    <section
                        id="dashboard"
                        className="min-h-screen font-poppins w-full flex flex-col mt-2 pt-10 px-4 pb-20 bg-background"
                    >
                        <div className="flex flex-col gap-3 bg-white rounded-md p-8">
                            <div className="flex justify-between items-center">
                                <div className="font-semibold text-xl">Data Produk</div>
                                <button
                                    type="button"
                                    className="bg-primary hover:bg-background text-white px-4 py-2 rounded-md"
                                    onClick={() => {
                                        const modal = document.getElementById('modalTambahData') as HTMLDialogElement | null;
                                        if (modal) {
                                            modal.showModal();
                                        }
                                    }}
                                >
                                    Tambah Data
                                </button>
                            </div>
                            {/* Tambah Data Modal */}
                            <dialog id="modalTambahData" className="modal">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg">Form Tambah Data</h3>
                                    <form className="flex flex-col mt-4 w-full gap-2 rounded-lg font-poppins">
                                        <div className="flex flex-col">
                                            <label htmlFor="nama">Nama</label>
                                            <input type="text" id="nama" placeholder="Masukan nama produk" className="w-full p-2 rounded-md bg-gray-100" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="deskripsi">Deskripsi</label>
                                            <textarea id="deskripsi" placeholder="Masukan deskripsi produk" className="w-full p-2 rounded-md bg-gray-100" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="harga">Harga</label>
                                            <input type="text" id="harga" placeholder="Masukan harga" className="w-full p-2 rounded-md bg-gray-100" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="stok">Stok</label>
                                            <input type="text" id="stok" placeholder="Masukan stok" className="w-full p-2 rounded-md bg-gray-100" />
                                        </div>
                                        <div className="flex flex-col mt-2">
                                            <button type="submit" className="p-2 rounded-md bg-primary text-white">Tambah</button>
                                        </div>
                                    </form>
                                </div>
                                <form method="dialog" className="modal-backdrop">
                                    <button>close</button>
                                </form>
                            </dialog>

                            {/* Edit Data Modal */}
                            <dialog id="modalEditData" className="modal">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg">Form Edit Data</h3>
                                    <form className="flex flex-col mt-4 w-full gap-2 rounded-lg font-poppins">
                                        <div className="flex flex-col">
                                            <label htmlFor="nama">Nama</label>
                                            <input
                                                type="text"
                                                id="nama"
                                                placeholder="Masukan nama produk"
                                                defaultValue={currentProduct?.nama}
                                                className="w-full p-2 rounded-md bg-gray-100"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="deskripsi">Deskripsi</label>
                                            <textarea
                                                id="deskripsi"
                                                placeholder="Masukan deskripsi produk"
                                                defaultValue={currentProduct?.deskripsi}
                                                className="w-full p-2 rounded-md bg-gray-100"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="harga">Harga</label>
                                            <input
                                                type="text"
                                                id="harga"
                                                placeholder="Masukan harga"
                                                defaultValue={currentProduct?.harga}
                                                className="w-full p-2 rounded-md bg-gray-100"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="stok">Stok</label>
                                            <input
                                                type="text"
                                                id="stok"
                                                placeholder="Masukan stok"
                                                defaultValue={currentProduct?.stok}
                                                className="w-full p-2 rounded-md bg-gray-100"
                                            />
                                        </div>
                                        <div className="flex flex-col mt-2">
                                            <button type="submit" className="p-2 rounded-md bg-primary text-white">Simpan</button>
                                        </div>
                                    </form>
                                </div>
                                <form method="dialog" className="modal-backdrop">
                                    <button>close</button>
                                </form>
                            </dialog>

                            {/* Hapus Data Modal */}
                            <dialog id="modalHapusData" className="modal">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg">Apakah Anda yakin ingin menghapus {currentProduct?.nama}?</h3>
                                    <div className="flex items-center justify-center h-[100px]">
                                        <i className="inline fa-solid fa-warning fa-2xl text-[100px]" />
                                    </div>
                                    <form className="flex gap-3 w-full">
                                        <button type="button" className="w-full p-2 rounded-md bg-white text-primary border-primary hover:bg-primary hover:text-white">
                                            Tidak
                                        </button>
                                        <button type="submit" className="w-full p-2 rounded-md bg-red-600 text-white hover:bg-red-800" onClick={() => deleteProduct(currentProduct?.id)}>
                                            Ya
                                        </button>
                                    </form>
                                </div>
                                <form method="dialog" className="modal-backdrop">
                                    <button>close</button>
                                </form>
                            </dialog>

                            {loading ? (
                                <p>Loading products...</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="table border-2">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Nama</th>
                                                <th className="w-52">Deskripsi</th>
                                                <th>Harga</th>
                                                <th>Stok</th>
                                                <th>Gambar</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.length? (products.map((product, index) => (
                                                <tr key={product.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{product.nama}</td>
                                                    <td><p className="line-clamp-3">{product.deskripsi}</p></td>
                                                    <td>Rp. {product.harga}</td>
                                                    <td>{product.stok}</td>
                                                    <td><img className="rounded-lg w-16" src={product.gambar} alt={product.nama} /></td>
                                                    <td>
                                                        <button
                                                            onClick={() => {
                                                                setCurrentProduct(product);
                                                                const modal = document.getElementById('modalEditData') as HTMLDialogElement | null;
                                                                modal?.showModal();
                                                            }}
                                                            className="w-8 h-8 rounded-md text-white place-items-center bg-green-600 hover:bg-green-700"
                                                        >                                                            
                                                            <FaPencil/>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setCurrentProduct(product);
                                                                const modal = document.getElementById('modalHapusData') as HTMLDialogElement | null;
                                                                modal?.showModal();
                                                            }}
                                                            className="w-8 h-8 rounded-md text-white place-items-center bg-red-600 hover:bg-red-700"
                                                        >
                                                            <FaTrash/>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))):(
                                                <tr>
                                                    <td colSpan={7} className="text-center">
                                                        Tidak ada produk.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
