import { Alamat } from "./Alamat";
import { Produk } from "./Produk";

interface Transaksi {
  transaksi_id: number;
  status: string;
  total_harga: number;
  pembeli: string;
  alamat: Alamat;
  produk: Array<{
    transaksi_item_id: number;
    produk_id: number;
    nama_produk: string;
    israted: number;
    harga: number;
    quantity: number;
    gambar: string;    
  }>;
}

export default Transaksi;