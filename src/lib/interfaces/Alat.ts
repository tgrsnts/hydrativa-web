export interface Alat {
    alat_id: string;
    created_at: string;
    updated_at: string;
    kebun?: Kebun;
}

export interface Kebun {
    kebun_id: number;
    id_user: number;
    user: {
        id_user: number;
        name: string;
    }
    id_alat: string;
    nama_kebun: string;
    luas_lahan: number;
    lokasi_kebun: string;
    gambar: string;
}
