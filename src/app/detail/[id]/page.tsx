'use client'

import React, { useState, useEffect } from 'react';
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Produk } from "@/lib/interfaces/Produk";

const Detail = ({ params }: { params: { id: string } }) => {
    const [product, setProduct] = useState<Produk | null>(null); // Use a single product object

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/produk/${params.id}`);
                const result = await response.json();
                console.log("API Response:", result); // Log to check response structure
                setProduct(result.data); // Set product to the object in response
            } catch (error) {
                console.error("Failed to fetch product:", error);
                setProduct(null); // Set to null on error
            }
        };

        fetchProduct();
    }, [params.id]);
    return (
        <>
            <Navbar />
            {product ? (

                <main>
                    <section id="detail" className="py-16 lg:px-36 bg-gray-100 mt-16 mx-auto">
                        <div className="flex flex-wrap justify-center">
                            <div className="flex w-full lg:w-2/3 p-2">
                                <div className="flex flex-col lg:flex-row bg-white rounded-lg p-4">
                                    <div className="flex w-full lg:w-1/3 rounded-lg justify-center">
                                        <div className="h-45">
                                            <img src="image/Group 185.png" className="h-45 rounded-lg" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full lg:w-2/3 px-0 lg:px-4 mt-4 lg:mt-0 gap-2 rounded-lg transition duration-300 font-poppins">
                                        <div className="flex flex-col">
                                            <p className="text-2xl font-bold">{product.nama}</p>
                                            <div className="flex flex-row lg:flex-col justify-between">
                                                <p className="lg:text-3xl font-bold">Rp. {product.harga}</p>
                                                <div className="flex flex-row items-center gap-3">
                                                    <p>Terjual 100+</p>
                                                    <p>•</p>
                                                    <div>
                                                        <i className="fa-solid fa-star text-yellow-400" /> (5
                                                        rating)
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p>
                                            HydraTiva adalah alat penyiraman otomatis untuk tanaman stevia
                                            yang terintegrasi dengan aplikasi.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex w-full lg:w-1/3 rounded-lg p-2">
                                <div className="flex-col w-full gap-2 rounded-lg p-4 font-poppins bg-white hidden lg:flex">
                                    {/* Large Screen */}
                                    <div>
                                        <div className="text-2xl font-bold">Atur jumlah</div>
                                        <div className="mt-2 flex items-center justify-between">
                                            <div className="flex items-center justify-center">
                                                <button className="text-primary px-3 py-2 border-2 border-primary rounded-l-lg hover:text-white hover:bg-primary w-full">
                                                    <i className="fa-solid fa-minus" />
                                                </button>
                                                <div className="px-4 py-2 border-y-2 border-primary">
                                                    <p className="text-center">1</p>
                                                </div>
                                                <button className="text-primary px-3 py-2 border-2 border-primary rounded-r-lg hover:text-white hover:bg-primary w-full">
                                                    <i className="fa-solid fa-plus" />
                                                </button>
                                            </div>
                                            <p>Stok total : {product.stok}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold">Subtotal</p>
                                            <p className="text-xl font-bold">Rp. {product.harga}</p>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <div className="hidden lg:flex flex-row lg:flex-col gap-3 items-center justify-center">
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
                                </div>
                            </div>
                        </div>
                        <div className="lg:hidden drop-shadow-2xl fixed bottom-0 lg:static w-full bg-white lg:bg-transparent p-2 flex flex-row lg:flex-col gap-2 items-center justify-center">
                            <button
                                href=""
                                onclick={() => document.getElementById('my_modal').showModal()}
                                className="bg-primary font-poppins font-semibold rounded-lg px-4 py-2 border-2 border-primary text-white text-center w-full hover:bg-white hover:text-primary"
                            >
                                + Keranjang
                            </button>
                            <button
                                href=""
                                onclick={() => document.getElementById('my_modal').showModal()}
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
                                    <img
                                        src="image/Group 185.png"
                                        className="flex flex-col w-1/2 rounded-lg"
                                    />
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
                            <div className="flex flex-col lg:flex-row justify-start gap-5 px-4 bg-white rounded-lg p-4 w-full font-poppins">
                                <div className="flex flex-col">
                                    <p className="text-2xl font-semibold">Rating</p>
                                    <div className="flex items-center justify-center gap-3">
                                        <i className="text-4xl fa-solid fa-star text-yellow-400" />
                                        <p className="text-5xl">
                                            4.0<span className="text-sm">/5.0</span>
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="font-semibold">100% pembeli merasa puas</p>
                                        <p>5 rating • 4 ulasan</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <i className="fa-solid fa-star text-yellow-400" />
                                            <p className="w-4 text-center">5</p>
                                            <progress className="progress w-full" value={0} max={100} />
                                            {/* <progress class="progress w-64 h-8 rounded-full bg-blue-500 border-4 border-green-500 shadow-lg" value="70" max="100"></progress> */}
                                            <p className="w-4 text-center">0</p>
                                        </div>
                                        <div className="flex items-center gap-2 w-full">
                                            <i className="fa-solid fa-star text-yellow-400" />
                                            <p className="w-4 text-center">4</p>
                                            <progress className="progress w-full" value={100} max={100} />
                                            {/* <progress class="progress w-64 h-8 rounded-full bg-blue-500 border-4 border-green-500 shadow-lg" value="70" max="100"></progress> */}
                                            <p className="w-4 text-center">4</p>
                                        </div>
                                        <div className="flex items-center gap-2 w-full">
                                            <i className="fa-solid fa-star text-yellow-400" />
                                            <p className="w-4 text-center">3</p>
                                            <progress className="progress w-full" value={0} max={100} />
                                            {/* <progress class="progress w-64 h-8 rounded-full bg-blue-500 border-4 border-green-500 shadow-lg" value="70" max="100"></progress> */}
                                            <p className="w-4 text-center">0</p>
                                        </div>
                                        <div className="flex items-center gap-2 w-full">
                                            <i className="fa-solid fa-star text-yellow-400" />
                                            <p className="w-4 text-center">2</p>
                                            <progress className="progress w-full" value={0} max={100} />
                                            {/* <progress class="progress w-64 h-8 rounded-full bg-blue-500 border-4 border-green-500 shadow-lg" value="70" max="100"></progress> */}
                                            <p className="w-4 text-center">0</p>
                                        </div>
                                        <div className="flex items-center gap-2 w-full">
                                            <i className="fa-solid fa-star text-yellow-400" />
                                            <p className="w-4 text-center">1</p>
                                            <progress className="progress w-full" value={10} max={100} />
                                            {/* <progress class="progress w-64 h-8 rounded-full bg-blue-500 border-4 border-green-500 shadow-lg" value="70" max="100"></progress> */}
                                            <p className="w-4 text-center">1</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col gap-3">
                                    <p className="text-2xl font-semibold">Ulasan</p>
                                    <div className="flex flex-col">
                                        <div className="first:pt-0 pt-2 pb-2 border-b-2 last:border-b-0">
                                            <div className="flex items-start gap-3">
                                                <img
                                                    className="w-10 rounded-full"
                                                    src="image/avatar-biru.jpg"
                                                    alt=""
                                                />
                                                <div>
                                                    <div className="flex flex-wrap items-end lg:gap-3 text-md">
                                                        <p className="font-semibold">Mochamad Tegar Santoso</p>
                                                        <p>2 jam yang lalu</p>
                                                    </div>
                                                    <div>
                                                        <i className="fa-solid fa-star text-yellow-400" />
                                                        <i className="fa-solid fa-star text-yellow-400" />
                                                        <i className="fa-solid fa-star text-yellow-400" />
                                                        <i className="fa-solid fa-star text-yellow-400" />
                                                        <i className="fa-solid fa-star" />
                                                    </div>
                                                    <p className="text-sm line-clamp-3 lg:line-clamp-none">
                                                        alat nya keren bgt, udah terintegrasi sama aplikasi juga
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="first:pt-0 pt-2 pb-2 border-b-2 last:border-b-0">
                                            <div className="flex items-start gap-3">
                                                <img
                                                    className="w-10 rounded-full"
                                                    src="image/avatar-biru.jpg"
                                                    alt=""
                                                />
                                                <div>
                                                    <div className="flex flex-wrap items-end lg:gap-3 text-md">
                                                        <p className="font-semibold">Mochamad Tegar Santoso</p>
                                                        <p>2 jam yang lalu</p>
                                                    </div>
                                                    <div>
                                                        <i className="fa-solid fa-star text-yellow-400" />
                                                        <i className="fa-solid fa-star text-yellow-400" />
                                                        <i className="fa-solid fa-star text-yellow-400" />
                                                        <i className="fa-solid fa-star text-yellow-400" />
                                                        <i className="fa-solid fa-star" />
                                                    </div>
                                                    <p className="text-sm line-clamp-3 lg:line-clamp-none">
                                                        mantap
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="first:pt-0 pt-2 pb-2 border-b-2 last:border-b-0">
                                            <div className="flex items-start gap-3">
                                                <img
                                                    className="w-10 rounded-full"
                                                    src="image/avatar-biru.jpg"
                                                    alt=""
                                                />
                                                <div>
                                                    <div className="flex flex-wrap items-end lg:gap-3 text-md">
                                                        <p className="font-semibold">Mochamad Tegar Santoso</p>
                                                        <p>2 jam yang lalu</p>
                                                    </div>
                                                    <div>
                                                        <i className="fa-solid fa-star text-yellow-400" />
                                                        <i className="fa-solid fa-star text-yellow-400" />
                                                        <i className="fa-solid fa-star text-yellow-400" />
                                                        <i className="fa-solid fa-star text-yellow-400" />
                                                        <i className="fa-solid fa-star" />
                                                    </div>
                                                    <p className="text-sm line-clamp-3 lg:line-clamp-none">
                                                        okane bgt
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="first:pt-0 pt-2 pb-2 border-b-2 last:border-b-0">
                                            <div className="flex items-start gap-3">
                                                <img
                                                    className="w-10 rounded-full"
                                                    src="image/avatar-biru.jpg"
                                                    alt=""
                                                />
                                                <div>
                                                    <div className="flex flex-wrap items-end lg:gap-3 text-md">
                                                        <p className="font-semibold">Mochamad Tegar Santoso</p>
                                                        <p>2 jam yang lalu</p>
                                                    </div>
                                                    <div>
                                                        <i className="fa-solid fa-star text-yellow-400" />
                                                        <i className="fa-solid fa-star text-yellow-400" />
                                                        <i className="fa-solid fa-star text-yellow-400" />
                                                        <i className="fa-solid fa-star text-yellow-400" />
                                                        <i className="fa-solid fa-star" />
                                                    </div>
                                                    <p className="text-sm line-clamp-3 lg:line-clamp-none">
                                                        cincayy
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="first:pt-0 pt-2 pb-2 border-b-2 last:border-b-0">
                                            <div className="flex items-start gap-3">
                                                <img
                                                    className="w-10 rounded-full"
                                                    src="image/avatar-biru.jpg"
                                                    alt=""
                                                />
                                                <div>
                                                    <div className="flex flex-wrap items-end lg:gap-3 text-md">
                                                        <p className="font-semibold">Mochamad Tegar Santoso</p>
                                                        <p>2 jam yang lalu</p>
                                                    </div>
                                                    <div>
                                                        <i className="fa-solid fa-star text-yellow-400" />
                                                        <i className="fa-solid fa-star" />
                                                        <i className="fa-solid fa-star" />
                                                        <i className="fa-solid fa-star" />
                                                        <i className="fa-solid fa-star" />
                                                    </div>
                                                    {/* <p class="text-sm line-clamp-3 lg:line-clamp-none">
                                      enak bgt, bumbunya gurih.
                                  </p> */}
                                                </div>
                                            </div>
                                        </div>
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