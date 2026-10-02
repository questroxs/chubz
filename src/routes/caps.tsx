import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { WornCap } from "@/components/worn-cap";
import { ColorPalette } from "@/components/color-palette";
import { blankById, blankColors, blankSizesFor, blanksFor, type Blank } from "@/lib/blanks";
import { getProduct, money, slugForChub, type Size } from "@/lib/catalog";
import { CHUB_FACES, CHUB_INKS, inkById, renderChub, type ChubFace } from "@/lib/chub-ink";
import { useShop } from "@/lib/shop-store";
import { useOwnerDesk } from "@/lib/owner-desk";

function HatMenu({
  caps,
  value,
  onChange,
}: {
  caps: Blank[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = caps.find((item) => item.id === value) ?? caps[0];
  return (
    <div className="relative mt-4">
      <span className="text-sm font-semibold uppercase tracking-widest">Embroidery</span>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
        className="mt-2 flex w-full items-center gap-3 border border-line bg-ink p-2 text-left"
      >
        <img src={`/caps/${selected.id}.jpg`} alt="" className="h-28 w-24 shrink-0 bg-white object-contain" />
        <span className="min-w-0 flex-1">
          <span className="block text-lg font-semibold">{selected.name}</span>
          <span className="block text-sm text-mute">Front · {money(selected.price)}</span>
        </span>
        <span aria-hidden="true" className="px-2 text-lg">
          {open ? "▴" : "▾"}
        </span>
      </button>
      {open ? (
        <ul role="listbox" className="absolute z-30 mt-1 max-h-80 w-full overflow-auto border border-line bg-ink">
          {caps.map((option) => {
            const active = option.id === selected.id;
            return (
              <li key={option.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(option.id);
                    setOpen(false);
                  }}
                  className={
                    active
                      ? "flex w-full items-center gap-3 bg-panel p-2 text-left"
                      : "flex w-full items-center gap-3 p-2 text-left"
                  }
                >
                  <img src={`/caps/${option.id}.jpg`} alt="" className="h-16 w-14 shrink-0 bg-white object-contain" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{option.name}</span>
                    <span className="block text-sm text-mute">Front · {money(option.price)}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
      <p className="mt-2 text-sm text-mute">
        {selected.note} Hat style only. The sample mark is not your order. You get the chub.
      </p>
    </div>
  );
}

export const Route = createFileRoute("/caps")({
  validateSearch: (search: Record<string, unknown>): { blank?: string } => {
    const blank = typeof search.blank === "string" ? search.blank : "";
    const found = blankById(blank);
    return found?.lane === "cap" ? { blank } : {};
  },
  head: () => ({
    meta: [
      { title: "Embroidered caps — Chubz" },
      { name: "description", content: "Models in Printful caps. Pick the chub and the embroidery." },
    ],
  }),
  component: CapsPage,
});

function CapsPage() {
  const { blank: requested } = Route.useSearch();
  const add = useShop((state) => state.add);
  const desk = useOwnerDesk();
  const caps = blanksFor("cap");
  const [face, setFace] = useState<ChubFace>("mean");
  const [ink, setInk] = useState("orange");
  const [blankId, setBlankId] = useState(requested && blankById(requested) ? requested : "cap-dad");
  const [colorId, setColorId] = useState("black");
  const [size, setSize] = useState<Size | null>(null);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const blank = blankById(blankId) ?? caps[0];
  const swatches = blankColors(blank.id);
  const color = swatches.find((item) => item.id === colorId) ?? swatches[0];
  const fit = blankSizesFor(blank.id, color?.name ?? "");
  const readySize = (fit.length === 1 ? fit[0] : fit.includes(size ?? "") ? size : null) as Size | null;

  function addToCart() {
    if (!readySize || !color) {
      setNote("Pick a size first.");
      return;
    }
    const selling = getProduct(slugForChub("cap", face));
    if (!selling) return;
    const finish = (art?: string) => {
      add({
        slug: selling.slug,
        size: readySize,
        colorId: color.id,
        backPrint: false,
        qty,
        art,
        ink,
        blankId: blank.id,
      });
      setNote(`${selling.name} · ${blank.name} · ${inkById(ink).name} chub · ${color.name} · ${readySize} is in the cart.`);
    };
    void renderChub(face, ink).then((rendered) => {
      const art = rendered.startsWith("data:") ? rendered : undefined;
      if (art && art.length > 180_000) {
        setNote("That color is too heavy to send. Pick it again.");
        return;
      }
      finish(art);
    });
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
      <div>
        <WornCap
          face={face}
          ink={ink}
          blankId={blank.id}
          alt={`Model wearing a ${blank.name} with the ${inkById(ink).name} chub embroidered on the front`}
          className="aspect-[3/4] w-full border border-line bg-panel object-cover"
        />
        <p className="mt-2 text-sm text-mute">Model is in black. The cap you buy is {color?.name ?? "black"}.</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-volt">Printful · embroidery front</p>
        <h1 className="mt-2 text-4xl font-semibold">Embroidered caps</h1>
        <p className="mt-3 w-fit bg-yellow px-2 py-1 text-lg font-bold text-yellow-ink">{money(blank.price)}</p>
        {desk && desk.costs[blank.id] != null ? (
          <p className="mt-2 text-sm text-mute">Wholesale {money(desk.costs[blank.id])}.</p>
        ) : null}
        <p className="mt-4 text-lg">The chub is stitched on the front. Unisex. Pick the face, then the hat.</p>

        <label className="mt-8 block">
          <span className="text-sm font-semibold uppercase tracking-widest">Chub</span>
          <select
            className="mt-2 w-full min-h-11 border border-line bg-ink px-3 text-paper"
            value={face}
            onChange={(event) => {
              const next = event.target.value as ChubFace;
              const option = CHUB_FACES.find((item) => item.face === next);
              setFace(next);
              if (option) setInk(option.ink);
              setNote("");
            }}
          >
            {CHUB_FACES.map((option) => (
              <option key={option.face} value={option.face}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-semibold uppercase tracking-widest">Chub color</span>
          <select
            className="mt-2 w-full min-h-11 border border-line bg-ink px-3 text-paper"
            value={ink}
            onChange={(event) => {
              setInk(event.target.value);
              setNote("");
            }}
          >
            {CHUB_INKS.map((swatch) => (
              <option key={swatch.id} value={swatch.id}>
                {swatch.name}
              </option>
            ))}
          </select>
        </label>

        <HatMenu
          caps={caps}
          value={blank.id}
          onChange={(id) => {
            setBlankId(id);
            setSize(null);
            setNote("");
          }}
        />

        <div className="mt-8">
          <ColorPalette
            lane="tee"
            value={color?.id ?? colorId}
            colors={swatches.map((swatch) => ({ ...swatch, group: "solid", tee: true, hood: true }))}
            onChange={(id) => {
              setColorId(id);
              setSize(null);
            }}
          />
        </div>

        <fieldset className="mt-6">
          <legend className="text-sm font-semibold uppercase tracking-widest">Size</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {fit.map((option) => {
              const active = option === readySize;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setSize(option as Size);
                    setNote("");
                  }}
                  className={
                    active
                      ? "min-h-11 min-w-14 bg-pink px-3 font-bold text-pink-ink"
                      : "min-h-11 min-w-14 border border-line bg-panel px-3 font-bold"
                  }
                >
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-6 flex items-center gap-3">
          <span className="text-sm font-semibold uppercase tracking-widest">Qty</span>
          <button type="button" className="size-11 border border-line bg-panel text-lg" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">
            −
          </button>
          <span className="w-6 text-center font-semibold">{qty}</span>
          <button type="button" className="size-11 border border-line bg-panel text-lg" onClick={() => setQty((value) => Math.min(8, value + 1))} aria-label="Increase quantity">
            +
          </button>
        </div>
        <button
          type="button"
          onClick={addToCart}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center bg-pink px-5 text-lg font-semibold uppercase tracking-widest text-pink-ink sm:w-auto"
        >
          {readySize ? `Add ${readySize} to cart` : "Pick a size"}
        </button>
        {note ? (
          <p className="mt-3 text-yellow" role="status">
            {note}
          </p>
        ) : null}
        <p className="mt-6 text-sm text-mute">
          Tees and hoodies stay on the <Link to="/shop" search={{ lane: "all" }} className="text-paper underline">rack</Link>.
        </p>
      </div>
    </main>
  );
}
