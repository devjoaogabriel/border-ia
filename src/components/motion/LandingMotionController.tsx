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

        const float = window.matchMedia("(min-width: 1024px)").matches ? 6 : 4;
        const windowFloat = gsap.fromTo(
          "[data-m='window-float']",
          { y: float },
          { y: -float, duration: 2.4, ease: "sine.inOut", repeat: -1, yoyo: true },
        );
        ScrollTrigger.create({
          trigger: "#sobre",
          start: "top bottom",
          end: "bottom top",
          onToggle: ({ isActive }) => windowFloat.paused(!isActive),
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

        gsap.from("[data-m='banner']", {
          ...REVEAL,
          y: 40,
          scrollTrigger: {
            trigger: "#depoimentos",
            start: "top 80%",
            once: true,
          },
        });
        gsap.from("[data-m='banner'] img[aria-hidden]", {
          autoAlpha: 0,
          scale: 0.9,
          duration: 1.2,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#depoimentos",
            start: "top 70%",
            once: true,
          },
        });

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
