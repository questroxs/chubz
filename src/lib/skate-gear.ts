/** Street prices. Point hides login wholesale, so costs in the owner sheet are stand-ins. */

export const TRUCKS = [
  { id: "none", label: "No trucks", price: 0 },
  { id: "5.0", label: "Stock 5.0", price: 36 },
  { id: "5.25", label: "Stock 5.25", price: 36 },
  { id: "5.5", label: "Stock 5.5", price: 36 },
  { id: "longboard", label: "Longboard", price: 48 },
] as const;

export const WHEELS = [
  { id: "none", label: "No wheels", price: 0 },
  { id: "type-t", label: "Type T · 99a", price: 28 },
  { id: "type-d", label: "Type D · 101a inner / 99a outer", price: 44 },
  { id: "type-pc", label: "Type PC · 98a outer", price: 44 },
  { id: "type-lb", label: "Type LB · 58–76 mm", price: 36 },
] as const;

export const GRIPS = [
  { id: "none", label: "No grip", price: 0 },
  { id: "sheet", label: "Perforated sheet", price: 12 },
] as const;

export type TruckId = (typeof TRUCKS)[number]["id"];
export type WheelId = (typeof WHEELS)[number]["id"];
export type GripId = (typeof GRIPS)[number]["id"];

export type GearPick = { truck?: string; wheel?: string; grip?: string };

export function truckById(id?: string) {
  return TRUCKS.find((item) => item.id === id) ?? TRUCKS[0];
}

export function wheelById(id?: string) {
  return WHEELS.find((item) => item.id === id) ?? WHEELS[0];
}

export function gripById(id?: string) {
  return GRIPS.find((item) => item.id === id) ?? GRIPS[0];
}

export function gearPrice(gear?: GearPick) {
  return truckById(gear?.truck).price + wheelById(gear?.wheel).price + gripById(gear?.grip).price;
}

export function gearLabel(gear?: GearPick) {
  const parts = [truckById(gear?.truck), wheelById(gear?.wheel), gripById(gear?.grip)].filter((item) => item.price > 0);
  return parts.map((item) => item.label).join(" · ");
}
