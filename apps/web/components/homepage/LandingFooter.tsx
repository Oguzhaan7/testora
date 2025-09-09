"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Twitter, Github, Linkedin, Mail, Heart, ArrowUp } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function LandingFooter() {
  const t = useTranslations("common");
  const footerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 90%",
        end: "bottom bottom",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      logoRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    )
      .fromTo(
        linksRef.current?.children || [],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        socialRef.current?.children || [],
        { y: 20, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        "-=0.2"
      )
      .fromTo(
        bottomRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.1"
      );
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative bg-gradient-to-br from-background to-muted/20"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(var(--primary), 0.2) 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* Back to Top Button */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <button
          onClick={scrollToTop}
          className="w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        >
          <ArrowUp className="h-5 w-5 mx-auto group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div ref={logoRef} className="col-span-1 lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <Logo size="lg" />
              <div className="h-8 w-0.5 bg-border"></div>
              <span className="text-sm font-medium text-muted-foreground">
                AI-Powered Learning
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              {t("appDescription")}
            </p>

            {/* Social Links */}
            <div ref={socialRef} className="flex items-center space-x-4">
              <span className="text-sm font-medium text-muted-foreground">
                Follow us:
              </span>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-muted/50 hover:bg-primary/10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                >
                  <Twitter className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-muted/50 hover:bg-primary/10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                >
                  <Github className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-muted/50 hover:bg-primary/10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                >
                  <Linkedin className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-muted/50 hover:bg-primary/10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                >
                  <Mail className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div ref={linksRef}>
            <h3 className="font-bold text-foreground mb-6 text-lg">Product</h3>
            <ul className="space-y-4">
              {[
                { href: "#features", label: "Features", isSection: true },
                {
                  href: "#testimonials",
                  label: "Testimonials",
                  isSection: true,
                },
                { href: "#pricing", label: "Pricing", isSection: true },
                { href: "/study", label: "Dashboard", isSection: false },
              ].map((item) => (
                <li key={item.href}>
                  {item.isSection ? (
                    <button
                      onClick={() => scrollToSection(item.href)}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group cursor-pointer"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {item.label}
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {item.label}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-bold text-foreground mb-6 text-lg">Support</h3>
            <ul className="space-y-4">
              {[
                { href: "help", label: "Help Center" },
                { href: "contact", label: "Contact Us" },
                { href: "privacy", label: "Privacy Policy" },
                { href: "terms", label: "Terms of Service" },
              ].map((item) => (
                <li key={item.href}>
                  <span className="text-muted-foreground cursor-default flex items-center group">
                    <span>{item.label}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div ref={bottomRef} className="border-t border-border/60 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-muted-foreground text-sm">
                © {currentYear} {t("appName")}. All rights reserved.
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex space-x-4">
                <span className="text-muted-foreground cursor-default text-sm">
                  Privacy
                </span>
                <span className="text-muted-foreground cursor-default text-sm">
                  Terms
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
