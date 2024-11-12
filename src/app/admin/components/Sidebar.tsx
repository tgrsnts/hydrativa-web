'use client'
import axios from 'axios'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'


export default function Sidebar() {
    const pathname = usePathname()
    // const [isClient, setIsClient] = useState(false);
    // const [userData, setUserData] = useState<User | null>(null);

    // const { user, logout } = useAuth({ middleware: 'user' });

    const router = useRouter();

    const logout = async () => {
        try {
            await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                }
            });
            Cookies.remove('token');
            router.push('/');
        } catch (error) {
            handleAxiosError(error); // Use the error handler
        }
    };    

    const handleAxiosError = (error: unknown) => {
        if (axios.isAxiosError(error) && error.response) {
            Swal.fire({
                icon: 'error',
                title: error.response.data.message || 'Error',
                showConfirmButton: false,
                timer: 1500,
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Terjadi kesalahan',
                text: 'Mohon coba lagi nanti.',
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    const onClickLogout = () => {
        Swal.fire({
            title: "Anda yakin?",
            text: "Anda akan logout!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#6A9944",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
            } else {
                Swal.fire("Cancelled", "Logout cancelled", "error");
            }
        });
    };

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
                href="/admin/pesanan"
                className={`${pathname == '/admin/pesanan' ? 'text-primary bg-white' : 'text-white'} font-poppins font-semibold flex items-center w-full py-4 pl-16 leading-tight transition-all rounded-r-lg outline-none text-start hover:bg-white hover:text-primary focus:bg-white focus:text-primary active:bg-white active:text-primary`}
            >
                <div className="grid mr-4 place-items-center">
                    <i className="fa-solid fa-bag-shopping" />
                </div>
                Pesanan
            </Link>
            <div
                role='button'
                onClick={onClickLogout}
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
