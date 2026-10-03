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
          <Link to="/skate" className="min-h-11 py-2 hover:text-pink">
            Skate
          </Link>
          <Link to="/wall" className="min-h-11 py-2 hover:text-pink">
            The Wall
          </Link>
          <Link to="/cart" className="min-h-11 py-2 hover:text-pink">
            Cart
          </Link>
          <Link to="/policies" className="min-h-11 py-2 hover:text-pink">
            Policies
          </Link>
        </div>
        <div className="text-sm text-mute">
          <p>
            Tees, hoodies, and embroidered caps are made to order through Printful. Gear ships from CJdropshipping. Questions:{" "}
            <a className="text-paper underline" href="mailto:questroxs18@gmail.com">
              questroxs18@gmail.com
            </a>
          </p>
          <p className="mt-3">
            <a className="hover:text-pink" href="https://mrchubz.com">
              mrchubz.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
