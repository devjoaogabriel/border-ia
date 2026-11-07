"use client";

import { useRef, useState } from "react";
import { PluginPrismLogoLazy } from "@/components/three/PluginPrismLogoLazy";
import { COPY_CONTRACT } from "@/lib/constants";
import { beamPulse, Draggable, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type {
  CardTiltInteractionState,
  CardTiltPhysicsConfig,
} from "@/types/landing";
import { MaskIcon } from "./MaskIcon";

const REDUCE = "(prefers-reduced-motion: reduce)";

const TILT: CardTiltPhysicsConfig = {
  balanceSegmentSec: 1.4,
  balanceKeyframes: [
    { rotationX: 2, rotationY: -2.8, rotation: -0.5 },
    { rotationX: -1.4, rotationY: 2.4, rotation: 0.6 },
    { rotationX: 1.6, rotationY: 2.8, rotation: -0.4 },
    { rotationX: 0, rotationY: 0, rotation: 0 },
  ],
  dragMinMovementPx: 6,
  dragMaxRotateX: 14,
  dragMaxRotateY: 16,
  dragPressScale: 1.015,
  dragFollowSec: 0.12,
  reboundSec: 0.9,
  reboundEase: "elastic.out(1, 0.45)",
};

export function MagicCopyCard({ className = "" }: { className?: string }) {
  const { pluginCard } = COPY_CONTRACT;
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const spinRef = useRef<gsap.core.Tween | null>(null);
  const [burstSignal, setBurstSignal] = useState(0);

  useGSAP(
    (_, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          canAnimate: "(prefers-reduced-motion: no-preference)",
          canDrag:
            "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        },
        (context) => {
        if (!context.conditions?.canAnimate) return;
        spinRef.current = gsap.to("[data-card-arc]", {
          rotation: 360,
          transformOrigin: "50% 50%",
          duration: 1.4,
          ease: "none",
          repeat: -1,
        });
        // O pulso desce pelo feixe e acende a borda do card ao chegar.
        gsap
          .timeline({ repeat: -1, repeatDelay: 3, delay: 0.9 })
          .fromTo(
            beamPulse,
            { value: 0 },
            { value: 1, duration: 1.4, ease: "power2.in" },
          )
          .fromTo(
            "[data-card-glow]",
            { opacity: 0 },
            { opacity: 1, duration: 0.18 },
          )
          .to("[data-card-glow]", { opacity: 0, duration: 0.9 });

        const card = cardRef.current!;
        let state: CardTiltInteractionState = "balancing";
        let inViewport = true;

        // Começa e termina em 0°, então soltar o card emenda no balance sem salto.
        const balance = gsap.timeline({
          repeat: -1,
          defaults: { duration: TILT.balanceSegmentSec, ease: "sine.inOut" },
        });
        TILT.balanceKeyframes.forEach((keyframe) => balance.to(card, keyframe));

        const visibility = ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: ({ isActive }) => {
            inViewport = isActive;
            if (state === "balancing") balance.paused(!isActive);
          },
        });

        let stopDrag = () => {};
        if (context.conditions?.canDrag) {
          let startX = 0;
          let startY = 0;
          let box = card.getBoundingClientRect();
          let tilt: gsap.core.Tween | undefined;
          // Sem overwrite do GSAP: ele apagaria trechos da timeline do balance pausada.
          const tiltTo = (vars: gsap.TweenVars) => {
            tilt?.kill();
            tilt = gsap.to(card, vars);
          };

          const [drag] = Draggable.create(document.createElement("div"), {
            trigger: card,
            type: "x,y",
            minimumMovement: TILT.dragMinMovementPx,
            dragClickables: false,
            cursor: "grab",
            activeCursor: "grabbing",
            onDragStart() {
              state = "dragging";
              balance.pause();
              startX = drag.pointerX;
              startY = drag.pointerY;
              box = card.getBoundingClientRect();
            },
            onDrag() {
              const normX = (drag.pointerX - startX) / Math.max(box.width / 2, 120);
              const normY = (drag.pointerY - startY) / Math.max(box.height / 2, 150);
              tiltTo({
                rotationY: Math.tanh(normX * 1.35) * TILT.dragMaxRotateY,
                rotationX: -Math.tanh(normY * 1.35) * TILT.dragMaxRotateX,
                rotation: 0,
                scale: TILT.dragPressScale,
                duration: TILT.dragFollowSec,
                ease: "power2.out",
              });
            },
            onDragEnd() {
              state = "rebounding";
              tiltTo({
                rotationX: 0,
                rotationY: 0,
                rotation: 0,
                scale: 1,
                duration: TILT.reboundSec,
                ease: TILT.reboundEase,
                onComplete: () => {
                  state = "balancing";
                  if (inViewport) balance.restart();
                },
              });
            },
          });

          const onBlur = () => {
            if (drag.isDragging) drag.endDrag(new PointerEvent("pointerup"));
          };
          window.addEventListener("blur", onBlur);
          stopDrag = () => {
            window.removeEventListener("blur", onBlur);
            drag.kill();
          };
        }

        return () => {
          stopDrag();
          visibility.kill();
          gsap.killTweensOf(card);
          gsap.set(card, { clearProps: "transform,cursor,userSelect,touchAction" });
          spinRef.current = null;
          beamPulse.value = 0;
        };
        },
      );

      const handleStart = contextSafe!(() => {
        setBurstSignal((n) => n + 1);
        if (window.matchMedia(REDUCE).matches) {
          gsap.fromTo(
            "[data-card-prompt]",
            { opacity: 0.6 },
            { opacity: 1, duration: 0.6, overwrite: true },
          );
          return;
        }
        const burst = { duration: 1.1, ease: "power2.out", overwrite: true };
        gsap.fromTo("[data-card-burst]", { opacity: 1 }, { opacity: 0, ...burst });
        gsap.fromTo(
          "[data-card-prompt]",
          { borderColor: "#A751FB" },
          { borderColor: "#27272A", ...burst },
        );
        if (spinRef.current) {
          gsap.fromTo(spinRef.current, { timeScale: 4 }, { timeScale: 1, ...burst });
        }
      });

      const button = buttonRef.current;
      button?.addEventListener("click", handleStart);
      return () => button?.removeEventListener("click", handleStart);
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      data-card-stage
      className={`relative z-10 [perspective:900px] ${className}`}
    >
      <div
        ref={cardRef}
        role="group"
        aria-label="Demonstração do plugin Magic copy"
        className="relative h-[405px] w-[324px] touch-pan-y overflow-hidden rounded-xl border border-[#9C7BFF] bg-gray-11 p-10 will-change-transform"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[34px] bottom-0 left-[34px] h-[195px] rounded-full bg-indigo-10/35 blur-[50px]"
        />
        <div
          data-card-glow
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 shadow-[inset_0_0_26px_rgb(192_130_255/0.65)]"
        />
        <div
          data-card-burst
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 shadow-[inset_0_0_44px_rgb(167_81_251/0.9)]"
        />

        <div className="relative">
          <div className="flex h-10 items-center justify-between">
            <PluginPrismLogoLazy burstSignal={burstSignal} />
            <svg
              aria-hidden="true"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              className="text-gray-01"
            >
              <path
                d="M5 8h22M5 16h22M5 24h22"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <p className="mt-[27px] text-center text-[18px] leading-[1.3] font-medium tracking-[0.01em] text-gray-04">
            {pluginCard.title}
          </p>

          <p
            data-card-prompt
            className="mt-[27px] h-[74px] rounded border border-gray-09 bg-gray-10 p-4 text-[14px] leading-[1.5] tracking-[0.01em] text-gray-04"
          >
            {pluginCard.prompt}
          </p>

          <div className="mt-[27px] flex h-8 items-center justify-center gap-2">
            <svg
              data-card-arc
              aria-hidden="true"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M16 5a11 11 0 1 1-10.4 7.4"
                stroke="#A97BFF"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[14px] leading-[1.5] tracking-[0.01em] text-gray-03">
              {pluginCard.statusGenerating}
            </span>
          </div>

          <button
            ref={buttonRef}
            type="button"
            className="mt-[27px] flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded text-[16px] font-medium tracking-[0.01em] text-white transition duration-300 [background-image:var(--gradient-linear-degrade)] hover:brightness-110"
          >
            <MaskIcon src="/icons/feature-bg-remover.svg" />
            {pluginCard.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
