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
  Sparkles,
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-card border-b shadow-lg backdrop-blur-xl"
          : "glass-card border-b backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={isAdmin ? "/admin" : "/"}
            className="group relative text-2xl font-bold glow-text transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center gap-2">
              <span className="relative">
                {isAdmin ? "Dashboard" : "Moriartyy."}
                {!isAdmin && (
                  <Sparkles className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`relative overflow-hidden transition-all duration-300 ${
                      isActive ? "btn-glow" : "hover:scale-105"
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                      {item.name}
                    </span>
                  </Button>
                </Link>
              );
            })}

            {isAdmin && (
              <Link href="/admin">
                <Button
                  variant={pathname === "/admin" ? "default" : "ghost"}
                  className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                    pathname === "/admin" ? "btn-glow neon-border" : ""
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Shield className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    Admin
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
                variant="destructive"
                onClick={handleLogout}
                className="relative overflow-hidden group hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
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
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start relative overflow-hidden group transition-all duration-300 ${
                      isActive ? "btn-glow" : "hover:translate-x-2"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      {item.name}
                    </span>
                  </Button>
                </Link>
              );
            })}

            {isAdmin && (
              <>
                <Link href="/admin">
                  <Button
                    variant={pathname === "/admin" ? "default" : "outline"}
                    className="w-full justify-start neon-border relative overflow-hidden group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Shield className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      Admin
                    </span>
                  </Button>
                </Link>

                <Button
                  variant="destructive"
                  className="w-full justify-start relative overflow-hidden group"
                  onClick={handleLogout}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                    Logout
                  </span>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
