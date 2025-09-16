// import React from "react";
// import { Link, NavLink, useLocation } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import ThemeToggle from "@/components/ThemeToggle";
// import { cn } from "@/lib/utils";

// const nav = [
//   { to: "/", label: "Home" },
//   { to: "/roadmaps", label: "Explore Roadmaps" },
//   { to: "/assessment", label: "Career Assessment" },
//   { to: "/community", label: "Community" },
//   { to: "/contact", label: "Contact" },
// ];

// export const SiteHeader: React.FC = () => {
//   const location = useLocation();
//   return (
//     <header className="sticky top-0 z-30 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50">
//       <div className="container flex h-16 items-center justify-between">
//         <Link
//           to="/"
//           className="font-extrabold text-xl tracking-tight flex items-center gap-2"
//         >
//           <svg
//             aria-hidden
//             viewBox="0 0 48 24"
//             className="h-5 w-9 text-sky-400 fill-current"
//           >
//             <path
//               d="M12 12c0-4 3-7 7-7 3 0 5 2 7 4s4 4 7 4 7-3 7-7"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//             />
//             <path
//               d="M36 12c0 4-3 7-7 7-3 0-5-2-7-4s-4-4-7-4-7 3-7 7"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//             />
//           </svg>
//           <span className="text-sky-400">Ascendify</span>
//         </Link>

//         <nav className="hidden md:flex items-center gap-1">
//           {nav.map((item) => {
//             const active = location.pathname === item.to;
//             return (
//               <NavLink
//                 key={item.to}
//                 to={item.to}
//                 className={cn(
//                   "px-3 py-2 rounded-md text-sm font-medium transition-colors",
//                   active
//                     ? "text-sky-400 bg-sky-400/10"
//                     : "text-foreground/70 hover:text-foreground hover:bg-sky-400/10",
//                 )}
//               >
//                 {item.label}
//               </NavLink>
//             );
//           })}
//         </nav>

//         <div className="flex items-center gap-2">
//           <Button
//             asChild
//             variant="gradient"
//             className="hidden sm:inline-flex shadow-neon"
//           >
//             <Link to="/signin">Sign In</Link>
//           </Button>
//           <ThemeToggle />
//         </div>
//       </div>
//     </header>
//   );
// };

// export default SiteHeader;
// src/components/SiteHeader.tsx
import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const nav = [
  { to: "/", label: "Home" },
  { to: "/roadmaps", label: "Explore Roadmaps" },
  { to: "/assessment", label: "Career Assessment" },
  { to: "/community", label: "Community" },
  { to: "/contact", label: "Contact" },
];

export const SiteHeader: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-extrabold text-xl tracking-tight flex items-center gap-2"
        >
          <svg
            aria-hidden
            viewBox="0 0 48 24"
            className="h-5 w-9 text-sky-400 fill-current"
          >
            <path
              d="M12 12c0-4 3-7 7-7 3 0 5 2 7 4s4 4 7 4 7-3 7-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M36 12c0 4-3 7-7 7-3 0-5-2-7-4s-4-4-7-4-7 3-7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-sky-400">Ascendify</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((item) => {
            const active = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  active
                    ? "text-sky-400 bg-sky-400/10"
                    : "text-foreground/70 hover:text-foreground hover:bg-sky-400/10"
                )}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Right side: Auth + Theme */}
        <div className="flex items-center gap-2 relative">
          {!user ? (
            // Show Sign In button if not logged in
            <Button
              asChild
              variant="gradient"
              className="hidden sm:inline-flex shadow-neon"
            >
              <Link to="/signin">Sign In</Link>
            </Button>
          ) : (
            // Show avatar + dropdown if logged in
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold shadow-md hover:bg-sky-600"
              >
                {user.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : user.email?.charAt(0).toUpperCase()}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-background border border-border rounded-lg shadow-lg">
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-sky-400/10"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
