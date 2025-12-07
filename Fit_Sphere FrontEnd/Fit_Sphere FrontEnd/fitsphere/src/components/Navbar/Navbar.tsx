"use client"
import React, { useEffect, useState } from 'react'
import logo from '@/assets/create a logo name as _FITSPHERE_ that i can use in a fitness app-Picsart-BackgroundRemover.jpg'
import { IoIosBody } from 'react-icons/io'
import './Navbar.css'
import Image from 'next/image'
import Link from 'next/link'
import AuthPopup from '../AuthPopup/AuthPopup'

const Navbar = () => {
    const [isloggedin, setIsloggedin] = useState<boolean>(false)
    const [showpopup, setShowpopup] = useState<boolean>(false)

    const checklogin = async () => {
        try {
            // FIX: Reverting method back to POST. The backend is likely configured to accept
            // POST for this secure check endpoint, and the GET request was failing.
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/checklogin`, {
                method: 'POST', 
                credentials: 'include',
            });
            
            if (!res.ok) {
                 setIsloggedin(false);
                 return;
            }

            const data = await res.json();
            setIsloggedin(data.ok);
        } catch (err) {
            setIsloggedin(false);
        }
    }

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            setIsloggedin(false);
        } catch (err) {
            console.error("Logout error:", err);
        }
    }

    const handleSuccessfulLogin = () => {
        setIsloggedin(true); 
        setShowpopup(false);
    }

   
    // whenever the component mounts (e.g., after navigating to a new route).
    useEffect(() => {
        checklogin();
    }, []); 

    return (
        <nav>
            <Image src={logo} alt="Logo" />
            <Link href='/'>Home</Link>
            <Link href='/about'>About</Link>
            <Link href='/profile'><IoIosBody /></Link>

            {
                isloggedin ?
                    <button onClick={handleLogout}>Logout</button>
                    :
                    <button onClick={() => setShowpopup(true)}>Login</button>
            }

            {
                showpopup && (
                    <AuthPopup 
                        setShowpopup={setShowpopup} 
                        onLoginSuccess={handleSuccessfulLogin} 
                    />
                )
            }
        </nav>
    )
}

export default Navbar