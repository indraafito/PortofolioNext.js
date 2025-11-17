"use client"; // penting untuk hook dan useEffect di Next.js 13+

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ScrollToTop = () => {
  const pathname = usePathname(); // sama seperti useLocation di react-router-dom

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // ubah ke "auto" jika tidak mau efek halus
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
