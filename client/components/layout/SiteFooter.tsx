import React from "react";
import { Link } from "react-router-dom";
import { Github, Twitter } from "lucide-react";

const links = [
  { to: "/roadmaps", label: "Roadmaps" },
  { to: "/assessment", label: "Assessment" },
  { to: "/contact", label: "Contact" },
];

export const SiteFooter: React.FC = () => {
  return (
    <footer className="border-t border-border/50 bg-[#0b1020] text-white/90">
      <div className="container py-12">
        <div className="mb-10">
          <div className="flex items-center gap-2 font-extrabold text-xl text-sky-400">
            <svg
              aria-hidden
              viewBox="0 0 48 24"
              className="h-5 w-9 fill-current"
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
            Ascendify
          </div>
          <p className="text-sm text-white/70 mt-3 max-w-xl">
            Elevating careers through AI-powered skill development and
            personalized guidance.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-semibold mb-3 inline-block border-b-2 border-sky-400 pb-1">
              Learning
            </div>
            <ul className="mt-2 space-y-2 text-sm text-white/70">
              <li>
                <Link to="/roadmaps" className="hover:text-white">
                  Skill Roadmaps
                </Link>
              </li>
              <li>
                <Link to="/assessment" className="hover:text-white">
                  Career Assessment
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3 inline-block border-b-2 border-sky-400 pb-1">
              Community
            </div>
            <ul className="mt-2 space-y-2 text-sm text-white/70">
              <li>
                <Link to="/community#mentorship" className="hover:text-white">
                  Mentorship
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3 inline-block border-b-2 border-sky-400 pb-1">
              Support
            </div>
            <ul className="mt-2 space-y-2 text-sm text-white/70">
              <li>
                <a href="#" className="hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Feedback
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3 inline-block border-b-2 border-sky-400 pb-1">
              Company
            </div>
            <ul className="mt-2 space-y-2 text-sm text-white/70">
              <li>
                <a href="#" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-top border-white/10"></div>
      <div className="border-t border-white/10">
        <div className="container py-4 text-xs text-white/60 flex items-center justify-between">
          <div>
            © {new Date().getFullYear()} Ascendify. All rights reserved.
          </div>
          <div className="flex gap-3">
            <a href="#" aria-label="GitHub" className="hover:text-white/90">
              <Github className="size-4" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white/90">
              <Twitter className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
