"use client";

import { useRef, useState } from "react";
import { PluginPrismLogoLazy } from "@/components/three/PluginPrismLogoLazy";
import { COPY_CONTRACT } from "@/lib/constants";
import {
  beamPulse,
  gsap,
  heroCardMotion,
  ScrollTrigger,
  useGSAP,
} from "@/lib/gsap";
import {
  CARD_TILT_CONFIG,
  computeCardHoverAngles,
  shouldRunCardContinuousMotion,
  shouldSyncHeroTicker,
} from "@/lib/card-tilt-math";
import type { CardTiltInteractionState } from "@/types/landing";
import { MaskIcon } from "./MaskIcon";

const REDUCE = "(prefers-reduced-motion: reduce)";

const TILT = CARD_TILT_CONFIG;

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
          canHover:
            "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
          isDesktop: "(min-width: 1024px)",
        },
        (context) => {
        if (!context.conditions?.canAnimate) return;
        const spin = gsap.to("[data-card-arc]", {
          rotation: 360,
          transformOrigin: "50% 50%",
          duration: 1.4,
          ease: "none",
          repeat: -1,
        });
        spinRef.current = spin;
        // O pulso desce pelo feixe e acende a borda do card ao chegar.
        const pulse = gsap
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

        // O feixe lê estes ângulos para manter a ponta presa ao card.
        const read = gsap.getProperty(card);
        const syncMotion = () => {
          heroCardMotion.rotationX = read("rotationX") as number;
          heroCardMotion.rotationY = read("rotationY") as number;
          heroCardMotion.rotation = read("rotation") as number;
        };
        let syncing = false;

        // Fora da tela tudo para: balance, giro, pulso e a ponte com a corda.
        const applyVisibility = (isActive: boolean) => {
          inViewport = isActive;
          if (state === "balancing") balance.paused(!isActive);
          const policy = {
            inViewport: isActive,
            isDesktop: Boolean(context.conditions?.isDesktop),
            reduceMotion: false,
          };
          const run = shouldRunCardContinuousMotion(policy);
          spin.paused(!run);
          pulse.paused(!run);
          const sync = shouldSyncHeroTicker(policy);
          if (sync && !syncing) gsap.ticker.add(syncMotion);
          if (!sync && syncing) gsap.ticker.remove(syncMotion);
          syncing = sync;
        };

        const visibility = ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: ({ isActive }) => applyVisibility(isActive),
        });
        applyVisibility(visibility.isActive);

        let stopHover = () => {};
        if (context.conditions?.canHover) {
          const stage = rootRef.current!;
          let tilt: gsap.core.Tween | undefined;
          // Sem overwrite do GSAP: ele apagaria trechos da timeline do balance pausada.
          const tiltTo = (vars: gsap.TweenVars) => {
            tilt?.kill();
            tilt = gsap.to(card, vars);
          };

          // Medido no palco, que não inclina: a borda do hover não treme com o card.
          const onMove = (event: PointerEvent) => {
            if (event.pointerType !== "mouse") return;
            state = "hovering";
            balance.pause();
            const box = stage.getBoundingClientRect();
            const normX = ((event.clientX - box.left) / box.width) * 2 - 1;
            const normY = ((event.clientY - box.top) / box.height) * 2 - 1;
            const overCta = buttonRef.current?.contains(event.target as Node);
            tiltTo({
              ...computeCardHoverAngles(normX, normY, Boolean(overCta)),
              rotation: 0,
              duration: TILT.hoverFollowSec,
              ease: "power2.out",
            });
          };

          const onLeave = () => {
            if (state !== "hovering") return;
            state = "rebounding";
            tiltTo({
              rotationX: 0,
              rotationY: 0,
              rotation: 0,
              duration: TILT.reboundSec,
              ease: TILT.reboundEase,
              onComplete: () => {
                state = "balancing";
                if (inViewport) balance.restart();
                else balance.pause(0);
              },
            });
          };

          stage.addEventListener("pointerenter", onMove);
          stage.addEventListener("pointermove", onMove);
          stage.addEventListener("pointerleave", onLeave);
          window.addEventListener("blur", onLeave);
          stopHover = () => {
            stage.removeEventListener("pointerenter", onMove);
            stage.removeEventListener("pointermove", onMove);
            stage.removeEventListener("pointerleave", onLeave);
            window.removeEventListener("blur", onLeave);
          };
        }

        return () => {
          stopHover();
          gsap.ticker.remove(syncMotion);
          visibility.kill();
          gsap.killTweensOf(card);
          gsap.set(card, { clearProps: "transform" });
          Object.assign(heroCardMotion, { rotationX: 0, rotationY: 0, rotation: 0 });
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
      className={`relative isolate z-10 [perspective:900px] ${className}`}
    >
      <div
        ref={cardRef}
        role="group"
        aria-label="Demonstração do plugin Magic copy"
        className="relative h-[405px] w-[324px] touch-pan-y overflow-hidden rounded-[10px] border border-transparent p-10 will-change-transform [background:linear-gradient(var(--color-gray-11),var(--color-gray-11))_padding-box,var(--gradient-linear-degrade)_border-box]"
      >
        <div
          aria-hidden="true"
          className="card-haze pointer-events-none absolute inset-0"
        />
        <div
          data-card-glow
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[9px] opacity-0 shadow-[inset_0_0_26px_rgb(192_130_255/0.65)]"
        />
        <div
          data-card-burst
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[9px] opacity-0 shadow-[inset_0_0_44px_rgb(167_81_251/0.9)]"
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
            className="btn-shine mt-[27px] flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded text-[16px] font-medium tracking-[0.01em] text-white [background-image:var(--gradient-linear-degrade)] hover:brightness-110"
          >
            <MaskIcon src="/icons/feature-bg-remover.svg" />
            {pluginCard.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
