import { Alamat } from "./Alamat";

interface Transaksi {
  transaksi_id: number;
  status: string;
  total_harga: number;
  pembeli: string;
  alamat: Alamat;
  resi: string;
  transaksi_item: Array<{
    transaksi_item_id: number;
    nama_produk: string;
    quantity: number;
    harga: number
    gambar: string;
    israted: number;
    rating: {
      rating_value: number;
      comment: string
      gambar: string;
    }
  }>;
}

export default Transaksi;