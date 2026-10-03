import { getRequest } from "@tanstack/react-start/server";

export type OwnerDesk = {
  costs: Record<string, number>;
  notes: Record<string, string>;
  gearNote: string;
};

const COSTS: Record<string, number> = {
  "tee-classic": 9.44,
  "tee-soft": 9.63,
  "tee-staple": 11.92,
  "tee-heavy": 15.6,
  "tee-boxy": 16.97,
  "tee-active": 16.39,
  "tee-drop": 20.71,
  "tee-premium": 16.39,
  "hood-heavy": 22.63,
  "hood-zip": 24.92,
  "hood-premium": 27.84,
  "hood-mid": 32.2,
  "hood-relax": 38.97,
  "hood-boxy": 37.23,
  "hood-light": 31.68,
  "hood-classic": 26.5,
  "cap-dad": 14.94,
  "cap-distressed": 16.05,
  "cap-snap": 17.34,
  "cap-trucker": 12.8,
  "cap-retro": 13.56,
  "cap-flex": 16.51,
  "cap-trucker-5": 15.09,
  "cap-5": 17.93,
  "mean-orange-tee": 9.44,
  "blue-mood-tee": 9.44,
  "round-green-tee": 9.44,
  "custom-tee": 9.44,
  "mean-orange-hood": 22.63,
  "blue-mood-hood": 22.63,
  "round-green-hood": 22.63,
  "custom-hoodie": 22.63,
  "mean-orange-cap": 14.94,
  "blue-mood-cap": 14.94,
  "round-green-cap": 14.94,
  "usb-sling": 13.98,
  "nylon-chest": 12.86,
  "brown-chest": 12.86,
  "ripstop-sling": 13.98,
  "front-zip": 13.98,
  "day-sling": 13.98,
  "tech-sling": 13.98,
  "canvas-sling": 6.7,
  "military-sling": 13.98,
  "leather-sling": 5.31,
  "steep-775": 45.99,
  "steep-788": 45.99,
  "steep-800": 45.99,
  "steep-813": 45.99,
  "steep-825": 45.99,
  "steep-838": 45.99,
  "steep-850": 45.99,
};

const NOTES: Record<string, string> = {
  "usb-sling": "Wholesale $13.98. About a 50% margin on the CJ wholesale price.",
  "nylon-chest": "Wholesale $12.86. About a 50% margin on the CJ wholesale price.",
  "brown-chest": "Wholesale $12.86. About a 50% margin on the CJ wholesale price.",
  "ripstop-sling": "Wholesale band on CJ chest slings is $12.86–$13.98.",
  "front-zip": "CJ oxford sling wholesale $13.98.",
  "day-sling": "CJ wholesale $13.98 on the oxford listing.",
  "tech-sling": "Street $32 on a $13.98 CJ blank, about a 56% margin.",
  "canvas-sling": "Wholesale $6.70. About a 50% margin on the CJ wholesale price.",
  "military-sling": "CJ oxford chest sling wholesale $13.98.",
  "leather-sling": "Wholesale $5.31. Street $16.",
  "steep-775": "Stand-in $45.99. Point’s public FAQ says a one-off custom deck is roughly $45.99. Login prices are hidden. Street $69 is about 50% over that stand-in.",
  "steep-788": "Stand-in $45.99. Point’s public FAQ says a one-off custom deck is roughly $45.99. Login prices are hidden. Street $69 is about 50% over that stand-in.",
  "steep-800": "Stand-in $45.99. Point’s public FAQ says a one-off custom deck is roughly $45.99. Login prices are hidden. Street $69 is about 50% over that stand-in.",
  "steep-813": "Stand-in $45.99. Point’s public FAQ says a one-off custom deck is roughly $45.99. Login prices are hidden. Street $69 is about 50% over that stand-in.",
  "steep-825": "Stand-in $45.99. Point’s public FAQ says a one-off custom deck is roughly $45.99. Login prices are hidden. Street $69 is about 50% over that stand-in.",
  "steep-838": "Stand-in $45.99. Point’s public FAQ says a one-off custom deck is roughly $45.99. Login prices are hidden. Street $69 is about 50% over that stand-in.",
  "steep-850": "Stand-in $45.99. Point’s public FAQ says a one-off custom deck is roughly $45.99. Login prices are hidden. Street $69 is about 50% over that stand-in.",
};

function hostsOf(request: Request) {
  return [request.headers.get("host"), request.headers.get("x-forwarded-host")]
    .filter(Boolean)
    .join(",")
    .split(",")
    .map((host) => host.trim().split(":")[0].toLowerCase())
    .filter(Boolean);
}

function ownerRequest(request: Request) {
  const hosts = hostsOf(request);
  if (hosts.length === 0) return false;
  if (hosts.some((host) => host === "mrchubz.com" || host === "www.mrchubz.com")) return false;
  return hosts.every((host) => host === "vercel.app" || host.endsWith(".vercel.app"));
}

/** Wholesale numbers stay off mrchubz.com. Vercel domains only. */
export function ownerWholesale(): OwnerDesk | null {
  const request = getRequest();
  if (!ownerRequest(request)) return null;
  return {
    costs: COSTS,
    notes: NOTES,
    gearNote: "Prices sit about 50% over the CJdropshipping wholesale number on that SKU.",
  };
}
