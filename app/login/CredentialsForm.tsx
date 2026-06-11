"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CredentialsForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const HARDCODED_EMAIL = "farhanzaf112@gmail.com";
  const HARDCODED_PASSWORD = "123456789";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Client-side pre-check for instant custom error message
    if (username !== HARDCODED_EMAIL || password !== HARDCODED_PASSWORD) {
      setError("You are not authorized to login to the portal.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("You are not authorized to login to the portal.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
      <div className="flex flex-col gap-1.5 text-left">
        <label className="text-[14px] font-medium text-[var(--gc-gray-700)]" htmlFor="username">Email</label>
        <input
          id="username"
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="h-[44px] w-full px-3 border border-[var(--gc-gray-300)] rounded-lg text-[14px] text-[var(--gc-gray-900)] placeholder:text-[var(--gc-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--gc-orange-500)] focus:border-[var(--gc-orange-500)] transition-colors"
          placeholder="name@garajcloud.com"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5 text-left">
        <label className="text-[14px] font-medium text-[var(--gc-gray-700)]" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-[44px] w-full px-3 border border-[var(--gc-gray-300)] rounded-lg text-[14px] text-[var(--gc-gray-900)] placeholder:text-[var(--gc-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--gc-orange-500)] focus:border-[var(--gc-orange-500)] transition-colors"
          placeholder="••••••••"
          required
        />
      </div>

      {error && <p className="text-[var(--gc-error)] text-[13px] font-medium text-left bg-[var(--gc-error-bg)] p-2 rounded-md">{error}</p>}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}

