interface MediaQueryStore {
  subscribe: (notify: () => void) => () => void;
  getSnapshot: () => boolean;
}

const stores = new Map<string, MediaQueryStore>();

/**
 * Uma assinatura por consulta, criada uma vez: o useSyncExternalStore recebe sempre
 * as mesmas funções e não refaz matchMedia nem os listeners a cada render.
 */
export function getMediaQueryStore(query: string): MediaQueryStore {
  let store = stores.get(query);
  if (!store) {
    let list: MediaQueryList | undefined;
    const media = () => (list ??= window.matchMedia(query));
    store = {
      subscribe: (notify) => {
        media().addEventListener("change", notify);
        return () => media().removeEventListener("change", notify);
      },
      getSnapshot: () => media().matches,
    };
    stores.set(query, store);
  }
  return store;
}
