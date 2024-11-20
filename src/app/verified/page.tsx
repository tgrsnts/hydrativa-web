'use client'

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

function VerifiedContent() {
    const [isVerified, setIsVerified] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        // Assuming you have query parameters in the URL        
        const email = searchParams.get('email');
        const expires = searchParams.get('expires');
        const signature = searchParams.get('signature');
        
        if (email && expires && signature) {
            // Make the GET request with query parameters using axios
            axios
                .get(`${process.env.NEXT_PUBLIC_API_URL}/verified`, {
                    params: {
                        email: email,
                        expires: expires,
                        signature: signature
                    }
                })
                .then((response) => {
                    if (response.data.message = "Email ter-verifikasi.") {
                        setIsVerified(true);
                    } else {
                        setIsVerified(false);
                        setError(response.data.message || 'Verification failed');
                    }
                })
                .catch((err) => {
                    setError('An error occurred while verifying the email');
                    console.error(err);
                });
        }
    }, []);

    return(
        <div className="modal-box font-poppins p-0 w-76 lg:w-96 h-fit flex flex-col">
                    <div className="flex items-center bg-primary rounded-t-lg h-24 lg:h-40 p-16">
                        <img src="/image/logo-hydrativa-putih.png" alt="HydraTiva Logo" />
                    </div>
                    <div className="flex flex-col px-8 pt-8 pb-12">
                        {isVerified === null ? (
                            <p>Loading...</p>
                        ) : isVerified ? (
                            <>
                                <h2 className="text-xl lg:text-2xl font-bold text-center text-black w-full mb-4">
                                    Email Anda Sudah Terverifikasi
                                </h2>
                                <p>Terimakasih telah memverifikasi email anda.</p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl lg:text-2xl font-bold text-center text-black w-full mb-4">
                                    Gagal Memverifikasi Email
                                </h2>
                                <p>{error}</p>
                            </>
                        )}
                        <Link
                            href="/"
                            className="mt-2 p-2 rounded-md bg-primary text-white hover:bg-background text-center"
                        >
                            Kembali ke beranda
                        </Link>
                    </div>
                </div>
    );
}

export default function Verified() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <main>
                <section className="flex justify-center px-4 lg:px-40 py-20 bg-gray-100 min-h-screen">
                    <VerifiedContent />
                </section>
            </main>
        </Suspense>
    );
}
