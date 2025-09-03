import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/roadmaps", label: "Explore Roadmaps" },
  { to: "/assessment", label: "Career Assessment" },
  { to: "/contact", label: "Contact" },
];

export const SiteHeader: React.FC = () => {
  const location = useLocation();
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50">
      <div className="container flex h-16 items-center justify-between">
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

        <nav className="hidden md:flex items-center gap-1 ml-[550px]">
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
                    : "text-foreground/70 hover:text-foreground hover:bg-sky-400/10",
                )}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="gradient"
            className="hidden sm:inline-flex shadow-neon"
          >
            <Link to="/signin">Sign In</Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
