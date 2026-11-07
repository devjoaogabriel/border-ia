import { afterEach, describe, expect, it, vi } from "vitest";
import { getMediaQueryStore } from "@/hooks/media-query-store";

describe("assinatura estável do useMediaQuery (CR-10)", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("devolve as mesmas funções para a mesma consulta", () => {
    const a = getMediaQueryStore("(min-width: 1024px)");
    expect(getMediaQueryStore("(min-width: 1024px)")).toBe(a);
    expect(getMediaQueryStore("(hover: hover)")).not.toBe(a);
  });

  it("cria um MediaQueryList por consulta e repassa as mudanças", () => {
    const listeners = new Set<() => void>();
    const list = {
      matches: false,
      addEventListener: (_: string, fn: () => void) => listeners.add(fn),
      removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
    };
    const matchMedia = vi.fn(() => list);
    vi.stubGlobal("window", { matchMedia });

    const store = getMediaQueryStore("(orientation: portrait)");
    const notify = vi.fn();
    const unsubscribe = store.subscribe(notify);
    expect(store.getSnapshot()).toBe(false);
    list.matches = true;
    listeners.forEach((fn) => fn());
    expect(notify).toHaveBeenCalledOnce();
    expect(store.getSnapshot()).toBe(true);
    unsubscribe();
    expect(listeners.size).toBe(0);
    store.getSnapshot();
    expect(matchMedia).toHaveBeenCalledOnce();
  });
});
