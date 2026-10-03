/** Captured when the app first boots, so later in-app visits to home do not replay. */
export const landedOnHome =
  typeof window !== "undefined" && (window.location.pathname === "/" || window.location.pathname === "");

let played = false;

export function shouldPlayHomeIntro() {
  if (typeof window === "undefined") return true;
  return landedOnHome && !played;
}

export function markHomeIntroPlayed() {
  played = true;
}
