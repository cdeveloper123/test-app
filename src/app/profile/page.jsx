'use client'

import { useUser, useClerk } from '@clerk/nextjs'
import { Heading } from '@/components/heading'
import { Button } from '@/components/button'
import { Input, InputGroup } from '@/components/input'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/firebaseConfig'
import { signOut as firebaseSignOut } from 'firebase/auth';

export default function Profile() {
  const { user } = useUser()
  
  const { signOut } = useClerk()
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || '')
  const [name, setName] = useState(user?.fullName || '')
  const router = useRouter()

  if (!user) {
    router.push('/sign-in')
    return null
  }

  const handleSignOut=async ()=>{
    await firebaseSignOut(auth);
    await signOut({ redirectUrl: '/' });
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Heading>Profile</Heading>
      <div className="mt-6">
        <div className="space-y-4">
          <InputGroup>
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </InputGroup>
          <InputGroup>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
            />
          </InputGroup>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={() =>handleSignOut()}>Logout</Button>
          </div>
        </div>
      </div>
    </main>
  )
}
