'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/app/admin/components/Sidebar';
import { useState, useEffect } from 'react';

import axios from 'axios';
import Cookies from 'js-cookie';
import { FaPencil, FaTrash } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import { Materi } from '@/lib/interfaces/Materi';

export default function Page() {
    const [materis, setMateris] = useState<Materi[]>([]);
    const [loading, setLoading] = useState(true);    
    const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview
    const [selectedImage, setSelectedImage] = useState<File | null>(null); // State for selected image file
    const [newMateri, setNewMateri] = useState<Materi>({
        id: 0,
        judul: '',
        deskripsi: '',
        sumber: '',
        gambar: '',
    });
    const [currentMateri, setCurrentMateri] = useState<Materi>({
        judul: '',
        deskripsi: '',
        sumber: '',
        gambar: '',
    });   

    const fetchMateris = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materi`);
            if (!response.ok) {
                throw new Error('Failed to fetch materi');
            }
            const result = await response.json();
            setMateris(result || []); // Set products directly to the result array
        } catch (error) {
            console.error('Failed to fetch materi:', error);
            setMateris([]);
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
                setNewMateri(prevMateri => ({
                    ...prevMateri,
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
                setCurrentMateri((prev) => ({
                    ...prev,
                    gambar: reader.result as string, // Update image field
                }));
            };
            reader.readAsDataURL(file);
        }
    };



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setNewMateri((prevMateri) => ({
            ...prevMateri,
            [id]: value,
        }));
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setCurrentMateri((prevMateri) => ({
            ...prevMateri,
            [id]: value,
        }));
    };

    const addMateri = async () => {
        try {
            const formData = new FormData();
            formData.append('judul', newMateri.judul);
            formData.append('deskripsi', newMateri.deskripsi || '');
            formData.append('sumber', newMateri.sumber || '');


            // Menambahkan gambar ke formData jika ada
            if (selectedImage) {
                formData.append('gambar', selectedImage);
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/materi`,
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
                setMateris((prevMateris) => {
                    if (Array.isArray(prevMateris)) {
                        return [...prevMateris, newMateri]; // Spread the previous state and add new product
                    }
                    console.error("prevMateris is not an array:", prevMateris);
                    return prevMateris;
                });// Tambahkan produk baru ke state
                Swal.fire({
                    icon: 'success',
                    title: 'Materi berhasil ditambahkan!',
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

    const editMateri = async () => {
        try {
            const formData = new FormData();
            formData.append('judul', currentMateri?.judul || '');
            formData.append('deskripsi', currentMateri?.deskripsi || '');
            formData.append('sumber', currentMateri?.sumber || '');


            // Add the updated image to the formData if there's a new image
            if (selectedImage) {
                formData.append('gambar', selectedImage);
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/materi/${currentMateri?.id}`,
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
                setMateris((prevMateris) =>
                    prevMateris.map((materi) =>
                        materi.id === currentMateri?.id ? currentMateri : materi
                    )
                );
                Swal.fire({
                    icon: 'success',
                    title: 'Materi berhasil diubah!',
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

    const deleteMateri = async (id: number | undefined) => {
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
                await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/materi/delete/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('token')}`,
                    }
                });

                // Update the state by removing the deleted product from the list
                setMateris((prevMateris) => prevMateris.filter(materi => materi.id !== id));

                // Show success message after successful deletion
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil menghapus materi',
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

        fetchMateris();
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
                                <div className="font-semibold">Data Materi</div>
                                <div className="flex gap-2">
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
                                            addMateri(); // Call the addProduct function
                                        }}
                                        className="flex flex-col mt-4 w-full gap-2 rounded-lg font-poppins"
                                    >
                                        <div className="flex flex-col">
                                            <label htmlFor="judul">Judul Materi</label>
                                            <input
                                                type="text"
                                                id="judul"
                                                placeholder="Masukan judul materi"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                value={newMateri.judul}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="deskripsi">Deskripsi</label>
                                            <textarea
                                                id="deskripsi"
                                                placeholder="Masukan isi materinya"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                value={newMateri.deskripsi}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="sumber">Sumber</label>
                                            <textarea
                                                id="sumber"
                                                placeholder="Masukan sumber"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                value={newMateri.sumber}
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
                                            if (currentMateri) {
                                                // Call a function to handle updating the product
                                                editMateri();
                                            }
                                        }}
                                        className="flex flex-col mt-4 w-full gap-2 rounded-lg font-poppins"
                                    >
                                        <div className="flex flex-col">
                                            <label htmlFor="judul">Judul Materi</label>
                                            <input
                                                type="text"
                                                id="judul"
                                                placeholder="Masukan judul materi"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                value={currentMateri.judul}
                                                onChange={handleEditInputChange}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="deskripsi">Deskripsi</label>
                                            <textarea
                                                id="deskripsi"
                                                placeholder="Masukan isi materinya"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                value={currentMateri.deskripsi}
                                                onChange={handleEditInputChange}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="sumber">Sumber</label>
                                            <textarea
                                                id="sumber"
                                                placeholder="Masukan sumber"
                                                className="w-full p-2 rounded-md bg-gray-100"
                                                value={currentMateri.sumber}
                                                onChange={handleEditInputChange}
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
                                                    onChange={handleEditImageChange}
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
                                                <th>Judul</th>
                                                <th className="w-52">Isi</th>
                                                <th>Sumber</th>
                                                <th>Gambar</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {materis.length ? (materis.map((materi, index) => (
                                                <tr key={materi.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{materi.judul}</td>
                                                    <td><p className="line-clamp-3">{materi.deskripsi}</p></td>
                                                    <td>{materi.sumber}</td>
                                                    <td><img className="rounded-lg w-16" src={materi.gambar} alt={materi.judul} /></td>
                                                    <td className='flex gap-2'>
                                                        <button
                                                            onClick={() => {
                                                                setCurrentMateri(materi);
                                                                setImagePreview(materi.gambar);
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
                                                                deleteMateri(materi.id)
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
                                                        Tidak ada materi.
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
