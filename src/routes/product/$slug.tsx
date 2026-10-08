import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ColorPalette } from "@/components/color-palette";
import {
  colorById,
  getProduct,
  HOOD_CHART,
  laneLabel,
  money,
  SIZE_CHART,
  SIZES,
  slugForChub,
  type Size,
} from "@/lib/catalog";
import { WornLook } from "@/components/worn-look";
import { CapMark, hatShape } from "@/components/cap-mark";
import { blankById, blankColors, blankSizesFor, blanksFor, defaultBlankId, type BlankLane } from "@/lib/blanks";
import { CHUB_FACES, CHUB_INKS, faceLabel, faceSrc, inkById, isNewFace, printSrc, renderChub, type ChubFace } from "@/lib/chub-ink";
import { useShop } from "@/lib/shop-store";
import { useOwnerDesk } from "@/lib/owner-desk";
import "@/lib/skate-catalog";

export const Route = createFileRoute("/product/$slug")({
  validateSearch: (search: Record<string, unknown>): { blank?: string } => {
    const blank = typeof search.blank === "string" ? search.blank : "";
    return blankById(blank) ? { blank } : {};
  },
  head: ({ params }) => {
    const product = getProduct(params.slug);
    const title = product ? `${product.name} — Chubz` : "Missing piece — Chubz";
    return {
      meta: [{ title }],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { blank: requestedBlank } = Route.useSearch();
  const navigate = useNavigate();
  const product = getProduct(slug);
  const requested = blankById(requestedBlank);
  const add = useShop((state) => state.add);
  const desk = useOwnerDesk();
  const setChub = useShop((state) => state.setChub);
  const [size, setSize] = useState<Size | null>(null);
  const [qty, setQty] = useState(1);
  const [shot, setShot] = useState(0);
  const [note, setNote] = useState("");
  const openingFace: ChubFace = slug.includes("quest")
    ? "quest"
    : slug.includes("mob")
      ? "mob"
      : slug.includes("spray")
        ? "spray"
        : slug.includes("one-eye")
          ? "thumb"
          : slug.includes("blue")
            ? "blue"
            : slug.includes("green")
              ? "green"
              : "mean";
  const openingWear: BlankLane =
    requested?.lane ?? (product?.lane === "hoodie" ? "hoodie" : product?.lane === "cap" ? "cap" : "tee");
  const openingInk = CHUB_FACES.find((item) => item.face === openingFace)?.ink ?? "orange";
  const openingColor = slug.includes("quest") ? "red" : slug.includes("one-eye") ? "white" : "black";
  const [colorId, setColorId] = useState(openingColor);
  const [face, setFace] = useState<ChubFace>(openingFace);
  const [ink, setInk] = useState(openingInk);
  const [wear, setWear] = useState<BlankLane>(openingWear);
  const [blankId, setBlankId] = useState(requested?.id ?? defaultBlankId(openingWear));
  const [mark, setMark] = useState(faceSrc(openingFace));

  useEffect(() => {
    setFace(openingFace);
    setInk(openingInk);
    setWear(openingWear);
    setBlankId(requested?.id ?? defaultBlankId(openingWear));
    setColorId(openingColor);
    setSize(null);
    setShot(0);
    setNote("");
    setChub(openingFace, openingInk);
  }, [slug]);

  useEffect(() => {
    if (!requested) return;
    setWear(requested.lane);
    setBlankId(requested.id);
    setSize(null);
  }, [requested]);

  useEffect(() => {
    let cancel = false;
    void renderChub(face, ink).then((url) => {
      if (!cancel) setMark(url);
    });
    return () => {
      cancel = true;
    };
  }, [face, ink]);

  if (!product) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-semibold">That piece isn’t up.</h1>
        <Link to="/shop" search={{ lane: "all" }} className="mt-6 inline-flex min-h-11 items-center text-pink">
          Back to the rack
        </Link>
      </main>
    );
  }

  if (product.lane === "skate") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-volt">Deck</p>
        <h1 className="mt-2 text-4xl font-semibold">{product.name}</h1>
        <p className="mt-4 text-mute">This width is on Skateboard gear, with the art upload.</p>
        <Link to="/skate" search={{ deck: product.slug }} className="mt-6 inline-flex min-h-11 items-center bg-yellow px-4 font-semibold uppercase tracking-widest text-yellow-ink">
          Open the deck
        </Link>
      </main>
    );
  }

  const frames = product.looks.filter((look) => look.src);
  const frame = frames[Math.min(shot, Math.max(frames.length - 1, 0))];
  const worn = product.supplier === "printful" && !product.custom;
  const showOrderedLook = Boolean(frame) && worn && wear !== "cap";
  const blank = blankById(blankId) ?? blanksFor(wear)[0];
  const swatches = blankColors(blank.id);
  const color = swatches.find((item) => item.id === colorId) ?? swatches[0] ?? colorById(colorId);
  const fit = blankSizesFor(blank.id, color?.name ?? "");
  const chart = wear === "hoodie" ? HOOD_CHART : SIZE_CHART;
  const faces = CHUB_FACES;

  function addToCart() {
    if (!product) return;
    if (product.oneSize) {
      add({ slug: product.slug, size: "OS", colorId: "black", backPrint: false, qty });
      setNote(`${product.name} is in the cart.`);
      return;
    }
    if (!size || size === "OS") {
      if (fit.length !== 1) {
        setNote("Pick a size first.");
        return;
      }
    }
    const pickedSize = (fit.length === 1 ? fit[0] : size) as Size;
    const pickedColor = swatches.find((item) => item.id === colorId) ?? swatches[0];
    if (!pickedSize || !pickedColor || !fit.includes(pickedSize)) {
      setNote("Pick a color and a size.");
      return;
    }
    const finish = (art?: string) => {
      const sellingLane = wear === "hoodie" ? "hoodie" : wear === "cap" ? "cap" : "tee";
      const selling = !product.custom && (product.lane === "tee" || product.lane === "hoodie" || product.lane === "cap")
        ? getProduct(slugForChub(sellingLane, face)) ?? product
        : product;
      add({
        slug: selling.slug,
        size: pickedSize,
        colorId: pickedColor.id,
        backPrint: false,
        qty,
        art,
        ink: product.custom ? undefined : ink,
        face: product.custom ? undefined : face,
        blankId: product.custom ? undefined : blank.id,
      });
      const inkName = product.custom ? "" : `${faceLabel(face)} · ${inkById(ink).name} · `;
      setNote(`${selling.name} · ${blank.name} · ${inkName}${pickedColor.name} · ${pickedSize} is in the cart.`);
    };
    if (product.custom) {
      finish();
      return;
    }
    if (isNewFace(face)) {
      finish(printSrc(face, ink));
      return;
    }
    void renderChub(face, ink).then((rendered) => {
      const art = rendered.startsWith("data:") ? rendered : undefined;
      if (art && art.length > 180_000) {
        setNote("That color is too heavy to send. Pick it again.");
        return;
      }
      finish(art);
    });
  }

  function openPiece(nextLane: "tee" | "hoodie" | "cap", nextFace: ChubFace) {
    if (nextLane === "cap") {
      setFace(nextFace);
      setWear("cap");
      setBlankId(defaultBlankId("cap"));
      setSize(null);
      setNote("");
      return;
    }
    const next = slugForChub(nextLane, nextFace);
    if (getProduct(next) && next !== slug) {
      void navigate({ to: "/product/$slug", params: { slug: next } });
      return;
    }
    setFace(nextFace);
    setWear(nextLane);
    setBlankId(defaultBlankId(nextLane));
    setSize(null);
    setNote("");
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
      <div>
        {worn && wear === "cap" ? (
          <CapMark
            src={mark}
            alt={`${blank.name} with the ${inkById(ink).name} chub embroidered on the front`}
            hex={color?.hex ?? "#181717"}
            shape={hatShape(blank.id)}
            className="relative aspect-[3/4] w-full overflow-hidden border border-line bg-[#2c2a28]"
          />
        ) : showOrderedLook && frame ? (
          <img
            src={frame.src}
            alt={frame.alt}
            className="aspect-[2/3] w-full border border-line object-cover bg-panel"
          />
        ) : worn ? (
          <WornLook
            face={face}
            ink={ink}
            shirtHex={color?.hex ?? "#141414"}
            alt={`Model in a ${color?.name ?? "black"} tee with the ${inkById(ink).name} chub`}
            className="aspect-[2/3] w-full border border-line bg-panel"
          />
        ) : frame ? (
          <img src={frame.src} alt={frame.alt} className="aspect-[3/4] w-full border border-line object-cover bg-panel" />
        ) : (
          <div className="flex aspect-[3/4] flex-col justify-end border border-line bg-panel p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-yellow">{product.tag}</p>
            <p className="mt-2 text-2xl font-semibold">{product.name}</p>
          </div>
        )}
        {worn ? null : (
          <div className="mt-3 flex gap-2">
            {frames.map((item, index) => (
              <button
                key={item.src + index}
                type="button"
                onClick={() => setShot(index)}
                className={index === shot ? "size-16 overflow-hidden border-2 border-pink" : "size-16 overflow-hidden border border-line"}
                aria-label={`Show photo ${index + 1}`}
              >
                <img src={item.src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-volt">
          {laneLabel(product.lane)} · {product.tag}
          {product.oneSize ? " · one size" : ` · ${color?.name ?? "Black"}`}
        </p>
        <h1 className="mt-2 text-4xl font-semibold">{wear === "cap" ? blank.name : product.name}</h1>
        <p className="mt-3 w-fit bg-yellow px-2 py-1 text-lg font-bold text-yellow-ink">{money(product.custom || product.oneSize ? product.price : blank.price)}</p>
        {desk && (desk.costs[product.oneSize || product.custom ? product.slug : blank.id] ?? desk.costs[product.slug]) != null ? (
          <p className="mt-2 text-sm text-mute">
            Wholesale {money(desk.costs[product.oneSize || product.custom ? product.slug : blank.id] ?? desk.costs[product.slug])}.
          </p>
        ) : null}
        <p className="mt-4 text-lg">{product.blurb}</p>
        <ul className="mt-4 space-y-2 text-mute">
          {(worn
            ? [`${blank.note} ${blank.lane === "cap" ? "Embroidered on the front." : "Printed on the front."}`, ...product.details.slice(1)]
            : product.details
          )
            .concat(desk?.notes[product.slug] ? [desk.notes[product.slug]] : [])
            .map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>

        {product.oneSize || product.custom ? null : (
          <div className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-widest">Chub</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {faces.map((option) => {
                const active = face === option.face;
                return (
                  <button
                    key={option.face}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setInk(option.ink);
                      setChub(option.face, option.ink);
                      openPiece(wear === "cap" ? "tee" : wear, option.face);
                    }}
                    className={active ? "border-2 border-pink bg-panel p-2" : "border border-line bg-panel p-2"}
                  >
                    <img
                      src={faceSrc(option.face)}
                      alt=""
                      className="mx-auto h-32 w-full object-contain"
                    />
                    <span className="mt-1 block text-xs font-semibold uppercase tracking-widest">{option.label}</span>
                  </button>
                );
              })}
            </div>
            <fieldset className="mt-4">
              <legend className="text-sm font-semibold uppercase tracking-widest">Chub color</legend>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {CHUB_INKS.map((swatch) => (
                  <button
                    key={swatch.id}
                    type="button"
                    aria-label={swatch.name}
                    aria-pressed={ink === swatch.id}
                    title={swatch.name}
                    onClick={() => {
                      setInk(swatch.id);
                      setChub(face, swatch.id);
                    }}
                    className={ink === swatch.id ? "size-11 border-2 border-pink" : "size-11 border border-line"}
                    style={{ background: swatch.hex }}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-mute">
                {inkById(ink).name} print. {wear === "cap" ? "Cap" : "Shirt"} stays {color?.name ?? "black"} until you change it below.
              </p>
            </fieldset>
          </div>
        )}

        {product.oneSize || product.custom ? null : (
          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-widest">Wear it on</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["tee", "hoodie", "cap"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={wear === option}
                  onClick={() => openPiece(option, face)}
                  className={wear === option ? "min-h-11 bg-pink px-3 font-semibold uppercase tracking-widest text-pink-ink" : "min-h-11 border border-line bg-panel px-3 font-semibold uppercase tracking-widest"}
                >
                  {option === "tee" ? "Tee" : option === "hoodie" ? "Hoodie" : "Cap"}
                </button>
              ))}
            </div>
            {wear === "cap" ? (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {blanksFor("cap").map((option) => {
                  const active = option.id === blank.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setBlankId(option.id);
                        setSize(null);
                        setNote("");
                      }}
                      className={
                        active
                          ? "min-h-16 border-2 border-pink bg-panel px-3 py-2 text-left"
                          : "min-h-16 border border-line bg-panel px-3 py-2 text-left"
                      }
                    >
                      <span className="block font-semibold">{option.name}</span>
                      <span className="text-sm text-yellow">{money(option.price)}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <label className="mt-4 block">
                <span className="text-sm font-semibold uppercase tracking-widest">Blank</span>
                <select
                  className="mt-2 w-full min-h-11 border border-line bg-ink px-3 text-paper"
                  value={blank.id}
                  onChange={(event) => {
                    setBlankId(event.target.value);
                    setSize(null);
                    setNote("");
                  }}
                >
                  {blanksFor(wear).map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name} · {money(option.price)}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <p className="mt-2 text-sm text-mute">{blank.note} {blank.lane === "cap" ? "Embroidered on the front." : "Printed on the front."}</p>
          </div>
        )}

        {product.oneSize ? null : (
          <>
            <div className="mt-8">
              <ColorPalette
                lane={wear === "cap" ? "tee" : wear}
                value={color?.id ?? colorId}
                colors={swatches.map((swatch) => ({ ...swatch, group: "solid", tee: true, hood: true }))}
                onChange={(id) => {
                  setColorId(id);
                  setShirt(id);
                }}
              />
            </div>
            <fieldset className="mt-6">
              <legend className="text-sm font-semibold uppercase tracking-widest">Size</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {fit.map((option) => {
                  const active = option === size || (fit.length === 1 && option === fit[0]);
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
                          : "min-h-11 min-w-14 border border-line bg-panel px-3 font-bold text-paper hover:border-paper"
                      }
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            {blank.lane === "cap" ? null : (
            <details className="mt-4 border border-line bg-panel px-4 py-3">
              <summary className="cursor-pointer font-semibold">Size chart</summary>
              <table className="mt-3 w-full text-left text-sm">
                <thead className="text-mute">
                  <tr>
                    <th className="py-2 font-medium">Size</th>
                    <th className="py-2 font-medium">Chest</th>
                    <th className="py-2 font-medium">Body</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZES.map((option) => (
                    <tr key={option} className="border-t border-line">
                      <td className="py-2 font-semibold">{option}</td>
                      <td className="py-2">{chart[option].chest}</td>
                      <td className="py-2">{chart[option].length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-sm text-mute">House chart for the Gildan blanks. Other blanks fit a little different. XS shows up when that blank has it.</p>
            </details>
            )}
          </>
        )}

        <div className="mt-6 flex items-center gap-3">
          <span className="text-sm font-semibold uppercase tracking-widest">Qty</span>
          <button type="button" className="size-11 border border-line bg-panel text-lg" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">
            −
          </button>
          <span className="w-6 text-center font-semibold" aria-live="polite">
            {qty}
          </span>
          <button type="button" className="size-11 border border-line bg-panel text-lg" onClick={() => setQty((value) => Math.min(8, value + 1))} aria-label="Increase quantity">
            +
          </button>
        </div>
        <button
          type="button"
          onClick={addToCart}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center bg-pink px-5 text-lg font-semibold uppercase tracking-widest text-pink-ink sm:w-auto"
        >
          {product.oneSize ? "Add to cart" : fit.length === 1 ? `Add ${fit[0]} to cart` : size && fit.includes(size) ? `Add ${size} to cart` : "Pick a size"}
        </button>
        {note ? (
          <p className="mt-3 text-yellow" role="status">
            {note}
          </p>
        ) : null}
      </div>
    </main>
  );
}
