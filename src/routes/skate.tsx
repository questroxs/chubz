import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { compressImage } from "@/lib/compress-image";
import { money } from "@/lib/catalog";
import { useOwnerDesk } from "@/lib/owner-desk";
import { skateProducts } from "@/lib/skate-catalog";
import { useShop } from "@/lib/shop-store";

export const Route = createFileRoute("/skate")({
  validateSearch: (search: Record<string, unknown>): { deck?: string } => {
    const deck = typeof search.deck === "string" ? search.deck : "";
    return /^steep-\d{3}$/.test(deck) ? { deck } : {};
  },
  head: () => ({
    meta: [
      { title: "Skateboard gear — Chubz" },
      { name: "description", content: "Steep skate decks. Upload the graphic for the bottom." },
    ],
  }),
  component: SkatePage,
});

const SHAPES = [
  { name: "Mellow", note: "Mellow concave, top-dyed veneer, custom bottom print." },
  { name: "8.75 / 9 / pig / fish", note: "Wider shapes. Point’s artboard for these is 11 × 35 in, 3300 × 10500 px." },
  { name: "36\" pintail", note: "Longboard pintail, custom bottom print." },
  { name: "40\" pintail", note: "Longboard pintail, custom bottom print." },
];

const PARTS = [
  {
    name: "Grip tape",
    note: "Die-cut grip. Premium grit on a perforated sheet. Point’s minimum is 100 sheets. Point does not publish a one-off grip photo.",
  },
  {
    name: "Wheels",
    note: "Custom printed wheels. 25 sets minimum. Sizes and colors can mix inside one graphic. No single-set photo from Point.",
  },
  {
    name: "Trucks",
    note: "Stock trucks in 5.0, 5.25, 5.5, and longboard. Pad-printed hangers. 25 sets minimum. No one-off truck photo from Point.",
  },
];

function SkatePage() {
  const requested = Route.useSearch().deck;
  const [slug, setSlug] = useState(requested ?? "steep-800");
  const add = useShop((state) => state.add);
  const desk = useOwnerDesk();
  const [art, setArt] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (requested) setSlug(requested);
  }, [requested]);

  const deck = skateProducts.find((item) => item.slug === slug) ?? skateProducts.find((item) => item.slug === "steep-800") ?? skateProducts[0];

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setNote("");
    try {
      const jpeg = await compressImage(file, 1400);
      if (jpeg.length > 180_000) {
        setNote("That file is still heavy. Crop it and try again.");
        setArt(null);
      } else {
        setArt(jpeg);
      }
    } catch (error) {
      setNote(error instanceof Error ? error.message : "Couldn’t read that file.");
    } finally {
      setBusy(false);
    }
  }

  function addDeck() {
    if (!deck) return;
    if (!art) {
      setNote("Upload the graphic first. PNG or JPG.");
      return;
    }
    add({ slug: deck.slug, size: "OS", colorId: "black", backPrint: false, qty: 1, art });
    setNote(`${deck.name} is in the cart.`);
  }

  if (!deck) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-semibold">That page isn’t on this shop.</h1>
      </main>
    );
  }

  const cost = desk?.costs[deck.slug];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-volt">Point Distribution · Las Vegas</p>
      <h1 className="mt-2 text-4xl font-semibold">Skateboard gear</h1>
      <p className="mt-3 max-w-2xl text-mute">
        Steep decks, printed on the bottom. Pick a width and upload the graphic.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <img
            src="/skate/steep-top.jpg"
            alt="Point’s 8.00 steep deck. The graphic on the board is their sample, not your order."
            className="w-full border border-line bg-white object-contain"
          />
          <p className="mt-2 text-sm text-mute">Point’s 8.00 steep photo. The sample graphic is not your order.</p>
          <div className="mt-4 border border-line bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink">Your file on a blank</p>
            <div className="mx-auto mt-3 flex h-80 w-28 items-center justify-center rounded-[40%] bg-[#e7d3b0]">
              {art ? (
                <img src={art} alt="Your deck graphic" className="max-h-[70%] max-w-[80%] object-contain" />
              ) : (
                <span className="px-2 text-center text-xs font-semibold uppercase tracking-widest text-ink">Upload</span>
              )}
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-yellow">{deck.tag} steep</p>
          <h2 className="mt-1 text-3xl font-semibold">{deck.name}</h2>
          <p className="mt-3 w-fit bg-yellow px-2 py-1 text-lg font-bold text-yellow-ink">{money(deck.price)}</p>
          {cost != null ? <p className="mt-2 text-sm text-mute">Wholesale {money(cost)}</p> : null}
          {desk?.notes[deck.slug] ? <p className="mt-2 text-sm text-mute">{desk.notes[deck.slug]}</p> : null}
          <p className="mt-4 text-mute">{deck.blurb}</p>
          <ul className="mt-4 space-y-2 text-sm text-mute">
            {deck.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>

          <fieldset className="mt-6">
            <legend className="text-sm font-semibold uppercase tracking-widest">Width</legend>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {skateProducts.map((item) => {
                const active = item.slug === deck.slug;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSlug(item.slug)}
                    className={active ? "border-2 border-pink bg-white p-2" : "border border-line bg-white p-2"}
                  >
                    <img src={item.looks[1]?.src} alt="" className="h-10 w-full object-contain" />
                    <span className="mt-1 block text-xs font-semibold uppercase tracking-widest text-ink">{item.tag}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <input
            id="deck-file"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(event) => void onFile(event.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => document.getElementById("deck-file")?.click()}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center border border-line px-5 text-sm font-semibold uppercase tracking-widest sm:w-auto"
          >
            {busy ? "Reading…" : art ? "Change graphic" : "Upload graphic"}
          </button>
          <button
            type="button"
            onClick={addDeck}
            className="mt-3 inline-flex min-h-12 w-full items-center justify-center bg-yellow px-5 text-lg font-semibold uppercase tracking-widest text-yellow-ink sm:ml-3 sm:mt-6 sm:w-auto"
          >
            Add deck
          </button>
          {note ? <p className="mt-3 text-sm">{note}</p> : null}
        </div>
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold">Also on their shop</h2>
        <p className="mt-2 max-w-2xl text-sm text-mute">
          Point sells these too. They are not in the cart yet.
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {SHAPES.map((shape) => (
            <li key={shape.name} className="border border-line bg-panel p-4">
              <p className="font-semibold">{shape.name}</p>
              <p className="mt-1 text-sm text-mute">{shape.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold">Grip, wheels, trucks</h2>
        <p className="mt-2 max-w-2xl text-sm text-mute">
          Same company. These are wholesale minimums, not one-off photos, so nothing here is invented and nothing is in the cart.
        </p>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {PARTS.map((part) => (
            <li key={part.name} className="border border-line bg-panel p-4">
              <p className="text-lg font-semibold">{part.name}</p>
              <p className="mt-2 text-sm text-mute">{part.note}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-mute">
          Point Distribution, 3050 Westwood Drive #A17, Las Vegas, NV 89109. (702) 222-1204. info@pointdistribution.com.
        </p>
      </section>
    </main>
  );
}
