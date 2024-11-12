export interface Produk {
    id?: number;                  // Make id optional
    nama_produk: string;
    kategori: string;
    harga: number;
    gambar: string;
    stok: number;
    deskripsi?: string;           // Optional field for the product description
    final_rating?: number;        // Make final_rating optional
    jumlah_rating?: number;       // Make jumlah_rating optional
    jumlah_ulasan?: number;       // Make jumlah_ulasan optional
    rating?: Array<{
        profile_picture: string;
        nama_user: string;
        rating_user: number;
        komen_user: string;
        gambar_komen: string;
        tanggal: string;
    }>;                           // Optional array of rating details
    distribusi_rating?: {         // Optional distribusi_rating
        [key: number]: {
            jumlah: number;
            persentase: number;
        };
    };
    persentase_puas?: number;     // Optional persentase_puas
    jumlah_terjual?: number;      // Optional jumlah_terjual
}
