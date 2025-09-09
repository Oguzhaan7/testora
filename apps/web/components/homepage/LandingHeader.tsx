"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Logo } from "@/components/ui/logo";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionId: string) => {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: {
        y: sectionId,
        offsetY: 80
      },
      ease: "power3.inOut"
    });
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(headerRef.current, 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    )
    .fromTo(logoRef.current,
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.6"
    )
    .fromTo(navRef.current?.children || [],
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(actionsRef.current?.children || [],
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
      "-=0.3"
    );
  }, []);

  useGSAP(() => {
    if (isMobileMenuOpen) {
      gsap.fromTo(".mobile-menu-item",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [isMobileMenuOpen]);

  return (
    <header 
      ref={headerRef}
      className={`
        fixed top-0 z-50 w-full transition-all duration-300 ease-in-out
        ${isScrolled 
          ? "bg-background/90 backdrop-blur-xl border-b shadow-lg" 
          : "bg-transparent"
        }
      `}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center">
          {/* Logo */}
          <div ref={logoRef} className="flex items-center z-50 flex-1">
            <Link href="/" className="flex items-center space-x-2 group">
              <Logo size="md" showText={false} className="sm:hidden transition-transform group-hover:scale-105" />
              <Logo size="md" showText={true} className="hidden sm:flex transition-transform group-hover:scale-105" />
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav ref={navRef} className="hidden lg:flex items-center space-x-10 flex-1 justify-center">
            {[
              { href: "#features", label: "Features" },
              { href: "#testimonials", label: "Testimonials" },
              { href: "#pricing", label: "Pricing" },
            ].map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="relative text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-200 group cursor-pointer"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Right side actions */}
          <div ref={actionsRef} className="flex items-center space-x-4 flex-1 justify-end">
            <LanguageSwitcher />
            
            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <Button 
                variant="ghost" 
                asChild 
                size="sm" 
                className="hover:bg-primary/10 transition-colors"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button 
                asChild 
                size="sm" 
                className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`
        lg:hidden absolute top-0 inset-x-0 transition-all duration-300 ease-in-out
        ${isMobileMenuOpen 
          ? "opacity-100 visible" 
          : "opacity-0 invisible"
        }
      `}>
        <div className="bg-background/95 backdrop-blur-xl border-b shadow-xl pt-20 pb-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <nav className="flex flex-col space-y-4">
              {[
                { href: "#features", label: "Features" },
                { href: "#testimonials", label: "Testimonials" },
                { href: "#pricing", label: "Pricing" },
              ].map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="mobile-menu-item text-base font-medium text-foreground/80 hover:text-primary transition-colors py-2 text-left"
                >
                  {item.label}
                </button>
              ))}
              
              <div className="pt-4 border-t space-y-3">
                <Button 
                  variant="ghost" 
                  asChild 
                  size="sm" 
                  className="mobile-menu-item w-full justify-start"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button 
                  asChild 
                  size="sm" 
                  className="mobile-menu-item w-full"
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
