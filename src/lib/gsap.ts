import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin, Draggable);
}

// Progresso do pulso do feixe (0 a 1). O GSAP escreve, o shader lê a cada frame.
export const beamPulse = { value: 0 };

export { Draggable, DrawSVGPlugin, gsap, ScrollTrigger, useGSAP };
