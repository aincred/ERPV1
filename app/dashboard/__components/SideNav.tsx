// "use client";

// import { motion } from "framer-motion";
// import { Home, Users, Settings, LogOut, X } from "lucide-react";
// import Link from "next/link";
// import { useRouter, usePathname } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function SideNav({
//   open,
//   setOpen,
// }: {
//   open: boolean;
//   setOpen: (v: boolean) => void;
// }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isMounted, setIsMounted] = useState(false);

//   // Prevent SSR hydration mismatch
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   if (!isMounted) return null; // 🧠 Render nothing until mounted

//   const handleLogout = () => {
//     router.push("/login");
//   };

//   const links = [
//     { href: "/dashboard", label: "Home", icon: Home },
//     { href: "/dashboard/asset-check", label: "Asset-check", icon: Users },
//     { href: "/dashboard/submissions", label: "Submissionsy", icon: Users },
//     { href: "/dashboard/settings", label: "Settings", icon: Settings },
    
//   ];

//   return (
//     <>
//       {/* Mobile Backdrop */}
//       {open && (
//         <div
//           className="fixed inset-0 bg-black/50 z-30 lg:hidden"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <motion.aside
//         initial={{ x: -40, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className={`fixed lg:static top-0 left-0 z-40 h-screen w-64 bg-gray-900/80 backdrop-blur-xl 
//         border-r border-gray-800 flex flex-col p-6 shadow-xl 
//         transform transition-transform duration-300
//         ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
//       >
//         {/* Neon accents */}
//         <div className="absolute top-0 left-0 w-32 h-32 bg-purple-600 opacity-20 blur-3xl" />
//         <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-500 opacity-20 blur-3xl" />

//         {/* Close Button (Mobile Only) */}
//         <button
//           onClick={() => setOpen(false)}
//           className="absolute right-4 top-4 text-gray-400 hover:text-white lg:hidden"
//         >
//           <X className="w-6 h-6" />
//         </button>

//         {/* Logo */}
//         <h1 className="relative z-10 text-2xl font-bold text-white mb-10 mt-2">
//           🚀 Dashboard
//         </h1>

//         {/* Nav Links */}
//         <nav className="relative z-10 flex flex-col gap-3 flex-1">
//           {links.map(({ href, label, icon: Icon }) => {
//             const isActive = pathname === href;
//             return (
//               <Link
//                 key={href}
//                 href={href}
//                 onClick={() => setOpen(false)}
//                 className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm sm:text-base transition-all ${
//                   isActive
//                     ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white"
//                     : "bg-gray-800/60 text-gray-300 hover:bg-gradient-to-r hover:from-purple-600 hover:to-cyan-500 hover:text-white"
//                 }`}
//               >
//                 <Icon className="w-5 h-5" /> {label}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Logout Button */}
//         <button
//           onClick={handleLogout}
//           className="mt-auto flex items-center gap-3 px-3 py-2 rounded-xl bg-red-600/60 text-white hover:bg-red-500 transition-all text-sm sm:text-base"
//         >
//           <LogOut className="w-5 h-5" /> Logout
//         </button>
//       </motion.aside>
//     </>
//   );
// }

"use client";

import { motion } from "framer-motion";
import { Home, Users, Settings, LogOut, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // ✅ Import Image for Next.js
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SideNav({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleLogout = () => {
    router.push("/login");
  };

  const links = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/asset-check", label: "Asset-check", icon: Users },
    { href: "/dashboard/submissions", label: "Submissions", icon: Users },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed lg:static top-0 left-0 z-40 h-screen w-64 bg-gray-900/80 backdrop-blur-xl 
        border-r border-gray-800 flex flex-col p-6 shadow-xl 
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Neon accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-purple-600 opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-500 opacity-20 blur-3xl" />

        {/* Close Button (Mobile Only) */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-white lg:hidden"
        >
          <X className="w-6 h-6" />
        </button>

        {/* ✅ Logo Section */}
        <div className="relative z-10 flex items-center justify-center mb-8 mt-4">
          <Image
            src="/DW_dark.webp"
            alt="Dream Works Logo"
            width={140}
            height={50}
            className="object-contain rounded-lg"
            priority
          />
        </div>

        {/* Nav Links */}
        <nav className="relative z-10 flex flex-col gap-3 flex-1">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm sm:text-base transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white"
                    : "bg-gray-800/60 text-gray-300 hover:bg-gradient-to-r hover:from-purple-600 hover:to-cyan-500 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" /> {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        
      </motion.aside>
    </>
  );
}
