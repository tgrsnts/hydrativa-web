export interface Produk {
    id: number;
    nama: string;
    harga: number;
    gambar: string;
    stok: number;
    deskripsi?: string; // Optional field in case you want to use a description
    final_rating: number;
    rating: string;
}
