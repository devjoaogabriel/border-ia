import type { CardTiltPhysicsConfig } from "@/types/landing";

export const CARD_TILT_CONFIG: CardTiltPhysicsConfig = {
  balanceSegmentSec: 1.4,
  balanceKeyframes: [
    { rotationX: 2, rotationY: -2.8, rotation: -0.5 },
    { rotationX: -1.4, rotationY: 2.4, rotation: 0.6 },
    { rotationX: 1.6, rotationY: 2.8, rotation: -0.4 },
    { rotationX: 0, rotationY: 0, rotation: 0 },
  ],
  hoverMaxRotateX: 10,
  hoverMaxRotateY: 12,
  hoverFollowSec: 0.28,
  hoverCtaDamping: 0.35,
  reboundSec: 0.85,
  reboundEase: "elastic.out(1, 0.45)",
};

// Ganho antes da saturação: o card chega perto do teto já na borda, sem travar nela.
const TANH_GAIN = 1.15;

/** Ângulos do card para o mouse em coordenadas normalizadas do palco (-1 a 1). */
export function computeCardHoverAngles(
  normX: number,
  normY: number,
  overCta: boolean,
  config: Pick<
    CardTiltPhysicsConfig,
    "hoverMaxRotateX" | "hoverMaxRotateY" | "hoverCtaDamping"
  > = CARD_TILT_CONFIG,
): { rotationX: number; rotationY: number } {
  const gain = overCta ? config.hoverCtaDamping : 1;
  return {
    rotationY: Math.tanh(normX * TANH_GAIN) * config.hoverMaxRotateY * gain,
    rotationX: -Math.tanh(normY * TANH_GAIN) * config.hoverMaxRotateX * gain,
  };
}
