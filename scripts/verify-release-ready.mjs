// Bloqueia a publicação enquanto a prova social (D6) tiver texto provisório.
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/lib/constants.ts", import.meta.url), "utf8");
const problems = [];

if (!/TESTIMONIALS_VERIFIED\s*=\s*true/.test(source)) {
  problems.push("TESTIMONIALS_VERIFIED não está true.");
}
if (/isPlaceholder:\s*true/.test(source)) {
  problems.push("Ainda existe depoimento com isPlaceholder: true.");
}

if (problems.length > 0) {
  console.error("Publicação bloqueada: faltam os depoimentos reais do João Gabriel.");
  problems.forEach((problem) => console.error(`- ${problem}`));
  process.exit(1);
}
console.log("Prova social liberada para publicação.");
