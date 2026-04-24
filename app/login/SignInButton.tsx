"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export function SignInButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="flex items-center justify-center gap-3 w-full bg-white text-gray-900 rounded-full py-3 px-6 text-sm font-medium hover:bg-gray-100 transition-colors shadow-sm"
    >
      <Image 
        src="https://www.svgrepo.com/show/475656/google-color.svg" 
        alt="Google" 
        width={20} 
        height={20} 
      />
      Sign in with Google
    </button>
  );
}
