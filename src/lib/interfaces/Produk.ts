export interface Produk {
    id: number;
    nama: string;
    harga: number;
    gambar: string;
    deskripsi?: string; // Optional field in case you want to use a description
}
