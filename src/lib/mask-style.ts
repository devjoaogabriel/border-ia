import type { CSSProperties } from "react";

// Só ícones locais de public/icons: o caminho entra numa url() de CSS.
const ICON_PATH = /^\/icons\/[a-z0-9-]+\.svg$/i;

export function buildMaskStyle(src: string, size = 24): CSSProperties {
  if (!ICON_PATH.test(src)) throw new Error(`Ícone fora de /icons: ${src}`);
  if (!Number.isFinite(size) || size <= 0) throw new Error(`Tamanho de ícone inválido: ${size}`);
  return { width: size, height: size, mask: `url("${src}") center / contain no-repeat` };
}
