"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Quote,
  Star,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function TestimonialsSection() {
  const t = useTranslations("homepage.testimonials");
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      key: "testimonial1",
      avatar: "/avatars/student1.jpg",
      fallback: "SJ",
      rating: 5,
      gradient: "from-blue-500 to-purple-600",
      color: "text-blue-500",
    },
    {
      key: "testimonial2",
      avatar: "/avatars/student2.jpg",
      fallback: "AH",
      rating: 5,
      gradient: "from-green-500 to-emerald-600",
      color: "text-green-500",
    },
    {
      key: "testimonial3",
      avatar: "/avatars/student3.jpg",
      fallback: "MR",
      rating: 5,
      gradient: "from-orange-500 to-red-600",
      color: "text-orange-500",
    },
    {
      key: "testimonial4",
      avatar: "/avatars/student4.jpg",
      fallback: "LK",
      rating: 5,
      gradient: "from-purple-500 to-pink-600",
      color: "text-purple-500",
    },
    {
      key: "testimonial5",
      avatar: "/avatars/student5.jpg",
      fallback: "DM",
      rating: 5,
      gradient: "from-teal-500 to-cyan-600",
      color: "text-teal-500",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide(
      (prev) => (prev + 1) % Math.max(1, testimonials.length - 2)
    );
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.max(1, testimonials.length - 2)) %
        Math.max(1, testimonials.length - 2)
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    )
      .fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        carouselRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.2"
      )
      .fromTo(
        controlsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );
  }, []);

  useGSAP(() => {
    if (carouselRef.current) {
      gsap.to(carouselRef.current, {
        x: `-${currentSlide * 33.333}%`,
        duration: 0.8,
        ease: "power2.inOut",
      });
    }
  }, [currentSlide]);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background/50 to-primary/5" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Quote Pattern Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <Quote
            key={i}
            className="absolute h-12 w-12 text-primary animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-20">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Testimonials
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

          <p
            ref={subtitleRef}
            className="text-xl lg:text-2xl leading-relaxed text-muted-foreground font-medium"
          >
            {t("subtitle")}
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              ref={carouselRef}
              className="flex transition-transform duration-800 ease-in-out"
              style={{ width: `${(testimonials.length / 3) * 100}%` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.key} className="w-1/3 flex-shrink-0 px-4">
                  <Card className="group relative h-full overflow-hidden border-0 bg-gradient-to-br from-background/90 to-background/60 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-700 hover:-translate-y-3">
                    {/* Glow Effect */}
                    <div
                      className={`absolute -inset-0.5 bg-gradient-to-r ${testimonial.gradient} rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                    />

                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                      <Quote className="w-full h-full text-primary transform rotate-12" />
                    </div>

                    <CardContent className="relative p-8 h-full flex flex-col">
                      {/* Quote Icon */}
                      <div className="mb-6">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
                        >
                          <Quote className="h-6 w-6 text-white" />
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center mb-6">
                        {Array.from({ length: testimonial.rating }).map(
                          (_, starIndex) => (
                            <Star
                              key={starIndex}
                              className={`h-5 w-5 fill-current ${testimonial.color} group-hover:scale-110 transition-transform duration-300`}
                              style={{
                                transitionDelay: `${starIndex * 100}ms`,
                              }}
                            />
                          )
                        )}
                      </div>

                      {/* Testimonial Text */}
                      <blockquote className="text-lg leading-relaxed text-foreground/90 mb-8 flex-grow group-hover:text-foreground transition-colors duration-300">
                        "{t(`${testimonial.key}.text`)}"
                      </blockquote>

                      {/* Author Section */}
                      <div className="flex items-center gap-4 pt-4 border-t border-border/20">
                        <div className="relative">
                          <Avatar className="h-14 w-14 ring-2 ring-border/20 group-hover:ring-primary/30 transition-all duration-300">
                            <AvatarImage
                              src={testimonial.avatar}
                              className="group-hover:scale-110 transition-transform duration-300"
                            />
                            <AvatarFallback
                              className={`bg-gradient-to-br ${testimonial.gradient} text-white font-bold`}
                            >
                              {testimonial.fallback}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center`}
                          >
                            <Sparkles className="h-3 w-3 text-white" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                            {t(`${testimonial.key}.author`)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t(`${testimonial.key}.role`)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div
            ref={controlsRef}
            className="flex items-center justify-center mt-12 space-x-6"
          >
            {/* Prev Button */}
            <Button
              variant="outline"
              size="lg"
              onClick={prevSlide}
              className="h-12 w-12 rounded-full border-2 hover:bg-primary/10 hover:border-primary transition-all duration-300 group"
            >
              <ChevronLeft className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {Array.from({ length: Math.max(1, testimonials.length - 2) }).map(
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-primary scale-125"
                        : "bg-border hover:bg-primary/50 hover:scale-110"
                    }`}
                  />
                )
              )}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="lg"
              onClick={nextSlide}
              className="h-12 w-12 rounded-full border-2 hover:bg-primary/10 hover:border-primary transition-all duration-300 group"
            >
              <ChevronRight className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
