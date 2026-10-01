import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ColorPalette } from "@/components/color-palette";
import { compressImage } from "@/lib/compress-image";
import {
  BACK_PRINT_PRICE,
  colorById,
  customProducts,
  colorsFor,
  money,
  SIZES,
  type Size,
} from "@/lib/catalog";
import { useShop } from "@/lib/shop-store";

export const Route = createFileRoute("/print")({
  head: () => ({
    meta: [{ title: "Print yours — Chubz" }, { name: "description", content: "Upload art. Pick a Gildan color and size. Ninja POD prints it." }],
  }),
  component: PrintPage,
});

function PrintPage() {
  const add = useShop((state) => state.add);
  const [lane, setLane] = useState<"tee" | "hoodie">("tee");
  const product = customProducts.find((item) => item.lane === lane) ?? customProducts[0];
  const [colorId, setColorId] = useState("black");
  const [size, setSize] = useState<Size | null>(null);
  const [backPrint, setBackPrint] = useState(false);
  const [art, setArt] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const color = colorById(colorId) ?? colorById("black");
  const price = product.price + (backPrint ? BACK_PRINT_PRICE : 0);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setNote("");
    try {
      const jpeg = await compressImage(file);
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

  function addToBag() {
    if (!size) {
      setNote("Pick a size.");
      return;
    }
    if (!art) {
      setNote("Upload the art first. PNG or JPG, 300 DPI if you have it.");
      return;
    }
    add({ slug: product.slug, size, colorId, backPrint, qty: 1, art });
    setNote(`${product.name} · ${color?.name ?? "Black"} · ${size} is in the cart.`);
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
      <div>
        <button
          type="button"
          onClick={() => document.getElementById("print-file")?.click()}
          className="flex aspect-[3/4] w-full items-center justify-center border border-line"
          style={{ background: color?.hex ?? "#141414" }}
        >
          {art ? (
            <img src={art} alt="Your print preview" className="max-h-[70%] max-w-[70%] object-contain" />
          ) : (
            <span className={`max-w-xs px-6 text-center text-lg font-semibold uppercase tracking-widest ${["white", "ash", "ice-grey", "daisy", "cornsilk", "yellow-haze", "light-pink", "natural", "sand"].includes(colorId) ? "text-ink" : "text-paper"}`}>
              Upload a picture
            </span>
          )}
        </button>
        <p className="mt-3 text-sm text-mute">
          {product.blank}. Click the shirt, or the button, and pick a PNG or JPG. Front max {product.printFront}.
        </p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-pink">Print yours</p>
        <h1 className="mt-2 text-4xl font-semibold">Put it on a Gildan</h1>
        <p className="mt-3 text-mute">
          Upload a picture, pick the blank color and a size from S to XXL. Ninja POD prints the file you send.
        </p>
        <div className="mt-6 flex gap-2">
          {(["tee", "hoodie"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={lane === option}
              onClick={() => {
                setLane(option);
                if (!colorsFor(option).some((swatch) => swatch.id === colorId)) setColorId("black");
              }}
              className={
                lane === option
                  ? "min-h-11 bg-paper px-4 font-semibold uppercase tracking-widest text-ink"
                  : "min-h-11 border border-line px-4 font-semibold uppercase tracking-widest"
              }
            >
              {option === "tee" ? "Tee" : "Hoodie"}
            </button>
          ))}
        </div>
        <p className="mt-4 bg-yellow px-2 py-1 text-lg font-bold text-yellow-ink w-fit">{money(price)}</p>
        <p className="mt-2 text-sm text-mute">
          {money(product.price)} with one print location. Back print +{money(BACK_PRINT_PRICE)}.
        </p>
        <input
          id="print-file"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={(event) => void onFile(event.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => document.getElementById("print-file")?.click()}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center bg-yellow px-5 text-lg font-semibold uppercase tracking-widest text-yellow-ink sm:w-auto"
        >
          {art ? "Change picture" : "Upload a picture"}
        </button>
        <p className="mt-2 text-sm text-mute">PNG or JPG. It shows on the shirt. Ninja wants 300 DPI, true to {product.printFront}.</p>
        <div className="mt-6">
          <ColorPalette lane={lane} value={colorId} onChange={setColorId} />
        </div>
        <fieldset className="mt-6">
          <legend className="text-sm font-semibold uppercase tracking-widest">Size</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {SIZES.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={option === size}
                onClick={() => setSize(option)}
                className={
                  option === size
                    ? "min-h-11 min-w-14 bg-pink px-3 font-bold text-pink-ink"
                    : "min-h-11 min-w-14 border border-line bg-panel px-3 font-bold"
                }
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="mt-6 flex min-h-11 items-center gap-3 text-sm font-semibold">
          <input type="checkbox" checked={backPrint} onChange={(event) => setBackPrint(event.target.checked)} />
          Also print the back (+{money(BACK_PRINT_PRICE)})
        </label>
        <button
          type="button"
          disabled={busy}
          onClick={addToBag}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center bg-pink font-semibold uppercase tracking-widest text-pink-ink disabled:opacity-40 sm:w-auto sm:px-6"
        >
          {busy ? "Reading the file…" : size ? `Add ${size} to cart` : "Pick a size"}
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
