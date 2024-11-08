'use client'

import { use, useState, useEffect } from 'react';
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Produk } from "@/lib/interfaces/Produk";
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { FaStar } from 'react-icons/fa';



const Detail = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params); // Unwrap params with React.use()
    const [product, setProduct] = useState<Produk | null>(null);
    const [quantity, setQuantity] = useState(1); // Initialize quantity to 1
    const ratings = [5, 4, 3, 2, 1];

    const handleIncrement = () => {
        if (product && quantity < product.stok) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = async () => {
        try {
            // Replace with your API URL
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/keranjang/add`, {
                id_produk: product?.id,
                quantity: quantity,
            }, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}` // Assumes token is stored in cookies
                }
            });

            // Handle the response based on API response structure
            if (response.status === 200 || response.status === 201) {
                console.log("Product added to cart successfully:", response.data);
                Swal.fire({
                    title: 'Success!',
                    text: 'Product successfully added to the cart!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                console.warn("Failed to add product to cart:", response.data);
            }
        } catch (error) {
            console.error("Error adding product to cart:", error);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while adding the product to the cart.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };



    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/produk/${id}`);
                const result = await response.json();
                console.log("API Response:", result); // Log to check response structure
                setProduct(result); // Set product to the object in response
            } catch (error) {
                console.error("Failed to fetch product:", error);
                setProduct(null); // Set to null on error
            }
        };

        fetchProduct();
    }, [id]);
    return (
        <>
            <Navbar />
            {product ? (

                <main>
                    <section id="detail" className="py-16 lg:px-36 bg-slate-50 mt-16 mx-auto">
                        <div className="flex flex-wrap justify-center">
                            <div className="flex w-full lg:w-2/3 p-2">
                                <div className="flex flex-col lg:flex-row bg-white rounded-lg p-4 shadow-md">
                                    <div className="flex w-full lg:w-1/3 rounded-lg justify-center">
                                        <div className="h-45">
                                            <img src={product.gambar} className="h-45 rounded-lg" alt={product.nama} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full lg:w-2/3 px-0 lg:px-4 mt-4 lg:mt-0 gap-2 rounded-lg transition duration-300 font-poppins">
                                        <div className="flex flex-col">
                                            <p className="text-2xl font-bold">{product.nama}</p>
                                            <div className="flex flex-row lg:flex-col justify-between">
                                                <p className="lg:text-3xl font-bold">Rp. {product.harga}</p>
                                                <div className="flex flex-row items-center gap-3">
                                                    <p>Terjual {product.jumlah_terjual}</p>
                                                    <p>•</p>
                                                    <div className='flex items-center gap-1'>
                                                        <FaStar className='text-yellow-400' /> ({product.jumlah_rating} rating)
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p>
                                            {product.deskripsi}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex w-full lg:w-1/3 rounded-lg p-2">
                                <div className="flex-col w-full gap-2 rounded-lg p-4 font-poppins bg-white hidden lg:flex shadow-md">
                                    {/* Large Screen */}
                                    <div>
                                        <div className="text-2xl font-bold">Atur jumlah</div>
                                        <div className="mt-2 flex items-center justify-between">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={handleDecrement}
                                                    className="text-primary px-3 py-2 border-2 border-primary rounded-l-lg hover:text-white hover:bg-primary w-full"
                                                >
                                                    -
                                                </button>
                                                <div className="px-4 py-2 border-y-2 border-primary">
                                                    <p className="text-center">{quantity}</p> {/* Display the dynamic quantity */}
                                                </div>
                                                <button
                                                    onClick={handleIncrement}
                                                    className="text-primary px-3 py-2 border-2 border-primary rounded-r-lg hover:text-white hover:bg-primary w-full"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p>Stok total: {product.stok}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold">Subtotal</p>
                                            <p className="text-xl font-bold">Rp. {product.harga * quantity}</p> {/* Calculate subtotal */}
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <div className="hidden lg:flex flex-row lg:flex-col gap-3 items-center justify-center">
                                            <button
                                                onClick={handleAddToCart}
                                                className="bg-primary font-poppins font-semibold rounded-lg px-4 py-2 border-2 border-primary text-white text-center w-full hover:bg-white hover:text-primary"
                                            >
                                                + Keranjang
                                            </button>
                                            <a
                                                href="checkout.html"
                                                className="font-poppins font-semibold rounded-lg px-4 py-2 border-2 text-center w-full bg-white text-primary border-primary hover:bg-primary hover:text-white hover:border-white"
                                            >
                                                Beli
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:hidden drop-shadow-2xl fixed bottom-0 lg:static w-full bg-white shadow-md p-2 flex flex-row lg:flex-col gap-2 items-center justify-center">
                            <button
                                onClick={() => {
                                    const modal = document.getElementById('my_modal') as HTMLDialogElement | null;
                                    if (modal) {
                                        modal.showModal();
                                    }
                                }}
                                className="bg-primary font-poppins font-semibold rounded-lg px-4 py-2 border-2 border-primary text-white text-center w-full hover:bg-white hover:text-primary"
                            >
                                + Keranjang
                            </button>
                            <button
                                onClick={() => {
                                    const modal = document.getElementById('my_modal') as HTMLDialogElement | null;
                                    if (modal) {
                                        modal.showModal();
                                    }
                                }}
                                className="font-poppins font-semibold rounded-lg px-4 py-2 border-2 text-center w-full bg-white text-primary border-primary hover:bg-primary hover:text-white hover:border-white"
                            >
                                Beli
                            </button>
                        </div>
                        {/* Modal  */}
                        <dialog
                            id="my_modal"
                            className="modal modal-bottom mx-auto min-h-full max-w-screen-sm lg:hidden"
                        >
                            <div className="font-poppins modal-box bg-white text-black px-4 pt-2 pb-8">
                                <div className="flex flex-wrap">
                                    <img src={`/storage/${product.gambar}`} className="h-45 rounded-lg" alt={product.nama} />
                                    <div className="flex flex-col w-1/2 pl-4">
                                        <div className="flex justify-end">
                                            <form method="dialog">
                                                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                                            </form>
                                        </div>
                                        <div className="mt-auto">
                                            <p className="font-bold text-md">{product.nama}</p>
                                            <p className="font-semibold text-md">Rp. {product.harga}</p>
                                            <p>Stok total : {product.stok}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <div className="text-md font-semibold">Atur jumlah</div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center justify-center">
                                            <button className="text-primary text-sm px-3 py-1 border-2 border-primary rounded-l-lg hover:text-white hover:bg-primary w-full">
                                                <i className="fa-solid fa-minus" />
                                            </button>
                                            <div className="px-4 py-1 border-y-2 border-primary">
                                                <p className="text-sm text-center">1</p>
                                            </div>
                                            <button className="text-primary text-sm px-3 py-1 border-2 border-primary rounded-r-lg hover:text-white hover:bg-primary w-full">
                                                <i className="fa-solid fa-plus" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="flex items-center justify-between ">
                                        <p className="font-semibold">Subtotal</p>
                                        <p className="text-md font-bold">Rp. {product.harga}</p>
                                    </div>
                                </div>
                                <div className="relative h-8" />
                                <div className="absolute bottom-0 left-0 p-2 w-full flex flex-row lg:flex-col gap-2 items-center justify-center">
                                    <a
                                        href="keranjang.html"
                                        className="bg-primary font-poppins font-semibold rounded-lg px-4 py-2 border-2 border-primary text-white text-center w-full hover:bg-white hover:text-primary"
                                    >
                                        + Keranjang
                                    </a>
                                    <a
                                        href="checkout.html"
                                        className="font-poppins font-semibold rounded-lg px-4 py-2 border-2 text-center w-full bg-white text-primary border-primary hover:bg-primary hover:text-white hover:border-white"
                                    >
                                        Beli
                                    </a>
                                </div>
                            </div>
                        </dialog>
                        <div className="mt-0 p-2 flex flex-col lg:flex-row w-full">
                            <div className="flex flex-col lg:flex-row justify-start gap-5 px-4 bg-white shadow-md rounded-lg p-4 w-full font-poppins">
                                <div className="flex flex-col">
                                    <p className="text-2xl font-semibold">Rating</p>
                                    <div className="flex items-center justify-center gap-3">
                                        <i className="text-4xl fa-solid fa-star text-yellow-400" />
                                        <p className="text-5xl">
                                            {product.final_rating}<span className="text-sm">/5.0</span>
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="font-semibold">{product.persentase_puas}% pembeli merasa puas</p>
                                        <p>{product.jumlah_rating} rating • {product.jumlah_ulasan} ulasan</p>
                                    </div>
                                    <div className="flex flex-col">                                        
                                        {ratings.map((rating) => {
                                            // Get the data for the current rating
                                            const jumlah = product.distribusi_rating[rating-1]?.jumlah || 0;
                                            const persentase = product.distribusi_rating[rating-1]?.persentase || 0;

                                            return (
                                                <div key={rating} className="flex items-center gap-2 w-full">
                                                    <FaStar className="text-yellow-400" />
                                                    <p className="w-4 text-center">{rating}</p>
                                                    <progress className="progress w-full" value={persentase} max={100} />
                                                    <p className="w-4 text-center">{jumlah}</p>
                                                </div>
                                            );
                                        })} 
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col gap-3">
                                    <p className="text-2xl font-semibold">Ulasan</p>
                                    <div className="flex flex-col">
                                        {
                                            product.rating.map((item, index) => (
                                                <div key={index} className="first:pt-0 pt-2 pb-2 border-b-2 last:border-b-0">
                                                    <div className="flex items-start gap-3">
                                                        <img
                                                            className="w-10 rounded-full"
                                                            src={item.profile_picture}
                                                            alt=""
                                                        />
                                                        <div>
                                                            <div className="flex flex-wrap items-end lg:gap-3 text-md">
                                                                <p className="font-semibold">{item.nama_user}</p>
                                                                <p>{item.tanggal}</p>
                                                            </div>
                                                            <div className='flex'>
                                                                {Array.from({ length: 5 }, (_, index) => (
                                                                    <FaStar key={index}
                                                                        className={`${index < item.rating_user ? 'text-yellow-400' : ''}`} />
                                                                ))}
                                                            </div>
                                                            <p className="text-sm line-clamp-3 lg:line-clamp-none">
                                                                {item.komen_user}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            ) : (
                <p>Product not found</p>
            )}
            <Footer />
        </>
    )
}

export default Detail