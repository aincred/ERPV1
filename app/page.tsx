"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  // prefill with seeded admin credentials (change or remove in production)
  const [email, setEmail] = useState("admin@dreamworks.com");
  const [password, setPassword] = useState("test123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      setLoading(false);

      if (!res.ok || !json.success) {
        setError(json?.error || "Login failed");
        return;
      }

      // success -> redirect (cookie set by server)
      router.push("/dashboard");
    } catch (err) {
      console.error("Login request error:", err);
      setLoading(false);
      setError("Unexpected error");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-purple-600 opacity-30 blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -right-20 w-80 h-80 rounded-full bg-cyan-500 opacity-25 blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500 opacity-20 blur-[140px]" />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="relative rounded-3xl p-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 shadow-lg">
          <div className="rounded-3xl bg-gray-900/90 backdrop-blur-xl p-8">
            {/* Logo and Header */}
            <div className="flex flex-col items-center mb-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="mb-3"
              >
                <Image
                  src="/DW_dark.webp"
                  alt="DW Dark Logo"
                  width={100}
                  height={100}
                  className="rounded-full shadow-lg"
                />
              </motion.div>

              <div className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 shadow-md">
                <User className="w-6 h-6 text-white" />
              </div>

              <h2 className="mt-3 text-2xl font-bold text-white">Login Portal</h2>
              <p className="text-sm text-gray-400">Enter your credentials</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <Button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 text-white font-semibold shadow-lg hover:opacity-90 transition-all"
              >
                Sign In
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
