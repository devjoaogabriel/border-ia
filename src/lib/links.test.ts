import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SITE_LINKS } from "@/lib/constants";
import { resolveSiteLinkAttributes } from "@/lib/links";
import type { SiteLink } from "@/types/landing";

const link = (href: string, external: boolean): SiteLink => ({ id: "x", label: "X", href, external });

describe("atributos seguros de link", () => {
  it("abre externo em nova aba sem expor a página de origem", () => {
    expect(resolveSiteLinkAttributes(link("https://discord.com", true))).toEqual({
      href: "https://discord.com",
      target: "_blank",
      rel: "noopener noreferrer",
    });
  });

  it("mantém âncora interna na mesma aba", () => {
    expect(resolveSiteLinkAttributes(link("#recursos", false))).toEqual({ href: "#recursos" });
  });

  it.each([
    ["javascript:alert(1)", true],
    ["javascript:alert(1)", false],
    ["data:text/html,<script>alert(1)</script>", true],
    ["http://discord.com", true],
    ["//evil.example", true],
    ["https://evil.example", false],
    ["#recursos", true],
    ["#bad anchor", false],
    ["https://discord.com path", true],
  ])("recusa %s com external=%s", (href, external) => {
    expect(() => resolveSiteLinkAttributes(link(href, external))).toThrow();
  });

  it("aceita todos os links reais do site", () => {
    const all = [...SITE_LINKS.navItems, ...Object.values(SITE_LINKS.ctas), ...SITE_LINKS.socialLinks];
    expect(all.length).toBeGreaterThan(0);
    for (const l of all) expect(() => resolveSiteLinkAttributes(l)).not.toThrow();
  });

  it("tem um ícone em public para cada rede social", () => {
    for (const l of SITE_LINKS.socialLinks) {
      expect(existsSync(join(process.cwd(), "public", "icons", `social-${l.id}.svg`)), l.id).toBe(true);
    }
  });
});
