"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Zap, Shield } from "lucide-react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Image from "next/image";

export function HeroSection() {
  const t = useTranslations("homepage.hero");
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    )
      .fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.6"
      )
      .fromTo(
        descriptionRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        buttonsRef.current?.children || [],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.2, ease: "power2.out" },
        "-=0.2"
      )
      .fromTo(
        imageRef.current,
        { x: 100, opacity: 0, scale: 0.8 },
        { x: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
        "-=1"
      )
      .fromTo(
        featuresRef.current?.children || [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.5"
      );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-screen flex items-center px-6 pt-32 pb-20 lg:pt-40 lg:pb-24 "
    >
      {/* Modern Background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-primary/5 via-background to-accent/10" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/10 to-transparent rounded-full" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <h1
                ref={titleRef}
                className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight"
              >
                <span className="bg-gradient-to-r from-primary via-rose-500/80 to-pink-600 bg-clip-text text-transparent select-none">
                  {t("title")}
                </span>
              </h1>

              <p
                ref={subtitleRef}
                className="text-xl lg:text-2xl leading-relaxed text-muted-foreground font-medium select-none"
              >
                {t("subtitle")}
              </p>

              <p
                ref={descriptionRef}
                className="text-lg leading-relaxed text-muted-foreground/80 select-none"
              >
                {t("description")}
              </p>
            </div>

            {/* Action Buttons */}
            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start"
            >
              <Button
                asChild
                size="lg"
                className="h-14 px-8 text-base font-semibold bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all duration-200 group"
              >
                <Link href="/register" className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  {t("getStarted")}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-base font-semibold border-2 hover:bg-primary/10 transition-all duration-200 group"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                {t("watchDemo")}
              </Button>
            </div>

            {/* Features */}
            <div
              ref={featuresRef}
              className="flex flex-wrap gap-6 justify-center lg:justify-start pt-8"
            >
              <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                <Zap className="h-4 w-4 text-primary" />
                <span>Lightning Fast</span>
              </div>
              <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>AI Powered</span>
              </div>
            </div>
          </div>

          {/* Right Image/Visual */}
          <div ref={imageRef} className="relative lg:order-last">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Main Image Container */}
              <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-4 shadow-2xl backdrop-blur-sm border border-white/20">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src="/images/hero.png"
                    alt="Testora Platform Preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                  {/* Image Overlay for better text readability if needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-bounce">
                <Zap className="h-8 w-8 text-primary" />
              </div>

              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse">
                <Shield className="h-6 w-6 text-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
