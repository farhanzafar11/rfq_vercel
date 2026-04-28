"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function CredentialsForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials");
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
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mb-6">
      <div className="flex flex-col gap-1 text-left">
        <label className="text-sm font-medium text-gc-text-secondary" htmlFor="username">Email</label>
        <input
          id="username"
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-3 py-2 bg-gc-bg-dark border border-gc-border rounded-md text-sm text-gc-text-primary focus:outline-none focus:ring-1 focus:ring-gc-brand-primary"
          required
        />
      </div>
      <div className="flex flex-col gap-1 text-left">
        <label className="text-sm font-medium text-gc-text-secondary" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-3 py-2 bg-gc-bg-dark border border-gc-border rounded-md text-sm text-gc-text-primary focus:outline-none focus:ring-1 focus:ring-gc-brand-primary"
          required
        />
      </div>
      
      {error && <p className="text-red-500 text-xs text-left">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gc-brand-primary text-white rounded-md py-2 px-4 text-sm font-medium hover:bg-opacity-90 transition-all disabled:opacity-50 mt-2"
      >
        {isLoading ? "Signing in..." : "Sign in with Email"}
      </button>

    </form>
  );
}

