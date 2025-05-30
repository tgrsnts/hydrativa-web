export interface Alamat {   
    alamat_id: number;
    id_user?: number;
    label_alamat: string;
    nama_penerima: string;
    no_telepon: string;
    detail: string;
    kelurahan: string;
    kecamatan: string;
    kabupaten: string;    
    provinsi: string;
    kodepos: string;  
    catatan_kurir?: string;
    longitude?: number;
    latitude?: number;
    isPrimary: number;    
}