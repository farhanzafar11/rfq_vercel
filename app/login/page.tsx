import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { SignInButton } from "./SignInButton";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gc-bg-dark">
      <div className="w-full max-w-sm border border-gc-border bg-gc-bg-card rounded-2xl shadow-xl flex flex-col p-8 items-center text-center">
        <Image 
          src="/logo.svg" 
          alt="GarajCloud" 
          width={180} 
          height={40} 
          className="h-10 w-auto mb-4"
        />
        <h1 className="text-xl font-semibold text-gc-text-primary mb-8">
          Automated Proposal Portal
        </h1>
        
        <div className="w-full mb-8 flex justify-center">
          <SignInButton />
        </div>

        <p className="text-xs text-gc-text-secondary mt-4 border-t border-gc-border pt-6 w-full">
          Access restricted to authorized accounts
        </p>
      </div>
    </div>
  );
}
