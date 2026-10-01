import { printfulVariantId } from "@/lib/printful-variants";

export type ColorGroup = "solid" | "heather" | "safety";

export type ShirtColor = {
  id: string;
  name: string;
  hex: string;
  group: ColorGroup;
  /** On the Printful Gildan 5000 tee. */
  tee: boolean;
  /** On the Gildan Heavy Blend hoodie blank. */
  hood: boolean;
};

/** Names from the Gildan 5000 spec sheet. Hexes are swatches, not lab matches. */
export const SHIRT_COLORS: ShirtColor[] = [
  { id: "white", name: "White", hex: "#f4f4f4", group: "solid", tee: true, hood: true },
  { id: "black", name: "Black", hex: "#141414", group: "solid", tee: true, hood: true },
  { id: "navy", name: "Navy", hex: "#1b2a4a", group: "solid", tee: true, hood: true },
  { id: "red", name: "Red", hex: "#c41e26", group: "solid", tee: true, hood: true },
  { id: "royal", name: "Royal", hex: "#2450b5", group: "solid", tee: true, hood: true },
  { id: "cardinal", name: "Cardinal", hex: "#8c1d2c", group: "solid", tee: true, hood: false },
  { id: "maroon", name: "Maroon", hex: "#6b1e2a", group: "solid", tee: true, hood: true },
  { id: "garnet", name: "Garnet", hex: "#6e1e2a", group: "solid", tee: true, hood: false },
  { id: "cherry", name: "Antique Cherry Red", hex: "#a13a4a", group: "solid", tee: true, hood: false },
  { id: "azalea", name: "Azalea", hex: "#e56a9a", group: "solid", tee: true, hood: false },
  { id: "heliconia", name: "Heliconia", hex: "#e23d8c", group: "solid", tee: true, hood: true },
  { id: "berry", name: "Berry", hex: "#8e3a62", group: "solid", tee: true, hood: false },
  { id: "light-pink", name: "Light Pink", hex: "#f4c2d0", group: "solid", tee: true, hood: true },
  { id: "coral", name: "Coral Silk", hex: "#e07a7a", group: "solid", tee: true, hood: false },
  { id: "orange", name: "Orange", hex: "#ef5a22", group: "solid", tee: true, hood: true },
  { id: "tennessee", name: "Tennessee Orange", hex: "#f27a1a", group: "solid", tee: true, hood: false },
  { id: "texas", name: "Texas Orange", hex: "#e85d04", group: "solid", tee: true, hood: false },
  { id: "antique-orange", name: "Antique Orange", hex: "#d97a3a", group: "solid", tee: true, hood: false },
  { id: "gold", name: "Gold", hex: "#d4a017", group: "solid", tee: true, hood: true },
  { id: "old-gold", name: "Old Gold", hex: "#c5a34a", group: "solid", tee: true, hood: false },
  { id: "daisy", name: "Daisy", hex: "#f2d23a", group: "solid", tee: true, hood: false },
  { id: "cornsilk", name: "Cornsilk", hex: "#f3e3b0", group: "solid", tee: true, hood: false },
  { id: "yellow-haze", name: "Yellow Haze", hex: "#f0e28a", group: "solid", tee: true, hood: false },
  { id: "irish", name: "Irish Green", hex: "#1f7a3a", group: "solid", tee: true, hood: true },
  { id: "forest", name: "Forest Green", hex: "#1d4a2a", group: "solid", tee: true, hood: true },
  { id: "military", name: "Military Green", hex: "#4b5320", group: "solid", tee: true, hood: true },
  { id: "mint", name: "Mint Green", hex: "#9ed9c4", group: "solid", tee: true, hood: false },
  { id: "turf", name: "Turf Green", hex: "#2f6b3a", group: "solid", tee: true, hood: false },
  { id: "kiwi", name: "Kiwi", hex: "#8fbf3a", group: "solid", tee: true, hood: false },
  { id: "lime", name: "Lime", hex: "#b6e03a", group: "solid", tee: true, hood: false },
  { id: "electric", name: "Electric Green", hex: "#3dcc4a", group: "solid", tee: true, hood: false },
  { id: "antique-irish", name: "Antique Irish Green", hex: "#3d6b4f", group: "solid", tee: true, hood: false },
  { id: "jade", name: "Antique Jade Dome", hex: "#6aa89a", group: "solid", tee: true, hood: false },
  { id: "purple", name: "Purple", hex: "#5c2d86", group: "solid", tee: true, hood: true },
  { id: "violet", name: "Violet", hex: "#7a4e9a", group: "solid", tee: true, hood: false },
  { id: "carolina", name: "Carolina Blue", hex: "#7ba3c9", group: "solid", tee: true, hood: true },
  { id: "light-blue", name: "Light Blue", hex: "#a8c8e8", group: "solid", tee: true, hood: false },
  { id: "sky", name: "Sky", hex: "#8ec6e8", group: "solid", tee: true, hood: false },
  { id: "cobalt", name: "Cobalt", hex: "#3a4f9a", group: "solid", tee: true, hood: false },
  { id: "indigo", name: "Indigo Blue", hex: "#2c3a6e", group: "solid", tee: true, hood: false },
  { id: "sapphire", name: "Sapphire", hex: "#1f5f99", group: "solid", tee: true, hood: false },
  { id: "antique-sapphire", name: "Antique Sapphire", hex: "#3f6f9a", group: "solid", tee: true, hood: false },
  { id: "tropical", name: "Tropical Blue", hex: "#1aa6c4", group: "solid", tee: true, hood: false },
  { id: "sand", name: "Sand", hex: "#d7c4a3", group: "solid", tee: true, hood: true },
  { id: "natural", name: "Natural", hex: "#f3ead8", group: "solid", tee: true, hood: false },
  { id: "chocolate", name: "Dark Chocolate", hex: "#3d2b1f", group: "solid", tee: true, hood: false },
  { id: "savana", name: "Brown Savana", hex: "#8a6a45", group: "solid", tee: true, hood: false },
  { id: "charcoal", name: "Charcoal", hex: "#3c3c3c", group: "solid", tee: true, hood: true },
  { id: "ash", name: "Ash", hex: "#e4e4e4", group: "solid", tee: true, hood: true },
  { id: "ice-grey", name: "Ice Grey", hex: "#d5d8dc", group: "solid", tee: true, hood: false },
  { id: "gravel", name: "Gravel", hex: "#8a8478", group: "solid", tee: true, hood: false },
  { id: "sport-grey", name: "Sport Grey", hex: "#9aa0a6", group: "heather", tee: true, hood: true },
  { id: "dark-heather", name: "Dark Heather", hex: "#4a4e55", group: "heather", tee: true, hood: true },
  { id: "graphite", name: "Graphite Heather", hex: "#5c6168", group: "heather", tee: true, hood: true },
  { id: "heather-navy", name: "Heather Navy", hex: "#3a4558", group: "heather", tee: true, hood: false },
  { id: "heather-red", name: "Heather Red", hex: "#a85a5a", group: "heather", tee: true, hood: false },
  { id: "heather-sapphire", name: "Heather Sapphire", hex: "#5a7a9a", group: "heather", tee: true, hood: false },
  { id: "heather-military", name: "Heather Military Green", hex: "#5d6b4a", group: "heather", tee: true, hood: false },
  { id: "heather-orchid", name: "Heather Radiant Orchid", hex: "#b07aa8", group: "heather", tee: true, hood: false },
  { id: "blackberry", name: "Blackberry", hex: "#3a2a3a", group: "heather", tee: true, hood: false },
  { id: "lilac", name: "Lilac", hex: "#c7b0d4", group: "heather", tee: true, hood: false },
  { id: "midnight", name: "Midnight", hex: "#1c2430", group: "heather", tee: true, hood: false },
  { id: "russet", name: "Russet", hex: "#8b4518", group: "heather", tee: true, hood: false },
  { id: "sunset", name: "Sunset", hex: "#e07a4a", group: "heather", tee: true, hood: false },
  { id: "tweed", name: "Tweed", hex: "#6b5e52", group: "heather", tee: true, hood: false },
  { id: "safety-green", name: "Safety Green", hex: "#c6e82a", group: "safety", tee: true, hood: false },
  { id: "safety-orange", name: "Safety Orange", hex: "#ff5a1f", group: "safety", tee: true, hood: true },
  { id: "safety-pink", name: "Safety Pink", hex: "#ff4fa3", group: "safety", tee: true, hood: false },
  { id: "neon-blue", name: "Neon Blue", hex: "#2f6bff", group: "safety", tee: true, hood: false },
  { id: "neon-green", name: "Neon Green", hex: "#39ff14", group: "safety", tee: true, hood: false },
];

export function colorsFor(lane: "tee" | "hoodie" | "bag") {
  if (lane === "bag") return SHIRT_COLORS.filter((color) => color.id === "black");
  const kind = lane === "hoodie" ? "hoodie" : "tee";
  return SHIRT_COLORS.filter((color) => printfulVariantId(kind, color.name, "M") != null);
}
