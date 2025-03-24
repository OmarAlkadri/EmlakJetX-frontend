import React, { useEffect, useRef, useState } from "react";
import onologo from '../../../assets/onologo.png';
import Image from "next/image";
import Link from "next/link";
/**EmlakJetX */
export const NavBar = () => {
    const [dark, setDark] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedMode = localStorage.getItem("mode") === "true";
        setDark(savedMode);
        document.body.classList.toggle("dark", savedMode);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);


    const toggleDropdown = (): void => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const darkModeHandler = (): void => {
        setDark((prev: boolean) => {
            const newDarkMode = !prev;
            localStorage.setItem("mode", newDarkMode.toString());
            document.body.classList.toggle("dark", newDarkMode);
            return newDarkMode;
        });
    };

    return (
        <div className="gap-y-2">
            <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Image src={onologo} className="h-10 w-20 me-3" alt='footer.logoAlt' />
                    </Link>

                    <div className="relative ml-3" ref={dropdownRef}>
                        <div>
                            <button aria-expanded={isDropdownOpen} onClick={toggleDropdown} data-collapse-toggle="navbar-multi-level" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-multi-level">
                                <span className="sr-only">Open main menu</span>
                                <svg className={`h-6 w-6`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                                </svg>
                            </button>
                        </div>

                        {isDropdownOpen && (
                            <div
                                className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="user-menu-button"
                                tabIndex={-1}
                            >
                                <Link
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700"
                                    role="menuitem"
                                    tabIndex={-1}
                                    id="user-menu-item-0"
                                >
                                    Home
                                </Link>
                                <li className="flex items-center p-1 text-sm gap-x-2 text-slate-600">
                                    <div className="flex items-center">Light</div>
                                    <div className='flex'>
                                        <div className="relative">
                                            <label className="flex w-full items-center justify-center cursor-pointer">
                                                <input id="switch-2" type="checkbox" className="peer sr-only" checked={dark} readOnly />
                                                <div onClick={darkModeHandler} className="peer h-4 w-11 rounded-full border bg-slate-200
                                    after:absolute after:-top-1 after:left-0 after:h-6 after:w-6 after:rounded-full after:border
                                    after:border-gray-300 after:bg-white after:transition-all after:content-[''] 
                                    peer-checked:bg-white dark:peer-checked:bg-black peer-checked:after:translate-x-full 
                                    peer-focus:ring-green-300"></div>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex items-center">Dark</div>
                                </li>
                                <Link
                                    href="auth/login"
                                    className="block px-4 py-2 text-sm text-gray-700"
                                    role="menuitem"
                                    tabIndex={-1}
                                    id="user-menu-item-2"
                                >
                                    logIn
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="hidden w-full md:block md:w-auto" id="navbar-multi-level">
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li className="flex items-center p-1 text-sm gap-x-2 text-slate-600">
                                <Link href="/" className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent" aria-current="page">
                                    Home
                                </Link>
                            </li>
                            <li className="flex items-center p-1 text-sm gap-x-2 text-slate-600">
                                <Link href="dashboard/reservations" className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent" aria-current="page">
                                    add
                                </Link>
                            </li>
                            <li className="flex items-center p-1 text-sm gap-x-2 text-slate-600">
                                <div className="flex items-center">Light</div>
                                <div className='flex'>
                                    <div className="relative">
                                        <label className="flex w-full items-center justify-center cursor-pointer">
                                            <input id="switch-2" type="checkbox" className="peer sr-only" checked={dark} readOnly />
                                            <div onClick={darkModeHandler} className="peer h-4 w-11 rounded-full border bg-slate-200
                                    after:absolute after:-top-1 after:left-0 after:h-6 after:w-6 after:rounded-full after:border
                                    after:border-gray-300 after:bg-white after:transition-all after:content-[''] 
                                    peer-checked:bg-white peer-checked:after:translate-x-full 
                                    peer-focus:ring-green-300"></div>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex items-center">Dark</div>
                            </li>
                            <li className="flex items-center p-1 pt-2 text-sm gap-x-2 text-slate-600">

                                <Link
                                    href="auth/login"
                                    className="cursor-pointer text-white dark:text-black bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-white dark:hover:bg-gray-300 dark:focus:ring-gray-700 dark:border-gray-500"                            >
                                    LogIn
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};