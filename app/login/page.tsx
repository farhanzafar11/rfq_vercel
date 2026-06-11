import Image from "next/image";
import { FileText, Zap, ShieldCheck } from "lucide-react";
import { CredentialsForm } from "./CredentialsForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  return (
    <div className="flex min-h-screen bg-[var(--gc-gray-50)]">
      {/* Left Panel - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-[60%] bg-[var(--gc-navy-800)] relative flex-col justify-between p-12 overflow-hidden">
        {/* CSS Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none" 
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px"
          }}
        />
        
        <div className="relative z-10">
          <Image 
            src="/logo.svg" 
            alt="GarajCloud" 
            width={160} 
            height={40} 
            className="h-10 w-auto mb-16 logo-on-dark"
            priority
          />
          <h1 className="text-[36px] font-bold text-white leading-tight mb-4">
            Automated Proposal Portal
          </h1>
          <p className="text-[16px] text-[var(--gc-navy-400)] max-w-md mb-12">
            Streamline your BOQ submissions and get pricing quotes instantly.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-full bg-[var(--gc-navy-700)] flex items-center justify-center">
                <FileText className="w-5 h-5 text-[var(--gc-orange-500)]" />
              </div>
              <span className="font-medium">Upload BOQ PDFs securely</span>
            </div>
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-full bg-[var(--gc-navy-700)] flex items-center justify-center">
                <Zap className="w-5 h-5 text-[var(--gc-orange-500)]" />
              </div>
              <span className="font-medium">AI-powered quote generation</span>
            </div>
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-full bg-[var(--gc-navy-700)] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[var(--gc-orange-500)]" />
              </div>
              <span className="font-medium">Restricted to authorized personnel</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm font-medium">
          <span className="text-[var(--gc-navy-400)]">Powered by </span>
          <span className="text-[var(--gc-orange-500)]">GarajCloud</span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-[40%] bg-white flex flex-col justify-center items-center p-8 relative">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center text-center mb-8">
            <Image 
              src="/logo.svg" 
              alt="GarajCloud" 
              width={120} 
              height={30} 
              className="h-8 w-auto mb-6"
              priority
            />
            <h2 className="text-[22px] font-semibold text-[var(--gc-gray-900)] mb-2">
              Sign in to your account
            </h2>
            <p className="text-[13px] text-[var(--gc-gray-500)]">
              Access restricted to authorized GarajCloud personnel
            </p>
          </div>

          <CredentialsForm />
        </div>
      </div>
    </div>
  );
}
