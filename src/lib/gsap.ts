import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);
}

// Progresso do pulso do feixe (0 a 1). O GSAP escreve, o shader lê a cada frame.
export const beamPulse = { value: 0 };

export { DrawSVGPlugin, gsap, ScrollTrigger, useGSAP };
