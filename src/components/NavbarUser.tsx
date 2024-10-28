import React from 'react'

const NavbarUser = () => {
    return (
        <header className="font-poppins shadow top-0 w-full z-10 h-16 bg-white">
            <div className="bg-white relative flex align-items-center flex-row gap-5 overflow-hidden px-4 py-4 md:px-36 md:mx-auto md:flex-row md:items-center">
                <div className="flex flex-row w-full lg:w-96">
                    <form className="w-full mx-auto">
                        {/* <label for="default-search"
                          class="mb-2 text-sm font-medium text-gray-900 sr-only :text-white">Search
                      </label> */}
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <i className="fa-solid fa-magnifying-glass" />
                            </div>
                            <input
                                type="search"
                                id="default-search"
                                className="block w-full px-2 py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-primary"
                                placeholder="Cari di HydraTiva"
                            />
                            {/* <button type="submit"
                              class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 :bg-blue-600 :hover:bg-blue-700 :focus:ring-blue-800">Search</button> */}
                        </div>
                    </form>
                </div>
                <div className="hidden lg:flex w-full justify-end items-center gap-3 h-full">
                    <div className="flex">
                        {/* <button type="button" onClick="my_modal_1.showModal()"
                          class="focus:outline-none text-white hover:bg-[#FBF6F0] font-medium rounded-md text-sm w-12 aspect-square">
                          <i class="text-gray-600 fa-solid fa-bell fa-lg"></i>
                      </button> */}
                        <a
                            href="keranjang.html"
                            className="flex justify-center items-center focus:outline-none text-white hover:bg-gray-200 font-medium rounded-md text-sm w-12 aspect-square"
                        >
                            <i className="text-gray-600 fa-solid fa-cart-shopping fa-lg" />
                        </a>
                    </div>
                    <a
                        href="akun_saya.html"
                        className="flex items-center gap-2 hover:bg-gray-200 py-1 px-2 rounded-md"
                    >
                        <img
                            className="w-10 rounded-full"
                            src="image/avatar-biru.jpg"
                            alt=""
                        />
                        <p className="font-semibold text-nowrap">Mochamad Tegar Santoso</p>
                    </a>
                </div>
            </div>
        </header>
    )
}

export default NavbarUser