import { useCallback, useEffect, useState } from 'react';
import { BsChevronDown, BsSearch, BsBell } from 'react-icons/bs';

import NavbarItem from "./Navbaritem";
import MobileMenu from "./MobileMenu";
import AccountMenu from './AccountMenu';

// Function for making Navbar dark while scrolling 
const TOP_OFFSET = 66;  // 66 is just the number at where the animation starts to looks good basically it is the offset to how much user is going to scroll down, so we want to catch it around 66 

const Navbar = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const [showBackground, setShowBackground] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY >= TOP_OFFSET) {
                setShowBackground(true);
            } else {
                setShowBackground(false);
            }
        }

        window.addEventListener('scroll', handleScroll);

        // Remove event listener on our unmanned functions
        // Unmanned functions in useEffect are written like below:
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const toggleMobileMenu = useCallback(() => {
        setShowMobileMenu((current) => !current);
    }, []);

    const toggleAccountMenu = useCallback(() => {
        setShowAccountMenu((current) => !current);
    }, []);

    return (
        // =============================== i may relace this with w-screen ===============================
        <nav className="w-full fixed z-40">     
            <div 
                className={`
                    px-4 
                    md:px-16 
                    py-6 
                    flex 
                    flex-row 
                    items-center 
                    transition 
                    duration-500
                    ${showBackground ? 'bg-zinc-900 bg-opacity-90' : ''}
                `}
            >
                <img className="h-4 lg:h-7" src="/images/logo.png" alt="Logo" />
                <div 
                    className="
                        flex-row 
                        ml-8 
                        gap-7 
                        hidden 
                        lg:flex
                    "
                >
                    <NavbarItem label="Home"/>
                    <NavbarItem label="Series"/>
                    <NavbarItem label="Films"/>
                    <NavbarItem label="New & Popular"/>
                    <NavbarItem label="My List"/>
                    <NavbarItem label="Browse by languages"/>
                </div>

                {/* Create div for Mobile menu (gonna be visible on mobile screens) */}
                <div onClick={toggleMobileMenu} className="lg:hidden flex flex-row items-center gap-2 ml-8 cursor-pointer relative">
                    <p className="text-white text-sm">Browse</p>
                    <BsChevronDown className={`text-white transition ${showMobileMenu ? 'rotate-180' : 'rotate-0'}`}/>    {/* Animated */}
                    <MobileMenu visible={showMobileMenu}/>
                </div>

                {/* Create div for Profile menu */}
                <div className='flex flex-row ml-auto gap-7 items-center'>
                    <div className='text-gray-200 hover:text-gray-300 cursor-pointer transition'>
                        <BsSearch/>    {/* Search icon  */}
                    </div>
                    <div className='text-gray-200 hover:text-gray-300 cursor-pointer transition'>
                        <BsBell/>    {/* Bell icon  */}
                    </div>

                    <div onClick={toggleAccountMenu} className="flex flex-row items-center gap-2 cursor-pointer relative">
                        <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-md overflow-hidden">
                            <img src="/images/default-blue.png" alt="" />
                        </div>
                        <BsChevronDown className={`text-white transition ${showAccountMenu ? 'rotate-180' : 'rotate-0'}`}/>  {/* Animated */}
                        <AccountMenu visible={showAccountMenu}/>
                    </div>
                    
                </div>
            </div>
        </nav>
    );
}

export default Navbar;