import { colorById, colorsFor, getProduct, SIZES, unitPrice, type Size } from "@/lib/catalog";
import { blankById, blankSizes, blankVariantId, colorOnBlank, defaultBlankId } from "@/lib/blanks";

export type CheckoutLine = {
  slug: string;
  quantity: number;
  size: Size;
  colorId: string;
  backPrint: boolean;
  art?: string;
  ink?: string;
  blankId?: string;
};

const ART_LIMIT = 180_000;

export function parseCheckoutLines(input: unknown): CheckoutLine[] {
  const raw = Array.isArray(input)
    ? input
    : input && typeof input === "object" && "lines" in input
      ? (input as { lines: unknown }).lines
      : null;

  if (!Array.isArray(raw) || raw.length === 0) throw new Error("Cart is empty.");

  const lines: CheckoutLine[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const record = item as {
      slug?: unknown;
      quantity?: unknown;
      size?: unknown;
      colorId?: unknown;
      backPrint?: unknown;
      art?: unknown;
      ink?: unknown;
      blankId?: unknown;
    };
    const slug = typeof record.slug === "string" ? record.slug.trim() : "";
    const product = getProduct(slug);
    const sizeOk =
      record.size === "OS" ||
      record.size === "XS" ||
      record.size === "S/M" ||
      record.size === "L/XL" ||
      (typeof record.size === "string" && SIZES.some((option) => option === record.size));
    const size = sizeOk ? (record.size as Size) : undefined;
    const colorId = typeof record.colorId === "string" ? record.colorId : "";
    const blankId = typeof record.blankId === "string" && blankById(record.blankId) ? record.blankId : undefined;
    const resolvedBlank = blankId ?? (product && !product.custom && product.lane !== "bag" && product.lane !== "skate" ? defaultBlankId(product.lane) : undefined);
    const color = (resolvedBlank ? colorOnBlank(resolvedBlank, colorId) : undefined) ?? colorById(colorId);
    const quantity = typeof record.quantity === "number" ? record.quantity : Number(record.quantity);
    const backPrint = record.backPrint === true;
    if (!product || !size || !color || !Number.isFinite(quantity) || quantity < 1) continue;
    if (product.oneSize && size !== "OS") throw new Error("That piece is one size.");
    if (!product.oneSize && size === "OS" && blankById(resolvedBlank)?.lane !== "cap") throw new Error("Pick a shirt size.");
    if (resolvedBlank && !blankSizes(resolvedBlank).includes(size)) throw new Error("That size isn’t on this blank.");
    if (resolvedBlank && !colorOnBlank(resolvedBlank, colorId)) throw new Error("That color isn’t on this blank.");
    if (resolvedBlank && color && blankVariantId(resolvedBlank, color.name, size) == null) {
      throw new Error("That size isn’t on this color.");
    }
    if (!resolvedBlank && !colorsFor(product.lane).some((swatch) => swatch.id === colorId)) {
      throw new Error("That color isn’t on this blank.");
    }
    if (backPrint && (!product.custom || blankById(resolvedBlank)?.lane === "cap")) throw new Error("Back prints are on custom pieces only.");
    if (unitPrice(slug, backPrint, resolvedBlank) == null) throw new Error("That piece isn’t priced.");
    let art: string | undefined;
    if (typeof record.art === "string" && record.art.length > 0) {
      if (!record.art.startsWith("data:image/jpeg")) throw new Error("Art has to be a JPEG upload.");
      if (record.art.length > ART_LIMIT) throw new Error("Art file is too heavy. Export a smaller PNG and try again.");
      art = record.art;
    }
    if (product.custom && !art) throw new Error("Custom pieces need your artwork.");
    const ink =
      typeof record.ink === "string" && /^[a-z]+(-[a-z]+)?$/.test(record.ink) ? record.ink : undefined;
    lines.push({
      slug,
      quantity: Math.min(8, Math.floor(quantity)),
      size,
      colorId,
      backPrint,
      art,
      ink,
      blankId: resolvedBlank,
    });
  }

  if (lines.length === 0) throw new Error("Cart is empty.");
  return lines;
}
