"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { TrendingUp, Users, Target, BookOpen, Award } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Counter hook for animated numbers
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const start = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    gsap.to(
      { value: 0 },
      {
        value: end,
        duration: duration / 1000,
        ease: "power2.out",
        onUpdate: function () {
          setCount(Math.round(this.targets()[0].value));
        },
        onComplete: () => setIsAnimating(false),
      }
    );
  };

  return { count, start, isAnimating };
}

export function StatsSection() {
  const t = useTranslations("homepage.stats");
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const stats = [
    {
      value: 15000,
      suffix: "+",
      label: t("studentsLabel"),
      icon: Users,
      gradient: "from-blue-500 to-cyan-600",
      color: "text-blue-500",
    },
    {
      value: 50000,
      suffix: "+",
      label: t("questionsLabel"),
      icon: Target,
      gradient: "from-green-500 to-emerald-600",
      color: "text-green-500",
    },
    {
      value: 95,
      suffix: "%",
      label: t("accuracyLabel"),
      icon: Award,
      gradient: "from-orange-500 to-red-600",
      color: "text-orange-500",
    },
    {
      value: 1200,
      suffix: "+",
      label: t("lessonsLabel"),
      icon: BookOpen,
      gradient: "from-purple-500 to-pink-600",
      color: "text-purple-500",
    },
  ];

  const counters = [
    useCountUp(stats[0]?.value ?? 0, 2000),
    useCountUp(stats[1]?.value ?? 0, 2500),
    useCountUp(stats[2]?.value ?? 0, 2200),
    useCountUp(stats[3]?.value ?? 0, 1800),
  ];

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 30%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          counters.forEach((counter) => counter.start());
        },
      },
    });

    tl.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
    if (statsRef.current?.children) {
      tl.fromTo(
        Array.from(statsRef.current.children),
        { y: 100, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
        },
        "-=0.4"
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 lg:py-40 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/50 to-accent/10" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      {/* Floating Numbers Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-6xl font-bold text-primary animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            {Math.floor(Math.random() * 10)}
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-20">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Our Impact
              </span>
            </div>
          </div>

          <h2
            ref={titleRef}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6"
          >
            <span className="bg-gradient-to-r from-primary via-rose-500/80 to-pink-600 bg-clip-text text-transparent">
              {t("title")}
            </span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const counter = counters[index];
            if (!counter) return null;

            return (
              <div
                key={index}
                className="group relative text-center p-8 rounded-3xl bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl border border-border/20 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Glow Effect */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                />

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `conic-gradient(from 0deg, ${stat.color.replace("text-", "rgba(").replace("-500", ", 0.3)")}, transparent, ${stat.color.replace("text-", "rgba(").replace("-500", ", 0.3)")})`,
                      borderRadius: "24px",
                    }}
                  />
                </div>

                <div className="relative">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Number */}
                  <div className="space-y-2">
                    <div
                      className={`text-5xl lg:text-6xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block`}
                    >
                      {counter.count.toLocaleString()}
                      {stat.suffix}
                    </div>

                    {/* Animated Progress Bar */}
                    <div className="mx-auto w-16 h-1 bg-border/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${stat.gradient} transform -translate-x-full transition-transform duration-1000 ease-out`}
                        style={{
                          transform: counter.isAnimating
                            ? "translateX(0)"
                            : "translateX(-100%)",
                          transitionDelay: `${index * 300}ms`,
                        }}
                      />
                    </div>

                    {/* Label */}
                    <div className="text-lg font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
