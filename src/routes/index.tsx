import { createFileRoute, Link } from "@tanstack/react-router";
import { ColorPalette } from "@/components/color-palette";
import { HomeIntro } from "@/components/home-intro";
import { ProductCard } from "@/components/product-card";
import { WornLook } from "@/components/worn-look";
import { CHUB_FACES, CHUB_INKS, faceSrc, inkById } from "@/lib/chub-ink";
import { colorById, FREE_SHIP_AT, products, SIZES, slugForChub } from "@/lib/catalog";
import { useShop } from "@/lib/shop-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chubz — Straight off the wall" },
      {
        name: "description",
        content: "Tees, hoodies, and embroidered caps with the chub. Unisex blanks from Printful.",
      },
    ],
    links: [
      { rel: "preload", as: "image", href: "/art/quest-wall.jpg" },
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
      <HomeIntro />
      <section
        className="relative w-full overflow-hidden border-b border-line bg-ink"
      >
        <img
          src="/art/quest-wall.jpg"
          alt="Quest and Chubz graffiti with the orange, blue, and green characters"
          width={1968}
          height={1008}
          decoding="sync"
          fetchPriority="high"
          className="h-auto max-h-[78vh] w-full object-contain"
          onError={(event) => event.currentTarget.remove()}
        />
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8">
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
              to="/caps"
              className="inline-flex min-h-11 items-center bg-yellow px-5 font-semibold uppercase tracking-widest text-yellow-ink"
            >
              Embroidered caps
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

      <div className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-mute">Steep decks · your graphic on the bottom</p>
          <Link to="/skate" className="inline-flex min-h-11 shrink-0 items-center text-sm font-semibold uppercase tracking-widest text-paper hover:text-pink">
            Skate
          </Link>
        </div>
      </div>

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
            Spray, Quest, One Eye, and Mob. Pick a character, then a color. The model changes with every swatch.
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
                  <img src={faceSrc(option.face)} alt="" loading="lazy" decoding="async" className="mx-auto h-36 w-full object-contain" />
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
            params={{ slug: slugForChub("tee", face) }}
            className="mt-6 inline-flex min-h-11 items-center bg-pink px-5 font-semibold uppercase tracking-widest text-pink-ink"
          >
            Print this chub
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">On the models</h2>
            <p className="mt-2 text-mute">Different characters. The color on the shirt is the color that prints.</p>
          </div>
          <Link to="/shop" search={{ lane: "all" }} className="text-sm font-semibold uppercase tracking-widest text-volt">
            The rack
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
          <Link to="/product/$slug" params={{ slug: "spray-tee" }}>
            <img src="/looks/fit-tee-black.jpg" alt="Black tee with the orange spray character" className="aspect-[2/3] w-full object-cover" />
          </Link>
          <Link to="/product/$slug" params={{ slug: "quest-tee" }}>
            <img src="/looks/fit-tee-red.jpg" alt="Red tee with blue Quest" className="aspect-[2/3] w-full object-cover" />
          </Link>
          <Link to="/product/$slug" params={{ slug: "one-eye-tee" }}>
            <img src="/looks/fit5-tee-white.jpg" alt="White tee with the green marker character" className="aspect-[2/3] w-full object-cover" />
          </Link>
          <Link to="/product/$slug" params={{ slug: "mob-tee" }}>
            <img src="/looks/fit-tee-latina.jpg" alt="Black tee with Mob" className="aspect-[2/3] w-full object-cover" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-6 pt-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">On the hoodies</h2>
            <p className="mt-2 text-mute">Same four characters. Black, red, white, and black.</p>
          </div>
          <Link to="/shop" search={{ lane: "hoodie" }} className="text-sm font-semibold uppercase tracking-widest text-volt">
            Hoodies
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
          <Link to="/product/$slug" params={{ slug: "spray-hood" }}>
            <img src="/looks/fit-hood-black.jpg" alt="Black hoodie with the orange spray character" className="aspect-[2/3] w-full object-cover" />
          </Link>
          <Link to="/product/$slug" params={{ slug: "quest-hood" }}>
            <img src="/looks/fit4-hood-red.jpg" alt="Red hoodie with blue Quest" className="aspect-[2/3] w-full object-cover" />
          </Link>
          <Link to="/product/$slug" params={{ slug: "one-eye-hood" }}>
            <img src="/looks/fit4-hood-white.jpg" alt="White hoodie with the green marker character" className="aspect-[2/3] w-full object-cover" />
          </Link>
          <Link to="/product/$slug" params={{ slug: "mob-hood" }}>
            <img src="/looks/fit-hood-latina.jpg" alt="Black hoodie with Mob" className="aspect-[2/3] w-full object-cover" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-6 pt-10">
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
            <p className="mt-2 text-mute">Tee or hoodie. Pick the chub color and the shirt color. Caps are on their own page.</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-yellow">02</p>
            <h3 className="mt-2 text-xl font-semibold">It prints</h3>
            <p className="mt-2 text-mute">Printful prints the shirt, or embroiders the cap, after Stripe clears the order. Nothing sits on a shelf.</p>
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
            <p className="mt-2 text-mute">Same models, closer crop. Tag your own on the wall.</p>
          </div>
          <Link to="/wall" className="text-sm font-semibold uppercase tracking-widest text-pink">
            The wall
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2 md:gap-4">
          <img src="/art/chub-spray.png" alt="Spray character" className="aspect-[3/4] w-full bg-ink object-contain" />
          <img src="/art/chub-quest.jpg" alt="Quest on the wall" className="aspect-[3/4] w-full object-cover" />
          <img src="/art/chub-thumb.png" alt="Green one-eyed character" className="aspect-[3/4] w-full bg-ink object-contain" />
        </div>
      </section>
    </main>
  );
}
