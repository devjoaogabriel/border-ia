// Só comandos de path e números: o "d" é interpolado num XML que o SVGLoader interpreta.
const PATH_D = /^\s*[Mm][MmLlHhVvCcSsQqTtAaZz0-9eE.,+\-\s]*$/;

export function sanitizeSvgPathD(d: string): string {
  if (!PATH_D.test(d)) throw new Error("Path SVG inválido");
  return d;
}
