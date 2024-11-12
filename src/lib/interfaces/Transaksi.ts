import { Alamat } from "./Alamat";
import { Produk } from "./Produk";

interface Transaksi {
    transaksi_id: number;
    status: string;
    total_harga: number;
    pembeli: string;
    alamat: Alamat;
    produk: Produk[];
  }

export default Transaksi;