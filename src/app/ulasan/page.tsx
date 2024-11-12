'use client'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import Swal from 'sweetalert2'
import { FaStar } from 'react-icons/fa'

export default function HistoriTransaksi() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [reviews, setReviews] = useState({});

    // Fungsi untuk menangani rating
    const handleRating = (productId, rating) => {
        setReviews((prevReviews) => ({
            ...prevReviews,
            [productId]: { ...prevReviews[productId], rating },
        }));
    };

    // Fungsi untuk menangani komentar
    const handleComment = (productId, comment) => {
        setReviews((prevReviews) => ({
            ...prevReviews,
            [productId]: { ...prevReviews[productId], comment },
        }));
    };

    const handleImageUpload = (productId, file) => {
        const reader = new FileReader();
        reader.onload = () => {
            setReviews((prevReviews) => ({
                ...prevReviews,
                [productId]: {
                    ...prevReviews[productId],
                    image: file,  // Store the actual file for upload
                    imagePreview: reader.result, // Store the preview for display
                },
            }));
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };
    

    const submitReviews = async (e) => {
        e.preventDefault(); // Prevent the default form submission
    
        try {
            // Loop through each product review
            for (const transaksiId in reviews) {
                const review = reviews[transaksiId];
    
                if (review && (review.rating || review.comment || review.image)) {
                    const formData = new FormData();
    
                    // Add review data to FormData
                    formData.append("rating", review.rating);
                    formData.append("comment", review.comment);
    
                    // If there is an image, add the file to FormData
                    if (review.image) {
                        formData.append("gambar", review.image);  // Add the actual image file
                    }
    
                    // Send the review for each product
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ulas/${transaksiId}`, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "Authorization": `Bearer ${Cookies.get('token')}`,
                        },
                    });
    
                    // Success alert
                    Swal.fire({
                        icon: "success",
                        title: "Ulasan berhasil dikirim!",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    fetchData();
                }
            }
        } catch (error) {
            handleAxiosError(error); // Handle any errors
        }
    };
    



    // Fetch Ulasan data
    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ulasan`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`
                }
            });

            if (response.status === 200 || response.status === 201) {
                setTransactions(response.data);
            } else {
                console.warn("Failed to fetch transactions:", response.data);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while fetching transaction history.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleAxiosError = (error: any) => {
        if (axios.isAxiosError(error) && error.response) {
            Swal.fire({
                icon: 'error',
                title: error.response.data.message || 'Error',
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
    };

    useEffect(() => {
        fetchData();
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
                        className="min-h-screen font-poppins w-full flex gap-2 flex-col mt-2 pt-10 px-4 pb-20 bg-slate-50"
                    >
                        <div className="flex flex-col gap-2 rounded-lg bg-white w-full py-4 shadow-md">
                            <div className="px-4 py-2">
                                <p className='font-semibold'>Ulasan</p>
                                <p>Melihat daftar ulasan yang sudah anda lakukan.</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            {loading ? (
                                // Skeleton placeholders
                                Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="flex gap-4 flex-col bg-white w-full p-4 rounded-lg shadow-md animate-pulse">
                                        <div className="flex justify-end w-full gap-5">
                                            <div className="h-4 skeleton rounded w-24"></div>
                                        </div>
                                        <div className="flex w-full gap-5">
                                            <div className="w-20 h-20 skeleton rounded-lg"></div>
                                            <div className="flex flex-col w-full gap-2">
                                                <div className="h-4 skeleton rounded w-1/2"></div>
                                                <div className="h-4 skeleton rounded w-1/3"></div>
                                            </div>
                                        </div>
                                        <div className="flex w-full gap-5">
                                            <div className="w-20 h-20 skeleton rounded-lg"></div>
                                            <div className="flex flex-col w-full gap-2">
                                                <div className="h-4 skeleton rounded w-1/2"></div>
                                                <div className="h-4 skeleton rounded w-1/3"></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="h-8 skeleton rounded w-32"></div>
                                            <div className="h-4 skeleton rounded w-20"></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Render transactions if not loading
                                transactions.map((transaction) => (
                                    <div key={transaction.transaksi_id} className="flex gap-4 flex-col bg-white w-full p-4 rounded-lg shadow-md">
                                        <div className="flex justify-end w-full gap-5">
                                            {/* <p>Pesanan diterima: {transaction.status}</p> */}
                                        </div>
                                        {transaction.produk.map((product) => (
                                            <form key={product.transaksi_item_id} onSubmit={submitReviews} className="flex w-full gap-5 first:pt-0 pt-2 pb-4 border-b-2 last:border-b-0">
                                                <img className="w-20 h-20 rounded-lg" src={product.gambar} alt={product.produk_name} />
                                                <div className="flex flex-col w-full">
                                                    <div>{product.produk_name}</div>
                                                    <div className="flex justify-between">
                                                        <div>x{product.quantity}</div>
                                                        <div>Rp. {product.harga.toLocaleString()}</div>
                                                    </div>
                                                    {
                                                        product.israted ? (
                                                            <div className="flex flex-col gap-2 mt-2">
                                                                <div>Ulasan Anda:</div>
                                                                <div className="flex">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <FaStar
                                                                            key={star}
                                                                            className={
                                                                                star <= product.rating.rating_value
                                                                                    ? "text-yellow-400"
                                                                                    : "text-gray-300"
                                                                            }
                                                                            style={{ cursor: "pointer" }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <div>{product.rating.comment}</div>
                                                                {product.rating.gambar && (
                                                                    <img
                                                                        src={product.rating.gambar}
                                                                        alt="Review image"
                                                                        className="w-20 h-20 mt-2 rounded-md"
                                                                    />
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col gap-2 mt-2">
                                                                <div>Bagaimana kualitas produk ini?</div>
                                                                <div className="flex">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <label key={star}>
                                                                            <input
                                                                                type="radio"
                                                                                name={`rating-${product.transaksi_item_id}`}
                                                                                value={star}
                                                                                className="hidden"
                                                                                onChange={() => handleRating(product.transaksi_item_id, star)}
                                                                            />
                                                                            <FaStar
                                                                                className={
                                                                                    star <= (reviews[product.transaksi_item_id]?.rating || 0)
                                                                                        ? "text-yellow-400"
                                                                                        : "text-gray-300"
                                                                                }
                                                                                style={{ cursor: "pointer" }}
                                                                            />
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                                <textarea
                                                                    name="comment"
                                                                    className="w-full p-2 rounded-md bg-gray-100"
                                                                    placeholder="Deskripsikan produk ini"
                                                                    onChange={(e) => handleComment(product.transaksi_item_id, e.target.value)}
                                                                    value={reviews[product.transaksi_item_id]?.comment || ""}
                                                                ></textarea>
                                                                <label htmlFor={`gambar-${product.transaksi_item_id}`}>Masukkan gambar</label>
                                                                <input
                                                                    type="file"
                                                                    id={`gambar-${product.transaksi_item_id}`}
                                                                    name="gambar"
                                                                    className="w-32 rounded-md bg-gray-100 file:mr-5 file:py-1 file:px-3 file:border-none file:w-full file:bg-gray-100 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-green-50 hover:file:text-primary focus:outline-none focus:ring focus:ring-primary"
                                                                    onChange={(e) => handleImageUpload(product.transaksi_item_id, e.target.files[0])}
                                                                />
                                                                {reviews[product.transaksi_item_id]?.imagePreview && (
                                                                    <img
                                                                        src={reviews[product.transaksi_item_id].imagePreview}
                                                                        alt="Preview"
                                                                        className="w-20 h-20 mt-2 rounded-md"
                                                                    />
                                                                )}
                                                                <button type="submit" className="w-52 p-2 rounded-md bg-primary text-white">Kirim Ulasan</button>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </form>
                                        ))}
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-2">
                                            </div>
                                            <div className="flex justify-end gap-4">
                                                <div>Total Pesanan:</div>
                                                <div className="text-primary">Rp. {transaction.total_harga.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
