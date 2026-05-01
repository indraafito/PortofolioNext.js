"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  User,
  Award,
  Briefcase,
  Mail,
  Shield,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { onAuthChange, clearAuthToken } from "@/lib/auth";
import { toast } from "sonner";

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "About", path: "/about", icon: User },
  { name: "Skills", path: "/skills", icon: Award },
  { name: "Projects", path: "/projects", icon: Briefcase },
  { name: "Contact", path: "/contact", icon: Mail },
];

const adminNavItem = { name: "Admin", path: "/admin", icon: Shield };

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthChange((token) => {
      setIsAdmin(!!token);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    toast.success("Logged out successfully");
    setIsAdmin(false);
    router.push("/");
  };

  return (
    <nav
      role="navigation"
      aria-label="Primary"
      className="fixed top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-full max-w-5xl px-4"
    >
      <div className={`transition-all duration-300 rounded-full ${
        scrolled
          ? "bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl"
          : "bg-black/20 backdrop-blur-xl border border-white/5"
      }`}>
        <div className="flex items-center justify-between h-16 px-6" id="site-header">
          {/* Logo */}
          <Link
            href={isAdmin ? "/admin" : "/"}
            className="group relative text-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center gap-2.5 text-white">
              <span className="relative">
                {isAdmin ? "Dashboard" : "indraafito."}
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1" id="primary-navigation" aria-label="Main menu">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant="ghost"
                    aria-current={isActive ? "page" : undefined}
                    className={`relative overflow-hidden transition-all duration-300 rounded-lg px-5 py-2 h-9 text-[15px] font-normal focus:outline-none focus-visible:ring-0 ${
                      isActive 
                        ? "bg-white/10 text-white hover:bg-white/15" 
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="relative z-10">
                      {item.name}
                    </span>
                  </Button>
                </Link>
              );
            })}
            {isAdmin && (
              <Link key={adminNavItem.path} href={adminNavItem.path}>
                <Button
                  variant="ghost"
                  aria-current={pathname === adminNavItem.path ? "page" : undefined}
                  className={`relative overflow-hidden transition-all duration-300 rounded-lg px-5 py-2 h-9 text-[15px] font-normal focus:outline-none focus-visible:ring-0 ${
                    pathname === adminNavItem.path 
                      ? "bg-white/10 text-white hover:bg-white/15" 
                      : "text-white/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="relative z-10">
                    {adminNavItem.name}
                  </span>
                </Button>
              </Link>
            )}
          </div>

          {/* Theme Switcher + Logout (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeSwitcher />
            {isAdmin && (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="relative overflow-hidden rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                </span>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation"
              aria-controls="mobile-navigation"
              aria-expanded={isOpen}
              className="rounded-lg text-white/70 hover:text-white hover:bg-white/5"
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

        {/* Mobile Navigation - Outside rounded container */}
        {isOpen && (
          <div className="md:hidden mt-2 py-4 space-y-2 animate-fade-in bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl px-4" id="mobile-navigation" aria-label="Main menu">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              const isAdminItem = item.name === "Admin";
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant="ghost"
                    aria-current={isActive ? "page" : undefined}
                    className={`w-full justify-start relative overflow-hidden rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/60 ${
                      isActive 
                        ? "bg-white/10 text-white hover:bg-white/15" 
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    } ${isAdminItem ? "border border-primary/30 text-primary hover:bg-primary/10" : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </span>
                  </Button>
                </Link>
              );
            })}
            {isAdmin && (
              <Link key={adminNavItem.path} href={adminNavItem.path}>
                <Button
                  variant="ghost"
                  aria-current={pathname === adminNavItem.path ? "page" : undefined}
                  className="w-full justify-start relative overflow-hidden rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/60 text-white/70 hover:text-white hover:bg-white/5 border border-primary/30 text-primary hover:bg-primary/10"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <adminNavItem.icon className="h-5 w-5" />
                    {adminNavItem.name}
                  </span>
                </Button>
              </Link>
            )}
            {isAdmin && (
              <Button
                variant="ghost"
                className="w-full justify-start rounded-xl text-white/70 hover:text-white hover:bg-white/5"
                onClick={handleLogout}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <LogOut className="h-5 w-5" />
                  Logout
                </span>
              </Button>
            )}
          </div>
        )}
    </nav>
  );
};