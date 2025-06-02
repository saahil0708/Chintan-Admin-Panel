import React from 'react';
import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/clerk-react';
import Routes from './Routes/Routes';

import './App.css'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-[Poppins] flex flex-col items-center justify-center">

      <SignedOut>
        <div className="w-full max-w-md p-6 font-[Poppins] bg-white rounded-md shadow-md">
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>
        {/* <header className="w-full font-[Poppins] max-w-7xl bg-white shadow-md flex justify-end items-center p-4">
          <UserButton />
        </header> */}

        <main className="w-full font-[Poppins] max-w-full">
          <Routes />
        </main>
      </SignedIn>

    </div>
  );
}
