"use client";

import { type ReactNode, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const REVEAL = { autoAlpha: 0, y: 24, duration: 0.8, ease: "power3.out" };

export function LandingMotionController({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Sem esse contexto (movimento reduzido), a página fica no estado final do HTML.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline()
          .from("[data-m='header']", { ...REVEAL, y: -12, stagger: 0.08 })
          .from(
            "#hero [data-m='tag'], [data-m='hero-text']",
            { ...REVEAL, stagger: 0.1 },
            0.1,
          )
          .fromTo(
            "[data-stroke-path='oval']",
            { drawSVG: "0%" },
            { drawSVG: "100%", duration: 1.1, ease: "power2.inOut" },
            0.55,
          )
          .from("[data-m='window']", { ...REVEAL, y: 0, duration: 1 }, 0.5);

        gsap.to("[data-m='window']", {
          y: -28,
          ease: "none",
          scrollTrigger: { trigger: "#sobre", scrub: true },
        });

        gsap.from("[data-m='feat-head']", {
          ...REVEAL,
          scrollTrigger: { trigger: "#recursos", start: "top 80%", once: true },
        });
        gsap.fromTo(
          "[data-stroke-path='scribble']",
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            duration: 1.1,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: "#recursos",
              start: "top 65%",
              once: true,
            },
          },
        );
        gsap.from("[data-m='feat-card']", {
          ...REVEAL,
          stagger: 0.12,
          scrollTrigger: { trigger: "#recursos", start: "top 55%", once: true },
        });

        // CM-10: 0.25s de entrada e 0.1s entre etapas fecham os 0.65s da spec.
        const bannerReveal = { autoAlpha: 0, y: 16, duration: 0.25 };
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: "#depoimentos",
              start: "top 80%",
              once: true,
            },
          })
          .from("[data-m='banner']", { ...bannerReveal, y: 40 }, 0)
          .from("[data-m='banner-avatars']", bannerReveal, 0.1)
          .from("[data-m='banner-proof']", bannerReveal, 0.2)
          .from("[data-m='banner-heading']", bannerReveal, 0.3)
          .from("[data-m='banner-cta']", bannerReveal, 0.4);

        gsap.from("[data-m='banner-marquee']", {
          ...REVEAL,
          scrollTrigger: {
            trigger: "[data-m='banner-marquee']",
            start: "top 92%",
            once: true,
          },
        });

        gsap.fromTo(
          "[data-wave]",
          { scale: 0.1, opacity: 0.95 },
          {
            scale: 1.5,
            opacity: 0,
            duration: 2.4,
            ease: "sine.out",
            repeat: -1,
            stagger: 0.5,
            scrollTrigger: {
              trigger: "#depoimentos",
              start: "top bottom",
              end: "bottom top",
              toggleActions: "play pause resume pause",
            },
          },
        );

        gsap.from("[data-m='footer']", {
          ...REVEAL,
          scrollTrigger: {
            trigger: "[data-m='footer']",
            start: "top 95%",
            once: true,
          },
        });
      });

      document.fonts.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: rootRef },
  );

  return <div ref={rootRef}>{children}</div>;
}
