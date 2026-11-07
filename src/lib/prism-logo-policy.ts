export interface PrismLogoPolicyInput {
  isDesktop: boolean;
  reduceMotion: boolean;
}

/** O logo 3D custa o Three.js inteiro: só vale no Desktop, com movimento liberado. */
export function shouldLoadPrismLogo3D({ isDesktop, reduceMotion }: PrismLogoPolicyInput): boolean {
  return isDesktop && !reduceMotion;
}
