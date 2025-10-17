"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // Load saved data
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    const savedPassword = localStorage.getItem("userPassword");
    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);

    setMessage("Settings updated successfully ✅");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-start py-12 px-4">
      <motion.h1
        className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ⚙️ Account Settings
      </motion.h1>

      <motion.form
        onSubmit={handleSave}
        className="bg-gray-800 p-8 rounded-2xl w-full max-w-md shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Email */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-300">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-300">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all py-3 rounded-lg font-semibold shadow-md"
        >
          Save Changes
        </button>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center text-green-400 font-medium">{message}</p>
        )}
      </motion.form>
    </div>
  );
}
