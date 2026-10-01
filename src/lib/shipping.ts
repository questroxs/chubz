import { EXPEDITED_SHIPPING, FREE_SHIP_AT, STANDARD_SHIPPING } from "@/lib/catalog";

export function dollarsToCents(amount: number) {
  return Math.round(amount * 100);
}

export function remainingToFreeShipping(subtotal: number) {
  return Math.max(0, Math.round((FREE_SHIP_AT - subtotal) * 100) / 100);
}

export function shippingOptions(subtotal: number) {
  const standard = subtotal >= FREE_SHIP_AT ? 0 : STANDARD_SHIPPING;
  return [
    {
      name: standard === 0 ? "Standard — free (5–10 business days)" : "Standard (5–10 business days)",
      amount: standard,
      minDays: 5,
      maxDays: 10,
    },
    {
      name: "Expedited (3–6 business days)",
      amount: EXPEDITED_SHIPPING,
      minDays: 3,
      maxDays: 6,
    },
  ];
}