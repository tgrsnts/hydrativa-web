'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'


export default function Sidebar() {
    const pathname = usePathname()
    // const [isClient, setIsClient] = useState(false);
    // const [userData, setUserData] = useState<User | null>(null);

    // const { user, logout } = useAuth({ middleware: 'user' });

    // const onClickLogout = () => {
    //     Swal.fire({
    //         title: "Anda yakin?",
    //         text: "Anda akan logout!",
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonColor: "#6A9944",
    //         cancelButtonColor: "#d33",
    //         confirmButtonText: "Confirm",
    //         cancelButtonText: "Cancel"
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             logout();
    //         } else {
    //             Swal.fire("Cancelled", "Logout cancelled", "error");
    //         }
    //     });
    // };

    return (
        <nav className="mt-12 flex flex-col gap-1 pr-12 font-sans text-base font-normal text-blue-gray-700">
            <Link
                href="/akun"
                className={`mt-8 ${pathname == '/akun' ? 'text-primary bg-white' : 'text-white'} font-poppins font-semibold flex items-center w-full py-4 pl-16 leading-tight transition-all rounded-r-lg outline-none text-start hover:bg-white hover:text-primary focus:bg-white focus:text-primary active:bg-white active:text-primary`}
            >
                <div className="grid mr-4 place-items-center">
                    <i className="fa-solid fa-user" />
                </div>
                Profil
            </Link>
            <Link
                href="/admin/produk"
                className={`${pathname == '/admin/produk' ? 'text-primary bg-white' : 'text-white'} font-poppins font-semibold flex items-center w-full py-4 pl-16 leading-tight transition-all rounded-r-lg outline-none text-start hover:bg-white hover:text-primary focus:bg-white focus:text-primary active:bg-white active:text-primary`}
            >
                <div className="grid mr-4 place-items-center">
                    <i className="fa-solid fa-location-dot" />
                </div>
                Produk
            </Link>
            <Link
                href="/histori-transaksi"
                className={`${pathname == '/histori-transaksi' ? 'text-primary bg-white' : 'text-white'} font-poppins font-semibold flex items-center w-full py-4 pl-16 leading-tight transition-all rounded-r-lg outline-none text-start hover:bg-white hover:text-primary focus:bg-white focus:text-primary active:bg-white active:text-primary`}
            >
                <div className="grid mr-4 place-items-center">
                    <i className="fa-solid fa-bag-shopping" />
                </div>
                Histori Transaksi
            </Link>
            <div
                role='button'
                // onClick={onClickLogout}
                className="text-white font-poppins font-semibold flex items-center w-full py-4 pl-16 leading-tight transition-all rounded-r-lg outline-none text-start hover:bg-white hover:text-primary focus:bg-white focus:text-primary active:bg-white active:text-primary"
            >
                <div className="grid mr-4 place-items-center">
                    <i className="fa-solid fa-right-from-bracket" />
                </div>
                Log Out
            </div>
        </nav>
    )
}
