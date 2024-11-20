'use client'

import { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const expires = searchParams.get('expires');
    const signature = searchParams.get('signature');

    // Pastikan nilai tidak null sebelum meng-encode
    const encodedEmail = email ? encodeURIComponent(email) : '';
    const encodedExpires = expires ? encodeURIComponent(expires) : '';
    const encodedSignature = signature ? encodeURIComponent(signature) : '';



    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== passwordConfirm) {
            setError('Password dan konfirmasi password tidak cocok');
            return;
        }

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/reset-password?email=${encodedEmail}&expires=${encodedExpires}&signature=${encodedSignature}`,
                { password, password_confirm: passwordConfirm }
            );

            setSuccess('Password berhasil diperbarui!');
            setError('');
        } catch {
            setError('Gagal memperbarui password. Pastikan token masih berlaku.');
            setSuccess('');
        }
    };

    return (
        <main>
            <section className="flex justify-center px-4 lg:px-40 py-20 bg-gray-100 min-h-screen">
                <div className="modal-box font-poppins p-0 w-76 lg:w-96 h-fit flex flex-col">
                    <div className="flex items-center bg-primary rounded-t-lg h-24 lg:h-40 p-16">
                        <img src="/image/logo-hydrativa-putih.png" alt="HydraTiva Logo" />
                    </div>
                    <div className="flex flex-col px-8 pt-8 pb-12">
                        <h2 className="text-xl lg:text-2xl font-bold text-center text-black w-full mb-4">
                            Atur ulang kata sandi
                        </h2>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {success && <p style={{ color: 'green' }}>{success}</p>}
                        <form id="forgotPassword" className="flex flex-col gap-2" onSubmit={handleResetPassword}>
                            <div className="flex flex-col">
                                <label htmlFor="email">Kata Sandi Baru</label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Masukkan password baru"
                                    className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="email">Konfirmasi Kata Sandi</label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    placeholder="Konfirmasi kata sandi"
                                    className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="flex flex-col mt-2">
                                <button
                                    type="submit"
                                    className="p-2 rounded-md bg-primary text-white hover:bg-additional2"
                                >
                                    Kirim
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>

    );
}
