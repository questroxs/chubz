import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Size } from "@/lib/catalog";
import type { ChubFace } from "@/lib/chub-ink";

export type BagLine = {
  id: string;
  slug: string;
  size: Size;
  colorId: string;
  backPrint: boolean;
  qty: number;
  art?: string;
  /** mean-orange, blue-yellow, and so on. The print file is `art`. */
  ink?: string;
  blankId?: string;
};

type ShopState = {
  lines: BagLine[];
  hydrated: boolean;
  cartOpen: boolean;
  chubFace: ChubFace;
  chubInk: string;
  chubShirt: string;
  chubFromHome: boolean;
  setHydrated: (value: boolean) => void;
  setCartOpen: (open: boolean) => void;
  setChub: (face: ChubFace, ink: string) => void;
  setShirt: (id: string) => void;
  add: (line: Omit<BagLine, "id"> & { id?: string }) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
      lines: [],
      hydrated: false,
      cartOpen: false,
      chubFace: "mean",
      chubInk: "orange",
      chubShirt: "black",
      chubFromHome: false,
      setHydrated: (value) => set({ hydrated: value }),
      setCartOpen: (open) => set({ cartOpen: open }),
      setChub: (face, ink) => set({ chubFace: face, chubInk: ink, chubFromHome: true }),
      setShirt: (id) => set({ chubShirt: id }),
      add: (line) => {
        const id =
          line.id ??
          (line.art && !line.ink
            ? `${line.slug}:${line.size}:${line.colorId}:${Date.now()}`
            : `${line.slug}:${line.blankId ?? "house"}:${line.size}:${line.colorId}:${line.ink ?? "house"}:${line.backPrint ? "b" : "f"}`);
        const lines = get().lines.slice();
        const index = lines.findIndex((item) => item.id === id);
        if (index >= 0) {
          lines[index] = { ...lines[index], qty: Math.min(8, lines[index].qty + line.qty) };
        } else {
          lines.push({ ...line, id, qty: Math.min(8, line.qty) });
        }
        set({ lines, cartOpen: true });
      },
      setQty: (id, qty) => {
        if (qty < 1) {
          set({ lines: get().lines.filter((line) => line.id !== id) });
          return;
        }
        set({
          lines: get().lines.map((line) => (line.id === id ? { ...line, qty: Math.min(8, qty) } : line)),
        });
      },
      remove: (id) => set({ lines: get().lines.filter((line) => line.id !== id) }),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "chubz-bag",
      skipHydration: true,
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);

export function bagCount(lines: BagLine[]) {
  return lines.reduce((total, line) => total + line.qty, 0);
}
