import { Link } from "@tanstack/react-router";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { bagCount, useShop } from "@/lib/shop-store";

export function SiteHeader() {
  const hydrated = useShop((state) => state.hydrated);
  const count = useShop((state) => bagCount(state.lines));
  const setCartOpen = useShop((state) => state.setCartOpen);
  const [open, setOpen] = useState(false);
  const shown = hydrated ? count : 0;

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ink/95 backdrop-blur">
      <div className="overflow-hidden border-b border-line bg-pink text-pink-ink">
        <div className="ticker-track">
          {Array.from({ length: 2 }).map((_, copy) => (
            <p key={copy} className="flex shrink-0 gap-8 px-4 py-2 text-sm font-semibold uppercase tracking-widest">
              <span>Straight off the wall, onto your back</span>
              <span aria-hidden="true">mrchubz.com</span>
              <span aria-hidden="true">Printful · DTF</span>
              <span aria-hidden="true">S · M · L · XL · XXL</span>
              <span aria-hidden="true">Your art or the chub</span>
              <span aria-hidden="true">Free ship over $90</span>
            </p>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link to="/" className="font-display text-3xl leading-none text-paper" onClick={() => setOpen(false)}>
          Chubz
        </Link>
        <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="Primary">
          <Link to="/shop" search={{ lane: "all" }} className="px-3 py-2 text-sm font-semibold uppercase tracking-widest text-mute hover:text-paper">
            Shop
          </Link>
          <Link to="/print" className="px-3 py-2 text-sm font-semibold uppercase tracking-widest text-mute hover:text-paper">
            Print yours
          </Link>
          <Link to="/gear" className="px-3 py-2 text-sm font-semibold uppercase tracking-widest text-mute hover:text-paper">
            Gear
          </Link>
          <Link to="/wall" className="px-3 py-2 text-sm font-semibold uppercase tracking-widest text-mute hover:text-paper">
            The Wall
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="inline-flex min-h-11 items-center gap-2 border border-line bg-panel px-3 text-sm font-semibold uppercase tracking-widest text-paper hover:border-yellow"
            aria-label={`Cart, ${shown} items`}
          >
            <ShoppingCart className="size-4" aria-hidden="true" />
            Cart
            <span className="bg-yellow px-1.5 text-yellow-ink">{shown}</span>
          </button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center border border-line bg-panel text-paper md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="flex flex-col border-t border-line px-4 py-2 md:hidden" aria-label="Mobile">
          <Link to="/shop" search={{ lane: "all" }} className="min-h-11 py-3 text-lg font-semibold uppercase tracking-widest" onClick={() => setOpen(false)}>
            Shop
          </Link>
          <Link to="/print" className="min-h-11 py-3 text-lg font-semibold uppercase tracking-widest" onClick={() => setOpen(false)}>
            Print yours
          </Link>
          <Link to="/gear" className="min-h-11 py-3 text-lg font-semibold uppercase tracking-widest" onClick={() => setOpen(false)}>
            Gear
          </Link>
          <Link to="/wall" className="min-h-11 py-3 text-lg font-semibold uppercase tracking-widest" onClick={() => setOpen(false)}>
            The Wall
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
