"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UploadCloud, FileText, Settings, LogOut, Menu, Zap } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Submit BOQ", href: "/dashboard", icon: UploadCloud },
    { name: "Proposal Automation", href: "https://n8n.garajcloud.com/form/dce7fcfe-35ac-4524-a810-05f90d206dc7", icon: Zap, external: true },
    { name: "My Submissions", href: "#", icon: FileText },
    { name: "Settings", href: "#", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--gc-gray-50)]">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-[240px] bg-[var(--gc-navy-800)] text-white border-r border-[var(--gc-navy-700)] flex-shrink-0 animate-slide-down">
        <div className="p-6">
          <Image 
            src="/garaj-logo.svg" 
            alt="GarajCloud" 
            width={140} 
            height={32} 
            className="logo-on-dark" 
            priority
          />
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navLinks.map((link, index) => {
            const isActive = link.href === pathname || (link.name === "Submit BOQ" && pathname === "/dashboard");
            const isExternal = link.external === true;
            return (
              <a 
                key={link.name} 
                href={link.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-100 transition-smooth ${
                  isActive 
                    ? "text-[var(--gc-orange-500)] bg-[var(--gc-navy-700)] border-l-2 border-[var(--gc-orange-500)]" 
                    : "text-[var(--gc-navy-400)] hover:bg-[var(--gc-navy-700)] hover:text-white"
                } animate-slide-up`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <link.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                <span className="font-medium text-[14px]">{link.name}</span>
                {isExternal && (
                  <svg className="w-3.5 h-3.5 ml-auto opacity-50 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--gc-navy-700)] animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-3">
            {session?.user?.image ? (
              <Image src={session.user.image} alt={session.user.name || "User"} width={36} height={36} className="rounded-full bg-[var(--gc-navy-600)]" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[var(--gc-orange-500)] flex items-center justify-center text-white font-bold text-sm">
                {session?.user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-white truncate">{session?.user?.name || "GarajCloud User"}</p>
              <p className="text-[12px] text-[var(--gc-navy-400)] truncate">{session?.user?.email}</p>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2 text-[var(--gc-navy-400)] hover:text-white rounded-md hover:bg-[var(--gc-navy-700)] transition-colors transition-smooth hover:scale-110"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden animate-fade-in">
        {/* Top Header */}
        <header className="sticky top-0 z-10 h-[64px] bg-white border-b border-[var(--gc-gray-200)] flex items-center justify-between px-6 flex-shrink-0 animate-slide-down">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-[var(--gc-gray-500)] hover:bg-[var(--gc-gray-100)] rounded-md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-[18px] font-semibold text-[var(--gc-gray-900)]">
              {pathname === "/dashboard" ? "BOQ Submission" : "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex flex-col items-end">
               <span className="text-[14px] font-medium text-[var(--gc-gray-900)]">{session?.user?.name || "User"}</span>
             </div>
             {session?.user?.image ? (
                <Image src={session.user.image} alt="User" width={32} height={32} className="rounded-full ring-2 ring-[var(--gc-gray-200)]" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--gc-orange-100)] text-[var(--gc-orange-700)] flex items-center justify-center font-bold text-sm ring-2 ring-[var(--gc-orange-50)]">
                  {session?.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[var(--gc-gray-50)] p-4 md:p-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="max-w-[900px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex animate-fade-in">
          <div className="fixed inset-0 bg-black/50 animate-fade-in" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="relative flex-1 w-full max-w-[240px] bg-[var(--gc-navy-800)] text-white flex flex-col animate-slide-down">
            <div className="p-6">
              <Image src="/garaj-logo.svg" alt="GarajCloud" width={140} height={32} className="logo-on-dark" />
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const isActive = link.href === pathname || (link.name === "Submit BOQ" && pathname === "/dashboard");
                const isExternal = link.external === true;
                return (
                  <a 
                    key={link.name} 
                    href={link.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    onClick={() => !isExternal && setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                      isActive 
                        ? "text-[var(--gc-orange-500)] bg-[var(--gc-navy-700)] border-l-2 border-[var(--gc-orange-500)]" 
                        : "text-[var(--gc-navy-400)] hover:bg-[var(--gc-navy-700)] hover:text-white"
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium text-[14px]">{link.name}</span>
                    {isExternal && (
                      <svg className="w-3.5 h-3.5 ml-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                  </a>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
