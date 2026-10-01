import { colorById, getProduct, type Size } from "@/lib/catalog";

export type NinjaLine = {
  slug: string;
  quantity: number;
  size: Size;
  colorId: string;
  backPrint: boolean;
};

/** What we would hand Ninja POD. Their live path is the Shopify app, not a public order API. */
export function ninjaPayload(lines: NinjaLine[], jobIds: string[]) {
  const items = lines.flatMap((line, index) => {
    const product = getProduct(line.slug);
    const color = colorById(line.colorId);
    if (!product || product.supplier !== "ninja" || !color) return [];
    return [
      {
        jobId: jobIds[index],
        blank: product.blank,
        sku: product.lane === "hoodie" ? "G18500" : "G500",
        color: color.name,
        size: line.size,
        quantity: line.quantity,
        printLocations: line.backPrint ? ["front", "back"] : ["front"],
        frontMax: product.printFront,
        backMax: product.printBack,
        method: "DTF",
      },
    ];
  });
  return {
    provider: "ninjapod",
    note: "Push when NINJA_POD_API_URL and NINJA_POD_API_KEY are both set. Otherwise the print job rows are the queue.",
    items,
  };
}
