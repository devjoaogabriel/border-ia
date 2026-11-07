"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BorderIaLogo } from "@/components/ui/BorderIaLogo";
import { CtaButton } from "@/components/ui/CtaButton";
import { gsap, useGSAP } from "@/lib/gsap";
import type { SiteLink } from "@/types/landing";

const PANEL_ID = "mobile-nav-panel";

interface ElevateNavbarProps {
  navItems: SiteLink[];
  cta: SiteLink;
}

// shortcut: reconstrução local do Elevate Navbar (21st 26786), código bloqueado pela cota
// do MCP até 08/11. Sem painéis dropdown, porque a página só tem links diretos.
export function ElevateNavbar({ navItems, cta }: ElevateNavbarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useGSAP(
    (_, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add("(hover: hover) and (prefers-reduced-motion: no-preference)", () => {
        const links = rootRef.current?.querySelectorAll("[data-nav-link]") ?? [];
        const cleanups = [...links].map((link) => {
          const labels = link.querySelectorAll("[data-nav-label]");
          const swap = (yPercent: number) =>
            contextSafe!(() => {
              gsap.to(labels, {
                yPercent,
                duration: 0.3,
                ease: "power2.out",
                overwrite: true,
              });
            });
          const enter = swap(-100);
          const leave = swap(0);
          link.addEventListener("pointerenter", enter);
          link.addEventListener("pointerleave", leave);
          return () => {
            link.removeEventListener("pointerenter", enter);
            link.removeEventListener("pointerleave", leave);
          };
        });
        return () => cleanups.forEach((cleanup) => cleanup());
      });
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      data-m="header"
      className="relative flex w-full items-center justify-between rounded-full border border-gray-08 bg-gray-10/75 py-2 pr-2 pl-5 backdrop-blur-md lg:pl-7"
    >
      <div className="flex items-center gap-[60px]">
        <BorderIaLogo />
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex gap-8 text-[16px] leading-[1.5] tracking-[0.01em] text-gray-05">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  data-nav-link
                  href={item.href}
                  className="block h-[1.5em] overflow-hidden hover:text-gray-01"
                >
                  <span data-nav-label className="block">
                    {item.label}
                  </span>
                  <span
                    data-nav-label
                    aria-hidden="true"
                    className="block text-gray-01"
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:block">
          <CtaButton link={cta} variant="secondary-dark" className="rounded-full" />
        </div>
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls={PANEL_ID}
          aria-label={open ? "Fechar menu de navegação" : "Abrir menu de navegação"}
          onClick={() => setOpen((value) => !value)}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-gray-01 lg:hidden"
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <div
        id={PANEL_ID}
        hidden={!open}
        className="absolute inset-x-0 top-full mt-2 rounded-2xl border border-gray-08 bg-gray-10 p-4 lg:hidden"
      >
        <nav aria-label="Principal no celular">
          <ul className="text-[16px] leading-[1.5] tracking-[0.01em] text-gray-03">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-3 flex sm:hidden">
          <CtaButton link={cta} variant="secondary-dark" className="w-full" />
        </div>
      </div>
    </div>
  );
}
