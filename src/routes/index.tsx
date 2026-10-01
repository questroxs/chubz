import { createFileRoute, Link } from "@tanstack/react-router";
import { ColorPalette } from "@/components/color-palette";
import { ProductCard } from "@/components/product-card";
import { WornLook } from "@/components/worn-look";
import { CHUB_FACES, CHUB_INKS, inkById } from "@/lib/chub-ink";
import { colorById, FREE_SHIP_AT, products, SIZES } from "@/lib/catalog";
import { useShop } from "@/lib/shop-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chubz — Straight off the wall" },
      {
        name: "description",
        content: "Black tees and hoodies with the chub. Print on demand. S through XXL.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const face = useShop((state) => state.chubFace);
  const ink = useShop((state) => state.chubInk);
  const shirtId = useShop((state) => state.chubShirt);
  const setChub = useShop((state) => state.setChub);
  const setShirt = useShop((state) => state.setShirt);
  const shirt = colorById(shirtId);

  return (
    <main>
      <section className="relative border-b border-line">
        <img
          src="/art/chubz-crew.png"
          alt="CHUBZ graffiti with the orange, blue, and green chubs"
          className="max-h-[78vh] w-full bg-ink object-contain"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-6xl flex-col gap-4 px-4 pb-8 md:pb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow">Drop 01 · the chub</p>
          <h1 className="font-display text-6xl leading-none text-paper md:text-8xl">Chubz</h1>
          <p className="max-w-xl text-xl text-paper md:text-2xl">Straight off the wall, onto your back.</p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/shop"
              search={{ lane: "all" }}
              className="inline-flex min-h-11 items-center bg-pink px-5 font-semibold uppercase tracking-widest text-pink-ink"
            >
              Shop the drop
            </Link>
            <Link
              to="/print"
              className="inline-flex min-h-11 items-center border border-paper px-5 font-semibold uppercase tracking-widest text-paper"
            >
              Print your art
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-start gap-8 px-4 py-14 md:grid-cols-[1.2fr_0.8fr]">
        <WornLook
          face={face}
          ink={ink}
          shirtHex={shirt?.hex ?? "#141414"}
          alt={`Model in a ${shirt?.name ?? "black"} tee with the ${inkById(ink).name} ${face === "green" ? "round-eye" : face === "blue" ? "slanted-eye" : "X-eye"} chub`}
          className="aspect-[2/3] w-full border border-line object-cover"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-pink">On the model</p>
          <h2 className="mt-2 text-3xl font-semibold">Print your chub.</h2>
          <p className="mt-3 text-mute">
            Three originals. X eyes, slanted eyes, round eyes. The print changes color. The shirt stays black until you pick a shirt color.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {CHUB_FACES.map((option) => {
              const active = face === option.face;
              return (
                <button
                  key={option.face}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setChub(option.face, option.ink)}
                  className={active ? "border-2 border-pink bg-panel p-2" : "border border-line bg-panel p-2"}
                >
                  <img src={`/art/chub-${option.face === "mean" ? "orange" : option.face}.png`} alt="" className="mx-auto h-36 w-full object-contain" />
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-widest">{option.label}</span>
                </button>
              );
            })}
          </div>
          <fieldset className="mt-5">
            <legend className="text-sm font-semibold uppercase tracking-widest">Chub color</legend>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {CHUB_INKS.map((swatch) => (
                <button
                  key={swatch.id}
                  type="button"
                  aria-label={swatch.name}
                  aria-pressed={ink === swatch.id}
                  onClick={() => setChub(face, swatch.id)}
                  className={ink === swatch.id ? "size-11 border-2 border-pink" : "size-11 border border-line"}
                  style={{ background: swatch.hex }}
                />
              ))}
            </div>
            <p className="mt-2 text-sm">
              {inkById(ink).name} chub · {shirt?.name ?? "Black"} shirt
            </p>
          </fieldset>
          <div className="mt-5">
            <ColorPalette lane="tee" value={shirtId} onChange={setShirt} />
          </div>
          <Link
            to="/product/$slug"
            params={{ slug: face === "blue" ? "blue-mood-tee" : "mean-orange-tee" }}
            className="mt-6 inline-flex min-h-11 items-center bg-pink px-5 font-semibold uppercase tracking-widest text-pink-ink"
          >
            Print this chub
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold">On the rack</h2>
          <Link to="/shop" search={{ lane: "all" }} className="text-sm font-semibold uppercase tracking-widest text-volt">
            All pieces
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold">The run</h2>
        <p className="mt-2 max-w-lg text-mute">
          S through XXL on every piece. Boxy on purpose — size down if you want it closer. Hoodies use the
          same letters and hang a little longer.
        </p>
        <ol className="mt-6 grid grid-cols-5 gap-2">
          {SIZES.map((size) => (
            <li key={size} className="border border-line bg-panel py-5 text-center">
              <span className="text-xl font-bold md:text-4xl">{size}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-line bg-panel">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-pink">01</p>
            <h3 className="mt-2 text-xl font-semibold">Pick a size</h3>
            <p className="mt-2 text-mute">Tee or hoodie. Pick the chub color and the shirt color. S, M, L, XL, XXL.</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-yellow">02</p>
            <h3 className="mt-2 text-xl font-semibold">It prints</h3>
            <p className="mt-2 text-mute">Ninja POD prints the DTF after Stripe clears the order. Nothing sits on a shelf.</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-volt">03</p>
            <h3 className="mt-2 text-xl font-semibold">About a week</h3>
            <p className="mt-2 text-mute">
              Production is about 2–4 business days, then transit. Free shipping over ${FREE_SHIP_AT}. Pay on Stripe.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">House fits</h2>
            <p className="mt-2 text-mute">Campaign shots. Tag your own on the wall.</p>
          </div>
          <Link to="/wall" className="text-sm font-semibold uppercase tracking-widest text-pink">
            The wall
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2 md:gap-4">
          <img src="/looks/orange-tee-b.jpg" alt="House fit, orange chub tee" className="aspect-[3/4] w-full object-cover" />
          <img src="/looks/blue-hoodie.jpg" alt="House fit, blue chub hoodie" className="aspect-[3/4] w-full object-cover" />
          <img src="/looks/blue-tee-a.jpg" alt="House fit, blue chub tee" className="aspect-[3/4] w-full object-cover" />
        </div>
      </section>
    </main>
  );
}
