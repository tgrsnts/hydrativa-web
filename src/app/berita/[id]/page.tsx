'use client'

import { use, useState, useEffect } from 'react';
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Materi } from '@/lib/interfaces/Materi';
import Swal from 'sweetalert2';
import axios from 'axios';

const Berita = ({ params }: { params: Promise<{ id: string }> }) => {
    const [loading, setLoading] = useState(true);
    const [materi, setMateri] = useState<Materi | null>(null);
    const { id } = use(params); 

    const handleAxiosError = (error: unknown) => {
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
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materi/${id}`);
                const result = await response.json();
                console.log("API Response:", result); // Log to check response structure
                setMateri(result); // Set product to the object in response
            } catch (error) {
                handleAxiosError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);
    return (
        <>
            <Navbar />
            {loading ? (
                <main>
                    <section id="detail" className="py-16 lg:px-36 bg-slate-50 mt-16 mx-auto">
                        <div className="flex flex-wrap justify-center">
                            <div className="flex w-full p-2">
                                <div className="flex flex-col lg:flex-row w-full bg-white rounded-lg p-4 shadow-md">
                                    <div className="flex rounded-lg justify-start">
                                        <div className="skeleton w-64 h-64"></div>
                                    </div>
                                    <div className="flex flex-col w-full px-0 lg:px-4 mt-4 lg:mt-0 gap-2 rounded-lg transition duration-300 font-poppins">
                                        <div className="flex flex-col">
                                            <div className="flex flex-col items-start pt-2 gap-2">
                                                <div className='skeleton h-6 w-32'></div>
                                                <div className='skeleton h-10 w-40'></div>
                                                <div className="skeleton h-4 w-44"></div>
                                            </div>
                                            
                                        </div>
                                        <div className='pt-2'></div>
                                        <div className='skeleton h-4 w-full'></div>
                                        <div className='skeleton h-4 w-full'></div>
                                        <div className='skeleton h-4 w-24'></div>
                                    </div>
                                </div>
                            </div>
                        </div>   
                    </section>
                </main>
               
            ) : (
                materi ? (
                <main>
                    <section id="detail" className="py-16 lg:px-36 bg-slate-50 mt-16 p-2 w-full">
                        <div className="w-full">
                            <div className="flex w-full p-2">
                                <div className="flex flex-col lg:flex-row w-full bg-white rounded-lg p-4 shadow-md">
                                    <div className="flex rounded-lg justify-start align-top">
                                    <div className="w-64 h-64">
                                            <img src={materi.gambar} className="w-64 h-64 rounded-lg" alt={materi.judul} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full px-0 lg:px-4 mt-4 lg:mt-0 gap-2 rounded-lg transition duration-300 font-poppins">
                                        <div className="flex flex-col">
                                            <div className="flex flex-col items-start pt-2 gap-1">
                                                <p className="lg:text-3xl font-bold">{materi.judul}</p>
                                                <p>Sumber: {materi.sumber}</p>
                                                <p>{materi.waktu}</p>
                                            </div>
                                            
                                        </div>
                                        <div className='pt-2'>
                                            <p>{materi.deskripsi}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>   
                    </section>
                </main>
                ) : (
                    <p>Produk tidak ada.</p>
                )
            )}
            <Footer />
        </>
    )
}

export default Berita