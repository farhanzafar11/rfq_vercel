"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-gc-bg-card border-b border-gc-border py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="GarajCloud Logo" width={140} height={32} className="h-8 w-auto text-gc-accent" />
      </div>
      
      {session && session.user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {session.user.image && (
              <Image 
                src={session.user.image} 
                alt={session.user.name || "User avatar"} 
                width={32} 
                height={32} 
                className="rounded-full"
              />
            )}
            <span className="text-gc-text-secondary text-sm hidden sm:block">
              {session.user.name}
            </span>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-sm font-medium text-gc-accent hover:text-orange-400 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
