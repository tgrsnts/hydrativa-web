import React from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="px-4 lg:px-36 py-8 bg-primary text-white">
      <div className="container mx-auto flex flex-wrap">
        {/* Kolom Pertama */}
        <div className="w-full lg:w-1/2 lg:pr-4">
          {/* Logo */}
          <img
            src="/image/logo-hydrativa-putih.png" // Sesuaikan path jika perlu
            className="h-8 lg:h-16"
            alt="Logo HydraTiva"
          />
          <p className="font-poppins text-white text-justify mb-4">
            HydraTiva adalah aplikasi yang dirancang untuk meningkatkan
            produktivitas dan efisiensi di sektor perkebunan tanaman Stevia.
            Dengan menggabungkan teknologi IoT (Internet of Things) dan analisis
            data yang canggih, HydraTiva memungkinkan petani untuk memantau
            kondisi lahan secara real-time, mengatur penyiraman secara otomatis
            maupun manual, dan membantu penyaluran hasil perkebunan stevia.
            Aplikasi ini memberikan informasi kadar tanah kebun stevia, histori
            penyiraman lahan stevia, dan rekomendasi tindakan berdasarkan data
            yang terkumpul dari sensor yang tersebar di seluruh lahan stevia.
          </p>
        </div>

        {/* Kolom Kedua */}
        <div className="w-full h-52 lg:h-auto lg:w-1/2 lg:pl-4">
          <h3 className="text-xl font-poppins font-bold mb-4">Hubungi Kami</h3>
          <div className="flex gap-3 items-center mb-4">          
            <FaPhone className="w-4"/>
            <span className="font-poppins">+62 89670522489</span>
          </div>
          <div className="flex gap-3 items-center mb-4">
            <FaEnvelope className="w-4"/>
            <span className="font-poppins">HydraTiva@gmail.com</span>
          </div>
          <div className="flex gap-3 items-center mb-4">
            <FaLocationDot className="w-4"/>
            <span className="font-poppins">
              Jl. Lodaya No. 2, Kota Bogor, Indonesia
            </span>
          </div>

          {/* Google Maps Embed (Dikomentari untuk sementara) */}
          {/* 
          <div id="lokasi" className="flex flex-col items-center mt-2">
            <h2 className="text-xl font-poppins font-bold mb-2 text-start w-full">
              Lokasi
            </h2>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d990.8655974168457!2d106.808518!3d-6.589305!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c57776d4956d%3A0x7d23c109e11fa013!2%20Makan%20HydraTiva!5e0!3m2!1sid!2sid!4v1716653576602!5m2!1sid!2sid"
              className="w-full"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          */}
        </div>
      </div>
    </footer>
  );
}
