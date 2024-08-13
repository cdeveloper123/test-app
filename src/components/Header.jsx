'use client'

import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar'
import { useClerk, useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

export default function Header({ pathname }) {
  const { isLoaded, user } = useUser()
  const { signOut } = useClerk()
  const [loading, setLoading] = useState(false)

  if (!isLoaded) {
    return null
  }
  
  const handleSignOut = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await firebaseSignOut(auth);
      await signOut({ redirectUrl: '/' });
    } catch (error) {
      console.error('Sign out failed', error)
      setLoading(false)
    }
  }
  return (
    <Navbar>
      <NavbarSection>
        <NavbarItem href="/" className="text-black" current={pathname === '/'}>
          Home
        </NavbarItem>
        <NavbarItem href="/products" className="text-black" current={pathname === '/products'}>
          Products
        </NavbarItem>
        <NavbarItem href="/about" className="text-black" current={pathname === '/about'}>
          About
        </NavbarItem>
      </NavbarSection>
      <NavbarSpacer />
      <NavbarSection>
        {!user ? (
          <NavbarItem href="/sign-in" className="text-black" current={pathname === '/sign-in'}>
            Sign In
          </NavbarItem>
        ) : (
          <>
            <NavbarItem href="/profile" className="text-black" current={pathname === '/profile'}>
              Profile
            </NavbarItem>
            <NavbarItem
              href="#"
              className="text-black"
              onClick={handleSignOut}
              disabled={loading} 
            >
              {loading ? 'Logging out...' : 'Logout'}
            </NavbarItem>
          </>
        )}
      </NavbarSection>
    </Navbar>
  )
}
