import { colorsFor, SHIRT_COLORS, type ShirtColor } from "@/lib/gildan-colors";

export { colorsFor, SHIRT_COLORS };
export type { ShirtColor };

export const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
export type ApparelSize = (typeof SIZES)[number];
export type Size = ApparelSize | "OS";
export type Lane = "tee" | "hoodie" | "bag";

export type Look = { src: string; alt: string };

/**
 * Printful catalog prices, one front print (Gildan 5000 tee, Gildan 18500 hoodie).
 * Tee from $9.44. Hoodie from $22.63. Retail is the street price on the site.
 */
export const PRINTFUL_TEE_COST = 9.44;
export const PRINTFUL_HOOD_COST = 22.63;
export const BACK_PRINT_PRICE = 7;

export const STANDARD_SHIPPING = 7.95;
export const EXPEDITED_SHIPPING = 16.95;
export const FREE_SHIP_AT = 90;

export type Product = {
  slug: string;
  name: string;
  lane: Lane;
  price: number;
  cost: number;
  tag: string;
  blurb: string;
  details: string[];
  art: string;
  artAlt: string;
  looks: Look[];
  custom: boolean;
  oneSize: boolean;
  supplier: "printful" | "cj";
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
    slug: "mean-orange-tee",
    name: "Mean Orange",
    lane: "tee",
    price: 26,
    cost: PRINTFUL_TEE_COST,
    tag: "X eyes",
    blurb: "The grin with the stitches. Pick the chub color and the shirt.",
    details: teeDetails,
    art: "/art/chub-orange.png",
    artAlt: "Orange chub with X eyes and a stitch scar",
    looks: [
      { src: "/looks/orange-tee-a.jpg", alt: "Model in a black tee with the orange chub, night wall" },
      { src: "/looks/orange-tee-b.jpg", alt: "Model in a black tee with the orange chub, alley mural" },
    ],
    custom: false,
    oneSize: false,
    supplier: "printful",
    blank: "Gildan 5000 · Printful",
    printFront: '11" × 16"',
    printBack: '11" × 16"',
  },
  {
    slug: "blue-mood-tee",
    name: "Blue Mood",
    lane: "tee",
    price: 26,
    cost: PRINTFUL_TEE_COST,
    tag: "Drip face",
    blurb: "Droopy eyes, paint still running. Recolor it, or leave it blue.",
    details: teeDetails,
    art: "/art/chub-blue.png",
    artAlt: "Blue chub with droopy eyes and a paint drip",
    looks: [
      { src: "/looks/blue-tee-a.jpg", alt: "Model in a black tee with the blue chub, subway" },
      { src: "/looks/blue-tee-b.jpg", alt: "Model in a black tee with the blue chub, wet street" },
    ],
    custom: false,
    oneSize: false,
    supplier: "printful",
    blank: "Gildan 5000 · Printful",
    printFront: '11" × 16"',
    printBack: '11" × 16"',
  },
  {
    slug: "round-green-tee",
    name: "Round Green",
    lane: "tee",
    price: 26,
    cost: PRINTFUL_TEE_COST,
    tag: "Round eyes",
    blurb: "The round-eyed chub, left green. Recolor it, or leave it.",
    details: teeDetails,
    art: "/art/chub-green.png",
    artAlt: "Green chub with round eyes",
    looks: [{ src: "/looks/mean-green.jpg", alt: "Model in a tee with the green chub" }],
    custom: false,
    oneSize: false,
    supplier: "printful",
    blank: "Gildan 5000 · Printful",
    printFront: '11" × 16"',
    printBack: '11" × 16"',
  },
  {
    slug: "mean-orange-hood",
    name: "Mean Orange Hood",
    lane: "hoodie",
    price: 58,
    cost: PRINTFUL_HOOD_COST,
    tag: "X eyes",
    blurb: "Same mean chub on a pullover. Color the chub, then the hoodie.",
    details: hoodDetails,
    art: "/art/chub-orange.png",
    artAlt: "Orange chub with X eyes and a stitch scar",
    looks: [{ src: "/looks/orange-hoodie.jpg", alt: "Model in a black hoodie with the orange chub, rooftop" }],
    custom: false,
    oneSize: false,
    supplier: "printful",
    blank: "Gildan 18500 · Printful",
    printFront: '11" × 9"',
    printBack: '11" × 16"',
  },
  {
    slug: "blue-mood-hood",
    name: "Blue Mood Hood",
    lane: "hoodie",
    price: 58,
    cost: PRINTFUL_HOOD_COST,
    tag: "Drip face",
    blurb: "The sad-eyed chub on a hoodie. Same color picker as the tee.",
    details: hoodDetails,
    art: "/art/chub-blue.png",
    artAlt: "Blue chub with droopy eyes and a paint drip",
    looks: [{ src: "/looks/blue-hoodie.jpg", alt: "Model in a black hoodie with the blue chub, night court" }],
    custom: false,
    oneSize: false,
    supplier: "printful",
    blank: "Gildan 18500 · Printful",
    printFront: '11" × 9"',
    printBack: '11" × 16"',
  },
  {
    slug: "round-green-hood",
    name: "Round Green Hood",
    lane: "hoodie",
    price: 58,
    cost: PRINTFUL_HOOD_COST,
    tag: "Round eyes",
    blurb: "The round-eyed chub on a pullover. Color the chub, then the hoodie.",
    details: hoodDetails,
    art: "/art/chub-green.png",
    artAlt: "Green chub with round eyes",
    looks: [{ src: "/looks/mean-green.jpg", alt: "Model wearing the green chub" }],
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
    cost: PRINTFUL_TEE_COST,
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
    cost: PRINTFUL_HOOD_COST,
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
  bag("usb-sling", "USB chest sling", 28, 13.98, "CJNS1600337", "/gear/bags/usb.jpg", "Model wearing the black USB chest sling.", "CJdropshipping SKU CJNS1600337-Black. Wholesale $13.98. Oxford, USB port, 33×16×11 cm."),
  bag("nylon-chest", "Nylon chest sling", 26, 12.86, "CJBHNSNS34905", "/gear/bags/00.jpg", "Model wearing the black nylon chest sling.", "CJdropshipping SKU CJBHNSNS34905. Wholesale $12.86. PU chest bag with a USB port."),
  bag("brown-chest", "Brown chest sling", 26, 12.86, "CJBHNSNS34905", "/gear/bags/01.jpg", "Brown tactical chest sling.", "Same CJ chest-bag listing, brown color. Wholesale $12.86."),
  bag("ripstop-sling", "Ripstop sling", 28, 13.98, "CJNS1600337", "/gear/bags/02.jpg", "Model wearing the ripstop sling.", "Ripstop nylon sling. Wholesale band on CJ chest slings is $12.86–$13.98."),
  bag("front-zip", "Front-zip sling", 28, 13.98, "CJNS1600337", "/gear/bags/03.jpg", "Front-zip sling on a model.", "Chest sling with a front zip. CJ oxford sling wholesale $13.98."),
  bag("day-sling", "Day sling", 28, 13.98, "CJNS1600337", "/gear/bags/04.jpg", "Day sling worn on the chest.", "One-strap day sling. CJ wholesale $13.98 on the oxford listing."),
  bag("tech-sling", "Tech sling", 32, 13.98, "CJNS1600337", "/gear/bags/05.jpg", "Model wearing the tech sling with a bottle pocket.", "Nylon tech sling. Street $32 on a $13.98 CJ blank, about a 56% margin."),
  bag("canvas-sling", "Canvas sling", 16, 6.7, "CJNS1835851", "/gear/bags/06.jpg", "Model wearing the black canvas sling.", "CJdropshipping SKU CJNS1835851. Canvas shoulder bag. Wholesale $6.70."),
  bag("military-sling", "Military sling", 32, 13.98, "CJNS1600337", "/gear/bags/07.jpg", "Model wearing the black military sling.", "Tactical sling. CJ oxford chest sling wholesale $13.98."),
  bag("leather-sling", "Leather sling", 16, 5.31, "CJNS2229259", "/gear/bags/08.jpg", "Leather sling product photo.", "CJdropshipping SKU CJNS222925901AZ. Leather crossbody. Wholesale $5.31. Street $16."),
];

function bag(slug: string, name: string, price: number, cost: number, tag: string, src: string, alt: string, detail: string): Product {
  return {
    slug, name, lane: "bag", price, cost, tag,
    blurb: alt,
    details: [detail, "One size. The photo is the bag, on a person when the shot includes one.", "About a 50% margin on the CJ wholesale price."],
    art: src, artAlt: alt,
    looks: [{ src, alt }],
    custom: false, oneSize: true, supplier: "cj",
    blank: "CJ bag", printFront: "—", printBack: "—",
  };
}

export function getProduct(slug: string) {
  return [...products, ...customProducts, ...bagProducts].find((product) => product.slug === slug);
}

export function colorById(id: string) {
  return SHIRT_COLORS.find((color) => color.id === id);
}

export function unitPrice(slug: string, backPrint: boolean) {
  const product = getProduct(slug);
  if (!product) return null;
  if (backPrint && !product.custom) return null;
  return product.price + (backPrint ? BACK_PRINT_PRICE : 0);
}

export function laneLabel(lane: Lane) {
  if (lane === "tee") return "Tee";
  if (lane === "hoodie") return "Hoodie";
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
