import { registerProducts, type Product } from "@/lib/catalog";

const skateDetails = [
  "Custom bottom print through Skateboard Dropshipper, the dropship side of Point Distribution in Las Vegas.",
  "These steep widths use a 9 × 34 in artboard, 300 DPI JPEG, 2700 × 10200 px.",
  "The big photo is Point’s 8.00 steep shot. The graphic already on that deck is their sample, not your file.",
  "Point’s API starts around $1,000 a week, so this does not auto-send. The art stays on the order for you to place on their site.",
];

function skate(slug: string, name: string, tag: string, thumb: string): Product {
  return {
    slug,
    name,
    lane: "skate",
    price: 69,
    tag,
    blurb: "Steep concave, all-natural veneer, your graphic on the bottom.",
    details: skateDetails,
    art: "/skate/steep-top.jpg",
    artAlt: "Point Distribution 8.00 steep deck with their sample graphic",
    looks: [
      { src: "/skate/steep-top.jpg", alt: "Point’s 8.00 steep deck, sample graphic still on the board" },
      { src: thumb, alt: `${name} outline from Skateboard Dropshipper` },
    ],
    custom: true,
    oneSize: true,
    supplier: "point",
    blank: "Point steep · natural veneer",
    printFront: '9" × 34"',
    printBack: "—",
  };
}

/** Steep widths Point publishes with a product photo. Street is about 50% over their public one-off sample. */
export const skateProducts: Product[] = [
  skate("steep-775", "7.75 steep", "7.75", "/skate/steep-775.png"),
  skate("steep-788", "7.88 steep", "7.88", "/skate/steep-788.png"),
  skate("steep-800", "8.00 steep", "8.00", "/skate/steep.png"),
  skate("steep-813", "8.13 steep", "8.13", "/skate/steep-813.png"),
  skate("steep-825", "8.25 steep", "8.25", "/skate/steep-825.png"),
  skate("steep-838", "8.38 steep", "8.38", "/skate/steep-838.png"),
  skate("steep-850", "8.50 steep", "8.50", "/skate/steep-850.png"),
];

export function registerSkateProducts() {
  registerProducts(skateProducts);
}

registerSkateProducts();
