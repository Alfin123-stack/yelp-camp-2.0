"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  {
    tempId: 0,
    rating: 5,
    testimonial:
      "We found a lakeside spot forty minutes off the highway — it never would've turned up anywhere else.",
    by: "Maria Bennett, Weekend camper, Colorado",
    imgSrc:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces&auto=format&q=80",
  },
  {
    tempId: 1,
    rating: 5,
    testimonial:
      "Every review reads like it came from someone who actually cared about getting it right.",
    by: "Daniel Osei, Van life traveler",
    imgSrc:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces&auto=format&q=80",
  },
  {
    tempId: 2,
    rating: 5,
    testimonial:
      "Listing our campground took ten minutes, and the map pin landed in exactly the right spot.",
    by: "Priya Raman, Campground owner, Oregon",
    imgSrc:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces&auto=format&q=80",
  },
  {
    tempId: 3,
    rating: 4,
    testimonial:
      "The filters showed us exactly which sites had flush toilets and shade. Made the whole trip.",
    by: "James Cole, First-time camper",
    imgSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces&auto=format&q=80",
  },
  {
    tempId: 4,
    rating: 5,
    testimonial:
      "Hookup details are always accurate — after three wrong turns elsewhere, that's all I care about.",
    by: "Sofia Delgado, RV traveler",
    imgSrc:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces&auto=format&q=80",
  },
];

interface TestimonialCardProps {
  position: number;
  testimonial: (typeof testimonials)[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize,
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 flex cursor-pointer flex-col overflow-hidden border-2 p-6 sm:p-8 transition-all duration-500 ease-in-out",
        isCenter
          ? "z-10 border-gold-300 bg-gold-300 text-forest-950"
          : "z-0 border-cream-100/15 bg-forest-800 text-cream-50 hover:border-gold-300/50",
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter
          ? "0px 8px 0px 4px var(--color-forest-950)"
          : "0px 0px 0px 0px transparent",
      }}
    >
      <span
        className={cn(
          "absolute block origin-top-right rotate-45",
          isCenter ? "bg-forest-950/25" : "bg-cream-100/15",
        )}
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2,
        }}
      />
      <img
        src={testimonial.imgSrc}
        alt={testimonial.by.split(",")[0]}
        className="mb-3 h-14 w-12 bg-forest-700 object-cover object-top"
        style={{
          boxShadow: isCenter
            ? "3px 3px 0px var(--color-gold-200)"
            : "3px 3px 0px var(--color-forest-950)",
        }}
      />
      <div className="mb-3 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3.5 w-3.5",
              i < testimonial.rating
                ? isCenter
                  ? "fill-forest-950 text-forest-950"
                  : "fill-gold-300 text-gold-300"
                : isCenter
                  ? "fill-forest-950/20 text-forest-950/20"
                  : "fill-cream-100/15 text-cream-100/15",
            )}
          />
        ))}
      </div>
      <h3
        className={cn(
          "line-clamp-4 font-serif text-sm sm:text-lg font-medium leading-snug",
          isCenter ? "text-forest-950" : "text-cream-50",
        )}
      >
        &ldquo;{testimonial.testimonial}&rdquo;
      </h3>
      <p
        className={cn(
          "mt-auto pt-4 text-xs sm:text-sm italic",
          isCenter ? "text-forest-950/70" : "text-cream-100/60",
        )}
      >
        — {testimonial.by}
      </p>
    </div>
  );
};

export const Testimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(300);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps: number) => {
    setTestimonialsList((current) => {
      const newList = [...current];
      if (steps > 0) {
        for (let i = steps; i > 0; i--) {
          const item = newList.shift();
          if (!item) return current;
          newList.push({ ...item, tempId: Math.random() });
        }
      } else {
        for (let i = steps; i < 0; i++) {
          const item = newList.pop();
          if (!item) return current;
          newList.unshift({ ...item, tempId: Math.random() });
        }
      }
      return newList;
    });
  };

  // Auto-advance every 6s, same cadence as the rest of the landing page's
  // rotating sections. Manual clicks on the arrows or a card still work in
  // between — this timer just keeps the deck moving on its own.
  useEffect(() => {
    const id = setInterval(() => handleMove(1), 6000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 300 : 250);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-forest-950 py-15">
      <div className="relative mx-auto max-w-2xl px-4 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
          From our community
        </span>
        <h2 className="mt-3 font-serif text-3xl font-medium text-cream-50 sm:text-4xl">
          What campers are saying
        </h2>
        <p className="mx-auto mt-4 max-w-md text-balance text-cream-100/70">
          Real reviews from people who&apos;ve actually pitched a tent here —
          not marketing copy.
        </p>
      </div>

      <div className="relative mt-8" style={{ height: 520 }}>
        {testimonialsList.map((testimonial, index) => {
          // Floor (not the reference's ceil-leaning formula) keeps the
          // spread symmetric — e.g. 5 cards sit at -2,-1,0,1,2 instead of
          // -3,-2,-1,0,1, which was stacking everything to the left.
          const position = index - Math.floor(testimonialsList.length / 2);
          return (
            <TestimonialCard
              key={testimonial.tempId}
              testimonial={testimonial}
              handleMove={handleMove}
              position={position}
              cardSize={cardSize}
            />
          );
        })}
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-3">
          <button
            onClick={() => handleMove(-1)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
              "border border-cream-100/20 bg-forest-900 text-cream-50",
              "hover:border-gold-300 hover:bg-gold-300 hover:text-forest-950",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-950",
            )}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleMove(1)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
              "border border-cream-100/20 bg-forest-900 text-cream-50",
              "hover:border-gold-300 hover:bg-gold-300 hover:text-forest-950",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-950",
            )}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;