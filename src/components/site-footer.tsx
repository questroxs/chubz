import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-display text-4xl leading-none">Chubz</p>
          <p className="mt-3 max-w-xs text-mute">Straight off the wall, onto your back.</p>
        </div>
        <div className="flex flex-col gap-2 text-sm font-semibold uppercase tracking-widest">
          <Link to="/shop" search={{ lane: "all" }} className="min-h-11 py-2 hover:text-pink">
            Shop
          </Link>
          <Link to="/print" className="min-h-11 py-2 hover:text-pink">
            Print yours
          </Link>
          <Link to="/gear" className="min-h-11 py-2 hover:text-pink">
            Gear
          </Link>
          <Link to="/wall" className="min-h-11 py-2 hover:text-pink">
            The Wall
          </Link>
          <Link to="/cart" className="min-h-11 py-2 hover:text-pink">
            Cart
          </Link>
        </div>
        <p className="text-sm text-mute">
          Tees and hoodies print on demand through Ninja POD. Pick the chub color and the shirt. Gear is CJdropshipping bags and markers, with the wholesale price on the listing. chubz.com
        </p>
      </div>
    </footer>
  );
}
