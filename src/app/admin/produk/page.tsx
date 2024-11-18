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
    const [csv, setCsv] = useState<File | null>(null);  // Allows both File and null
    const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview
    const [selectedImage, setSelectedImage] = useState<File | null>(null); // State for selected image file
    const [newProduct, setNewProduct] = useState<Produk>({
        id: 0,
        nama_produk: '',
        kategori: '',
        deskripsi: '',
        harga: 0,
        stok: 0,
        gambar: '',
    });
    const [currentProduct, setCurrentProduct] = useState<Produk>({
        nama_produk: '',
        kategori: '',
        deskripsi: '',
        harga: 0,
        stok: 0,
        gambar: '',
    });

    const handleCsvChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const csv = e.target.files ? e.target.files[0] : null;
    
        if (csv && csv.type !== 'text/csv') {
            Swal.fire('Error', 'Only CSV files are allowed!', 'error');
            setCsv(null);
            return;
        }
    
        // Only proceed if the file is valid
        if (csv) {
            setCsv(csv); // Set file to state
    
            const result = await Swal.fire({
                icon: 'question',
                title: 'Apakah ingin impor csv?',
                showCancelButton: true,
                confirmButtonText: 'Ya',
                cancelButtonText: 'Tidak',
                customClass: {
                    container: 'font-poppins',
                    confirmButton: 'bg-primary hover:bg-background text-white px-4 rounded-lg font-poppins',
                    cancelButton: 'bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg font-poppins',
                },
            });
    
            if (result.isConfirmed) {
                const formData = new FormData();
                formData.append('csv', csv);  // Append the file directly
    
                try {
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/produk`,
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'Authorization': `Bearer ${Cookies.get('token')}`,
                            },
                        }
                    );
    
                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil impor!',
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        setCsv(null);  // Clear the file state after success
                        fetchProducts();
                    }
                } catch (error) {
                    console.error('CSV Import Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal impor CSV!',
                        text: 'Terjadi kesalahan saat mengimpor CSV. Silakan coba lagi.',
                    });
                    setCsv(null);  // Reset the file state after error
                }
            } else {
                setCsv(null);  // Reset if user cancels
            }
        }
    };    

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produk`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const result = await response.json();
            setProducts(result.data || []); // Set products directly to the result array
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Update selected image in state
            setSelectedImage(file);

            // Set image preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string); // Set image preview

                // Also update the gambar property in newProduct
                setNewProduct(prevProduct => ({
                    ...prevProduct,
                    gambar: reader.result as string, // Store the image preview or the file data
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Update selected image in state
            setSelectedImage(file);

            // Set image preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string); // Set image preview

                // Update currentProduct's gambar field with the new image data
                setCurrentProduct((prev) => ({
                    ...prev,
                    gambar: reader.result as string, // Update image field
                }));
            };
            reader.readAsDataURL(file);
        }
    };



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setNewProduct((prevProduct) => ({
            ...prevProduct,
            [id]: value,
        }));
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setCurrentProduct((prevProduct) => ({
            ...prevProduct,
            [id]: value,
        }));
    };

    const addProduct = async () => {
        try {
            const formData = new FormData();
            formData.append('nama_produk', newProduct.nama_produk);
            formData.append('kategori', newProduct.kategori);
            formData.append('deskripsi', newProduct.deskripsi || '');
            formData.append('harga', newProduct.harga.toString());
            formData.append('stok', newProduct.stok.toString());


            // Menambahkan gambar ke formData jika ada
            if (selectedImage) {
                formData.append('gambar', selectedImage);
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/produk`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Ubah menjadi multipart
                        'Authorization': `Bearer ${Cookies.get('token')}`,
                    },
                }
            );

            if (response.status === 200) {
                // Update state tanpa memanggil fetchProducts
                setProducts((prevProducts) => {
                    if (Array.isArray(prevProducts)) {
                        return [...prevProducts, newProduct]; // Spread the previous state and add new product
                    }
                    console.error("prevProducts is not an array:", prevProducts);
                    return prevProducts;
                });// Tambahkan produk baru ke state
                Swal.fire({
                    icon: 'success',
                    title: 'Produk berhasil ditambahkan!',
                    showConfirmButton: false,
                    timer: 1500,
                });
                const modal = document.getElementById('modalTambahData') as HTMLDialogElement | null;
                modal?.close();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Terjadi kesalahan',
                text: 'Mohon coba lagi nanti.',
                showConfirmButton: false,
                timer: 1500,
            });
            console.error('Error adding product:', error);
        }
    };

    const editProduct = async () => {
        try {
            const formData = new FormData();
            formData.append('nama_produk', currentProduct?.nama_produk || '');
            formData.append('kategori', currentProduct?.kategori || '');
            formData.append('deskripsi', currentProduct?.deskripsi || '');
            formData.append('harga', String(currentProduct?.harga || 0));
            formData.append('stok', String(currentProduct?.stok || 0));

            // Add the updated image to the formData if there's a new image
            if (selectedImage) {
                formData.append('gambar', selectedImage);
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/produk/${currentProduct?.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${Cookies.get('token')}`,
                    },
                }
            );

            if (response.status === 200) {
                // Update state with the updated product
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product.id === currentProduct?.id ? currentProduct : product
                    )
                );
                Swal.fire({
                    icon: 'success',
                    title: 'Produk berhasil diubah!',
                    showConfirmButton: false,
                    timer: 1500,
                });
                const modal = document.getElementById('modalEditData') as HTMLDialogElement | null;
                modal?.close(); // Close the modal after update
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Terjadi kesalahan',
                text: 'Mohon coba lagi nanti.',
                showConfirmButton: false,
                timer: 1500,
            });
            console.error('Error updating product:', error);
        }
    };

    const deleteProduct = async (id: number | undefined) => {
        if (!id) return; // Early exit if there's no valid ID

        // Show a confirmation dialog before deleting
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Data yang dihapus tidak dapat dikembalikan!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                // Proceed with deletion if user confirms
                await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/produk/delete/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('token')}`,
                    }
                });

                // Update the state by removing the deleted product from the list
                setProducts((prevProducts) => prevProducts.filter(product => product.id !== id));

                // Show success message after successful deletion
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil menghapus produk',
                    showConfirmButton: false,
                    timer: 1500,
                });

                // Close the delete confirmation modal
                const modal = document.getElementById('modalHapusData') as HTMLDialogElement | null;
                modal?.close();
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
        }
    };



    useEffect(() => {

        fetchProducts();
    }, []);

    return (
        <>
            <Navbar />
            <div className="flex">
                <div className="flex">
                    <div className="flex min-h-screen w-80 flex-col bg-primary py-4 text-gray-700">
                        <Sidebar />
                    </div>
                </div>
                <div className="mt-12 flex flex-col w-full">
                    <section
                        id="dashboard"
                        className="min-h-screen font-poppins w-full flex flex-col mt-2 pt-10 px-4 pb-20 bg-slate-50"
                    >
                        <div className="flex flex-col gap-4 bg-white p-4 w-full rounded-lg shadow-md">
                            <div className="flex justify-between items-center">
                                <div className="font-semibold">Data Produk</div>
                                <div className="flex gap-2">
                                    <label
                                        htmlFor="csv_file"
                                        className="flex items-center justify-center rounded-md bg-primary cursor-pointer py-2 px-4 text-white hover:bg-background focus:outline-none focus:ring focus:ring-primary"
                                    >
                                        Import
                                        <input
                                            type="file"
                                            id="csv_file"
                                            name="csv_file"
                                            onChange={handleCsvChange}
                                            className="hidden"  // Hide the default file input button
                                        />
                                    </label>
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
                            </div>
                            {/* Tambah Data Modal */}
                            <dialog id="modalTambahData" className="modal">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg">Form Tambah Data</h3>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault(); // Prevent default form submission
                                            addProduct(); // Call the addProduct function
                                        }}
                                        className="flex flex-col mt-4 w-full gap-2 rounded-lg font-poppins"
                                    >
                                        <div className="flex flex-col">
                                            <label htmlFor="nama_produk">Nama</label>
                                            <input
                                                type="text"
                                                id="nama_produk"
                                                placeholder="Masukan nama produk"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                value={newProduct.nama_produk}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="kategori">Kategori</label>
                                            <input
                                                type="text"
                                                id="kategori"
                                                placeholder="Masukan kategori produk"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                value={newProduct.kategori}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="deskripsi">Deskripsi</label>
                                            <textarea
                                                id="deskripsi"
                                                placeholder="Masukan deskripsi produk"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                value={newProduct.deskripsi}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="harga">Harga</label>
                                            <input
                                                type="text"
                                                id="harga"
                                                placeholder="Masukan harga"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                value={newProduct.harga}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="stok">Stok</label>
                                            <input
                                                type="text"
                                                id="stok"
                                                placeholder="Masukan stok"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                value={newProduct.stok}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        {/* Input File Gambar */}
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="gambar">Gambar</label>
                                            {/* Preview Gambar */}
                                            {imagePreview && (
                                                <div className="mt-2">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview Gambar"
                                                        className="w-32 h-32 object-cover rounded-md"
                                                    />
                                                </div>
                                            )}
                                            <label
                                                htmlFor="gambar"
                                                className="w-32 flex items-center justify-center rounded-md bg-primary cursor-pointer py-2 px-4 text-white hover:bg-background focus:outline-none focus:ring focus:ring-primary"
                                            >
                                                Pilih Foto
                                                <input
                                                    type="file"
                                                    id="gambar"
                                                    name="gambar"
                                                    onChange={handleImageChange}
                                                    className="hidden"  // Hide the default file input button
                                                />
                                            </label>
                                        </div>

                                        <div className="flex flex-col mt-2">
                                            <button type="submit" className="p-2 rounded-md bg-primary text-white">
                                                Tambah
                                            </button>
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
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault(); // Prevent default form submission
                                            if (currentProduct) {
                                                // Call a function to handle updating the product
                                                editProduct();
                                            }
                                        }}
                                        className="flex flex-col mt-4 w-full gap-2 rounded-lg font-poppins"
                                    >
                                        <div className="flex flex-col">
                                            <label htmlFor="nama_produk">Nama</label>
                                            <input
                                                type="text"
                                                id="nama_produk"
                                                placeholder="Masukan nama produk"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                value={currentProduct?.nama_produk || ''}
                                                onChange={(e) => handleEditInputChange(e)}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="kategori">Kategori</label>
                                            <input
                                                type="text"
                                                id="kategori"
                                                placeholder="Masukan kategori produk"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                value={currentProduct?.kategori || ''}
                                                onChange={(e) => handleEditInputChange(e)}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="deskripsi">Deskripsi</label>
                                            <textarea
                                                id="deskripsi"
                                                placeholder="Masukan deskripsi produk"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                value={currentProduct?.deskripsi || ''}
                                                onChange={(e) => handleEditInputChange(e)}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="harga">Harga</label>
                                            <input
                                                type="text"
                                                id="harga"
                                                placeholder="Masukan harga"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                value={currentProduct?.harga || 0}
                                                onChange={(e) => handleEditInputChange(e)}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="stok">Stok</label>
                                            <input
                                                type="text"
                                                id="stok"
                                                placeholder="Masukan stok"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                value={currentProduct?.stok || 0}
                                                onChange={(e) => handleEditInputChange(e)}
                                            />
                                        </div>

                                        {/* Input File Gambar */}
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="gambar">Gambar</label>
                                            {/* Preview Gambar */}
                                            {imagePreview && (
                                                <div className="mt-2">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview Gambar"
                                                        className="w-32 h-32 object-cover rounded-md"
                                                    />
                                                </div>
                                            )}
                                            <label
                                                htmlFor="gambar"
                                                className="w-32 flex items-center justify-center rounded-md bg-primary cursor-pointer py-2 px-4 text-white hover:bg-background focus:outline-none focus:ring focus:ring-primary"
                                            >
                                                Ubah Foto
                                                <input
                                                    type="file"
                                                    id="gambar"
                                                    name="gambar"
                                                    onChange={handleImageChange}
                                                    className="hidden"  // Hide the default file input button
                                                />
                                            </label>
                                        </div>



                                        <div className="flex flex-col mt-2">
                                            <button type="submit" className="p-2 rounded-md bg-primary text-white">
                                                Simpan
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <form method="dialog" className="modal-backdrop">
                                    <button>close</button>
                                </form>
                            </dialog>


                            {/* Hapus Data Modal */}
                            {/* <dialog id="modalHapusData" className="modal">
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
                            </dialog> */}

                            {loading ? (
                                <div className='flex justify-center'>
                                    <span className="loading loading-spinner loading-md"></span>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="table rounded-lg">
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
                                            {products.length ? (products.map((product, index) => (
                                                <tr key={product.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{product.nama_produk}</td>
                                                    <td><p className="line-clamp-3">{product.deskripsi}</p></td>
                                                    <td>Rp. {product.harga}</td>
                                                    <td>{product.stok}</td>
                                                    <td><img className="rounded-lg w-16" src={product.gambar} alt={product.nama_produk} /></td>
                                                    <td className='flex gap-2'>
                                                        <button
                                                            onClick={() => {
                                                                setCurrentProduct(product);
                                                                setImagePreview(product.gambar);
                                                                const modal = document.getElementById('modalEditData') as HTMLDialogElement | null;
                                                                modal?.showModal();
                                                            }}
                                                            className="w-8 h-8 rounded-md text-white place-items-center bg-green-600 hover:bg-green-700"
                                                        >
                                                            <FaPencil />
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                // setCurrentProduct(product);
                                                                // const modal = document.getElementById('modalHapusData') as HTMLDialogElement | null;
                                                                // modal?.showModal();
                                                                deleteProduct(product.id)
                                                            }}
                                                            className="w-8 h-8 rounded-md text-white place-items-center bg-red-600 hover:bg-red-700"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))) : (
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
