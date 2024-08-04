import React from 'react'

import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import LoginButton from '@/components/auth/LoginButton'
import { useRouter } from 'next/navigation';


const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

const Home = () => {
  return (
    <main className='min-h-screen flex flex-col h-full justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800'>
      <div className='space-y-6 text-center'>
        <h1 className={cn('text-6xl font-semibold text-white drop-shadow-md', font.className)}> 
        🔐Auth
        </h1>
        <p className='text-white text-lg text-center'>
          A simple authentication service
        </p>
        <LoginButton asChild>
          <Button variant='secondary' size={"lg"} className='text-lg font-semibold'>
            Sign in
          </Button>
        </LoginButton>
      </div>
    </main>
  )
}

export default Home