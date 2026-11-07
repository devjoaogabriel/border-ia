import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);
}

// Progresso do pulso do feixe (0 a 1). O GSAP escreve, o shader lê a cada frame.
export const beamPulse = { value: 0 };

// Ponte entre card e feixe, fora do React para não gerar render a cada frame.
// O card escreve os ângulos, o feixe grava a curva e o shader lê os dois.
export const heroCardMotion = {
  rotationX: 0,
  rotationY: 0,
  rotation: 0,
  bendX: 0,
  tipX: 0,
  tipY: 511,
};

export { DrawSVGPlugin, gsap, ScrollTrigger, useGSAP };
