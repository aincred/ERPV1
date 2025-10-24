"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, UserCircle, Menu, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full h-16 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 
                 flex items-center justify-between px-4 sm:px-6 shadow-lg relative"
    >
      {/* Neon gradient accents */}
      <div className="absolute top-0 left-16 w-24 h-24 bg-fuchsia-500 opacity-20 blur-3xl" />

      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden relative z-20 text-gray-300 hover:text-cyan-400 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Title */}
      <h2 className="relative z-10 text-lg sm:text-xl font-semibold text-white mx-auto lg:mx-0">
        Dashboard Overview
      </h2>

      {/* Actions */}
      <div className="relative z-10 flex items-center gap-3 sm:gap-4">
        <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer" />
        <UserCircle className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300 hover:text-purple-400 transition-colors cursor-pointer" />

        {/* 🚀 Logout Button */}
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(239,68,68,0.7)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-red-600/70 to-pink-600/70 
                     text-white text-sm sm:text-base font-medium hover:from-red-500 hover:to-pink-500 transition-all"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" /> Logout
        </motion.button>
      </div>
    </motion.header>
  );
}
