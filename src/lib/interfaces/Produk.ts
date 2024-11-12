export interface Produk {
    id: number;
    nama_produk: string;
    kategori: string;
    harga: number;
    gambar: string;
    stok: number;
    deskripsi?: string; // Optional field for the product description
    final_rating: number;
    jumlah_rating: number;
    jumlah_ulasan: number;
    rating: Array<{
        profile_picture: string;
        nama_user: string;
        rating_user: number;
        komen_user: string;
        gambar_komen: string;
        tanggal: string;
    }>; // Array of rating details
    distribusi_rating: {
        [key: number]: {
            jumlah: number;
            persentase: number;
        };
    }; // Object mapping each rating (1-5) to its count and percentage
    persentase_puas: number;
    jumlah_terjual: number;
}
