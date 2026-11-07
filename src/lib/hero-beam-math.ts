// Geometria e física do fio do hero, sem React: o componente e os testes usam o mesmo cálculo.

const BEAM_WIDTH = 340;
const BEAM_VISIBLE_HEIGHT = 497;
// Fica atrás do card e cobre a retração da perspectiva quando ele inclina.
const BEAM_OVERLAP = 28;
const BEAM_TUCK = 14;
// A malha vai do fio até o fim de "criação" no H1 (243px) e espelha para a direita.
// 13 células de 19px: os pontos ficam simétricos em relação ao fio.
const MESH_HALF_WIDTH = 247;

export const BEAM_GEOMETRY = {
  BEAM_WIDTH,
  BEAM_VISIBLE_HEIGHT,
  BEAM_OVERLAP,
  BEAM_HEIGHT: BEAM_VISIBLE_HEIGHT + BEAM_OVERLAP,
  BEAM_CENTER: BEAM_WIDTH / 2,
  BEAM_TUCK,
  BEAM_REST_TIP: BEAM_VISIBLE_HEIGHT + BEAM_TUCK,
  MESH_HALF_WIDTH,
  // 5px de folga por lado: cobre os pontos sem passar da tela em 1024px.
  CANVAS_WIDTH: MESH_HALF_WIDTH * 2 + 10,
} as const;

// Ponto do topo do card onde a linha encosta, a partir do centro do card.
const CONTACT_X = -65;
const CONTACT_Y = -202.5;
const PERSPECTIVE = 900;

const SPRING_STIFFNESS = 140;
const SPRING_DAMPING = 14;
const SWAY_GAIN = 95;
const ROLL_GAIN = 40;
const MAX_DT = 0.05;

const { BEAM_CENTER, BEAM_REST_TIP } = BEAM_GEOMETRY;

export function beamPath(bendX: number, tipX: number, tipY: number): string {
  const first = (tipY / 3).toFixed(2);
  const second = ((2 * tipY) / 3).toFixed(2);
  const bend = (BEAM_CENTER + bendX).toFixed(2);
  const tip = (BEAM_CENTER + tipX).toFixed(2);
  return `M ${BEAM_CENTER} 0 C ${BEAM_CENTER} ${first}, ${bend} ${second}, ${tip} ${tipY.toFixed(2)}`;
}

export const BEAM_REST_PATH = beamPath(0, 0, BEAM_REST_TIP);

const toClampedRad = (deg: number) => Math.min(1, Math.max(-1, (deg * Math.PI) / 180));

/** Ponta do fio presa ao card inclinado, e o alvo do meio do fio. */
export function projectBeamContact(anglesDeg: {
  rotationX: number;
  rotationY: number;
  rotation: number;
}): { tipX: number; tipY: number; targetBendX: number } {
  const rx = toClampedRad(anglesDeg.rotationX);
  const ry = toClampedRad(anglesDeg.rotationY);
  const rz = toClampedRad(anglesDeg.rotation);

  // Projeta o ponto de contato na mesma ordem do CSS: rotateZ, rotateY, rotateX.
  const y1 = CONTACT_Y * Math.cos(rx);
  const z1 = CONTACT_Y * Math.sin(rx);
  const x2 = CONTACT_X * Math.cos(ry) + z1 * Math.sin(ry);
  const z2 = -CONTACT_X * Math.sin(ry) + z1 * Math.cos(ry);
  const x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
  const y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);
  const depth = PERSPECTIVE / (PERSPECTIVE - z2);
  const tipX = x3 * depth - CONTACT_X;
  const tipY = BEAM_REST_TIP + y3 * depth - CONTACT_Y;

  return { tipX, tipY, targetBendX: tipX + Math.sin(ry) * SWAY_GAIN + Math.sin(rz) * ROLL_GAIN };
}

/** Um passo da mola do meio do fio (Euler semi-implícito), com o passo limitado a [0, 0.05] s. */
export function stepBeamSpring(
  bendX: number,
  velocity: number,
  targetBendX: number,
  rawDtSec: number,
): { bendX: number; velocity: number } {
  const dt = Math.min(Math.max(rawDtSec, 0), MAX_DT);
  const nextVelocity =
    velocity + ((targetBendX - bendX) * SPRING_STIFFNESS - velocity * SPRING_DAMPING) * dt;
  return { bendX: bendX + nextVelocity * dt, velocity: nextVelocity };
}
