import { blankById } from "@/lib/blanks";
import type { ChubFace } from "@/lib/chub-ink";
import { colorsFor, SHIRT_COLORS, type ShirtColor } from "@/lib/gildan-colors";
import { gearPrice, type GearPick } from "@/lib/skate-gear";

export { colorsFor, SHIRT_COLORS };
export type { ShirtColor };

export const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
export type ApparelSize = (typeof SIZES)[number];
export type Size = ApparelSize | "OS" | "XS" | "S/M" | "L/XL";
export type Lane = "tee" | "hoodie" | "bag" | "cap" | "skate";

export type Look = { src: string; alt: string };

/**
 * Retail is the street price on the site.
 */
export const BACK_PRINT_PRICE = 7;

export const STANDARD_SHIPPING = 7.95;
export const EXPEDITED_SHIPPING = 16.95;
export const FREE_SHIP_AT = 90;

export type Product = {
  slug: string;
  name: string;
  lane: Lane;
  price: number;
  tag: string;
  blurb: string;
  details: string[];
  art: string;
  artAlt: string;
  looks: Look[];
  custom: boolean;
  oneSize: boolean;
  supplier: "printful" | "cj" | "point";
  blank: string;
  printFront: string;
  printBack: string;
  source?: string;
};

export const SIZE_CHART: Record<ApparelSize, { chest: string; length: string }> = {
  S: { chest: '18"', length: '28"' },
  M: { chest: '20"', length: '29"' },
  L: { chest: '22"', length: '30"' },
  XL: { chest: '24"', length: '31"' },
  XXL: { chest: '26"', length: '32"' },
};

export const HOOD_CHART: Record<ApparelSize, { chest: string; length: string }> = {
  S: { chest: '20"', length: '27"' },
  M: { chest: '22"', length: '28"' },
  L: { chest: '24"', length: '29"' },
  XL: { chest: '26"', length: '30"' },
  XXL: { chest: '28"', length: '31"' },
};

const teeDetails = [
  "Gildan 5000 Heavy Cotton, DTF through Printful. Sizes S–XXL.",
  "Front print up to 11\" × 16\". Same print size on every size.",
  "Art: PNG, 300 DPI, true to size. One print location is in the price. Back is +$7.",
  "Printful makes it in about 2–5 business days, then ships.",
];

const hoodDetails = [
  "Gildan 18500 Heavy Blend pullover, DTF through Printful. Sizes S–XXL.",
  "Front print up to 11\" wide × 9\" tall, stopping at the pocket. Back up to 11\" × 16\".",
  "Art: PNG, 300 DPI. One print location is in the price. Back is +$7.",
  "Printful makes it in about 2–5 business days, then ships.",
];

export const products: Product[] = [
  {
    slug: "spray-tee",
    name: "Spray",
    lane: "tee",
    price: 32,
    tag: "One eye",
    blurb: "Cap, can, and a grin. Pick the body color. Pink stays pink.",
    details: teeDetails,
    art: "/art/prints/spray-orange.png",
    artAlt: "Orange spray-can character",
    looks: [{ src: "/looks/fit-tee-black.jpg", alt: "Black tee with the orange spray character on a model" }],
    custom: false,
    oneSize: false,
    supplier: "printful",
    blank: "Gildan 5000 · Printful",
    printFront: '11" × 16"',
    printBack: '11" × 16"',
  },
  {
    slug: "quest-tee",
    name: "Quest",
    lane: "tee",
    price: 32,
    tag: "Wall",
    blurb: "The blue wall piece. Shift the color and the print follows.",
    details: teeDetails,
    art: "/art/prints/quest-blue.png",
    artAlt: "Blue Quest character on a wall",
    looks: [{ src: "/looks/fit-tee-red.jpg", alt: "Red tee with blue Quest on a model" }],
    custom: false,
    oneSize: false,
    supplier: "printful",
    blank: "Gildan 5000 · Printful",
    printFront: '11" × 16"',
    printBack: '11" × 16"',
  },
  {
    slug: "one-eye-tee",
    name: "Marker",
    lane: "tee",
    price: 32,
    tag: "Beanie",
    blurb: "Beanie, marker, and one eye. Green until you pick another color.",
    details: teeDetails,
    art: "/art/prints/thumb-green.png",
    artAlt: "Green character in a beanie holding a marker",
    looks: [{ src: "/looks/fit5-tee-white.jpg", alt: "White tee with the green marker character on a model" }],
    custom: false,
    oneSize: false,
    supplier: "printful",
    blank: "Gildan 5000 · Printful",
    printFront: '11" × 16"',
    printBack: '11" × 16"',
  },
  {
    slug: "mob-tee",
    name: "Mob",
    lane: "tee",
    price: 32,
    tag: "Night",
    blurb: "Chain, can, and the city. The color you pick is the color that prints.",
    details: teeDetails,
    art: "/art/prints/mob-green.jpg",
    artAlt: "Green Mob character at sunset",
    looks: [{ src: "/looks/fit-tee-latina.jpg", alt: "Black tee with Mob on a model" }],
    custom: false,
    oneSize: false,
    supplier: "printful",
    blank: "Gildan 5000 · Printful",
    printFront: '11" × 16"',
    printBack: '11" × 16"',
  },
  {
    slug: "spray-hood",
    name: "Spray Hood",
    lane: "hoodie",
    price: 58,
    tag: "One eye",
    blurb: "The spray character on a pullover. Pick the body color.",
    details: hoodDetails,
    art: "/art/prints/spray-orange.png",
    artAlt: "Orange spray-can character",
    looks: [{ src: "/looks/fit-hood-black.jpg", alt: "Black hoodie with the orange spray character" }],
    custom: false,
    oneSize: false,
    supplier: "printful",
    blank: "Gildan 18500 · Printful",
    printFront: '11" × 9"',
    printBack: '11" × 16"',
  },
  {
    slug: "quest-hood",
    name: "Quest Hood",
    lane: "hoodie",
    price: 58,
    tag: "Wall",
    blurb: "Quest on a pullover. The color you pick is the color that prints.",
    details: hoodDetails,
    art: "/art/prints/quest-blue.png",
    artAlt: "Blue Quest character",
    looks: [{ src: "/looks/fit4-hood-red.jpg", alt: "Red hoodie with blue Quest" }],
    custom: false,
    oneSize: false,
    supplier: "printful",
    blank: "Gildan 18500 · Printful",
    printFront: '11" × 9"',
    printBack: '11" × 16"',
  },
  {
    slug: "one-eye-hood",
    name: "Marker Hood",
    lane: "hoodie",
    price: 58,
    tag: "Beanie",
    blurb: "The beanie character on a pullover. Green until you pick another color.",
    details: hoodDetails,
    art: "/art/prints/thumb-green.png",
    artAlt: "Green character in a beanie holding a marker",
    looks: [{ src: "/looks/fit4-hood-white.jpg", alt: "White hoodie with the green marker character" }],
    custom: false,
    oneSize: false,
    supplier: "printful",
    blank: "Gildan 18500 · Printful",
    printFront: '11" × 9"',
    printBack: '11" × 16"',
  },
  {
    slug: "mob-hood",
    name: "Mob Hood",
    lane: "hoodie",
    price: 58,
    tag: "Night",
    blurb: "Mob on a pullover. The color you pick is the color that prints.",
    details: hoodDetails,
    art: "/art/prints/mob-green.jpg",
    artAlt: "Mob character",
    looks: [{ src: "/looks/fit-hood-latina.jpg", alt: "Black hoodie with Mob" }],
    custom: false,
    oneSize: false,
    supplier: "printful",
    blank: "Gildan 18500 · Printful",
    printFront: '11" × 9"',
    printBack: '11" × 16"',
  },
];

export const customProducts: Product[] = [
  {
    slug: "custom-tee",
    name: "Your art · Tee",
    lane: "tee",
    price: 24,
    tag: "Upload",
    blurb: "Your file, their size, a Gildan color. Printed when the order lands.",
    details: teeDetails,
    art: "/art/chub-orange.png",
    artAlt: "Orange chub",
    looks: [{ src: "/looks/orange-tee-a.jpg", alt: "Black tee, custom print goes on the chest" }],
    custom: true,
    oneSize: false,
    supplier: "printful",
    blank: "Gildan 5000 · Printful",
    printFront: '11" × 16"',
    printBack: '11" × 16"',
  },
  {
    slug: "custom-hoodie",
    name: "Your art · Hoodie",
    lane: "hoodie",
    price: 54,
    tag: "Upload",
    blurb: "Same upload, heavier blank. Front print stops at the pocket.",
    details: hoodDetails,
    art: "/art/chub-blue.png",
    artAlt: "Blue chub",
    looks: [{ src: "/looks/blue-hoodie.jpg", alt: "Black hoodie, custom print goes on the chest" }],
    custom: true,
    oneSize: false,
    supplier: "printful",
    blank: "Gildan 18500 · Printful",
    printFront: '11" × 9"',
    printBack: '11" × 16"',
  },
];

/** Ten bags with the actual product photo, including a person wearing it where the photo has one. */
export const bagProducts: Product[] = [
  bag("usb-sling", "USB chest sling", 28, "CJNS1600337", "/gear/bags/usb.jpg", "Model wearing the black USB chest sling.", "CJdropshipping SKU CJNS1600337-Black. Oxford, USB port, 33×16×11 cm."),
  bag("nylon-chest", "Nylon chest sling", 26, "CJBHNSNS34905", "/gear/bags/00.jpg", "Model wearing the black nylon chest sling.", "CJdropshipping SKU CJBHNSNS34905. PU chest bag with a USB port."),
  bag("brown-chest", "Brown chest sling", 26, "CJBHNSNS34905", "/gear/bags/01.jpg", "Brown tactical chest sling.", "Same CJ chest-bag listing, brown color."),
  bag("ripstop-sling", "Ripstop sling", 28, "CJNS1600337", "/gear/bags/02.jpg", "Model wearing the ripstop sling.", "Ripstop nylon sling."),
  bag("front-zip", "Front-zip sling", 28, "CJNS1600337", "/gear/bags/03.jpg", "Front-zip sling on a model.", "Chest sling with a front zip."),
  bag("day-sling", "Day sling", 28, "CJNS1600337", "/gear/bags/04.jpg", "Day sling worn on the chest.", "One-strap day sling."),
  bag("tech-sling", "Tech sling", 32, "CJNS1600337", "/gear/bags/05.jpg", "Model wearing the tech sling with a bottle pocket.", "Nylon tech sling."),
  bag("canvas-sling", "Canvas sling", 16, "CJNS1835851", "/gear/bags/06.jpg", "Model wearing the black canvas sling.", "CJdropshipping SKU CJNS1835851. Canvas shoulder bag."),
  bag("military-sling", "Military sling", 32, "CJNS1600337", "/gear/bags/07.jpg", "Model wearing the black military sling.", "Tactical sling."),
  bag("leather-sling", "Leather sling", 16, "CJNS2229259", "/gear/bags/08.jpg", "Leather sling product photo.", "CJdropshipping SKU CJNS222925901AZ. Leather crossbody."),
];

function bag(slug: string, name: string, price: number, tag: string, src: string, alt: string, detail: string): Product {
  return {
    slug, name, lane: "bag", price, tag,
    blurb: alt,
    details: [detail, "One size. The photo is the bag, on a person when the shot includes one."],
    art: src, artAlt: alt,
    looks: [{ src, alt }],
    custom: false, oneSize: true, supplier: "cj",
    blank: "CJ bag", printFront: "—", printBack: "—",
  };
}

export const capProducts: Product[] = [];

const extraProducts: Product[] = [];

/** Preview-only catalogs call this after a dynamic import so they stay out of the public bundle. */
export function registerProducts(items: Product[]) {
  for (const item of items) {
    if (!extraProducts.some((current) => current.slug === item.slug)) extraProducts.push(item);
  }
}

export function getProduct(slug: string) {
  return [...products, ...customProducts, ...capProducts, ...bagProducts, ...extraProducts].find((product) => product.slug === slug);
}

/** Checkout uses the slug, so the green chub must not stay on Mean Orange. */
export function slugForChub(lane: "tee" | "hoodie" | "cap", face: ChubFace) {
  if (face === "spray" || face === "thumb" || face === "quest" || face === "mob") {
    const piece = lane === "hoodie" ? "hood" : "tee";
    const name = face === "thumb" ? "one-eye" : face;
    return `${name}-${piece}`;
  }
  const piece = lane === "hoodie" ? "hood" : lane === "cap" ? "cap" : "tee";
  if (face === "blue") return `blue-mood-${piece}`;
  if (face === "green") return `round-green-${piece}`;
  return `mean-orange-${piece}`;
}

export function colorById(id: string) {
  return SHIRT_COLORS.find((color) => color.id === id);
}

export function unitPrice(slug: string, backPrint: boolean, blankId?: string, gear?: GearPick) {
  const product = getProduct(slug);
  if (!product) return null;
  const blank = blankById(blankId);
  if (blank) {
    if (backPrint && blank.lane === "cap") return null;
    return blank.price + (backPrint ? BACK_PRINT_PRICE : 0);
  }
  if (backPrint && !product.custom) return null;
  const base = product.price + (backPrint ? BACK_PRINT_PRICE : 0);
  return product.lane === "skate" ? base + gearPrice(gear) : base;
}

export function laneLabel(lane: Lane) {
  if (lane === "tee") return "Tee";
  if (lane === "hoodie") return "Hoodie";
  if (lane === "cap") return "Cap";
  if (lane === "skate") return "Deck";
  return "Bag";
}

export function money(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}
