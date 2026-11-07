import { describe, expect, it } from "vitest";
import { LOGO_MARK } from "@/lib/constants";
import { sanitizeSvgPathD } from "@/lib/svg-path-sanitizer";

describe("sanitizador do atributo d (SE-03)", () => {
  it("aceita os paths reais do logo sem alterar", () => {
    for (const d of [LOGO_MARK.back.d, LOGO_MARK.front.d]) expect(sanitizeSvgPathD(d)).toBe(d);
  });

  it("aceita comandos e números válidos", () => {
    expect(sanitizeSvgPathD("M0 0L10.5-2e3 h4 v-1 C1,2 3,4 5,6 Z")).toBe("M0 0L10.5-2e3 h4 v-1 C1,2 3,4 5,6 Z");
  });

  it.each([
    '"/><script>alert(1)</script><path d="',
    "M0 0 <foreignObject/>",
    "M0 0' onload='alert(1)",
    "M0 0 X 10",
    "",
    "   ",
  ])("recusa %s", (d) => {
    expect(() => sanitizeSvgPathD(d)).toThrow();
  });
});
