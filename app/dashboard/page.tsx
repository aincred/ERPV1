"use client";

import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6"
    >
      <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard 🚀</h1>
      <p className="text-gray-400">
        Use the sidebar to navigate through your dashboard sections.  
        Try visiting the <span className="text-cyan-400 font-semibold">asset-checky</span> page to upload ERP!
      </p>
    </motion.div>
  );
}
