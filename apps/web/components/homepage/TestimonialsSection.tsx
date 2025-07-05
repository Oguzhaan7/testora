"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

export function TestimonialsSection() {
  const t = useTranslations("homepage.testimonials");

  const testimonials = [
    {
      key: "testimonial1",
      avatar: "/avatars/student1.jpg",
      fallback: "SJ",
    },
    {
      key: "testimonial2",
      avatar: "/avatars/student2.jpg",
      fallback: "AH",
    },
    {
      key: "testimonial3",
      avatar: "/avatars/student3.jpg",
      fallback: "MR",
    },
  ];

  return (
    <section id="testimonials" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.key} className="relative">
              <CardContent className="p-8">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <blockquote className="text-lg leading-8 text-foreground mb-6">
                  &ldquo;{t(`${testimonial.key}.text`)}&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>{testimonial.fallback}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">
                      {t(`${testimonial.key}.author`)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t(`${testimonial.key}.role`)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
