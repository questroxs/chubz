export type ChubFace = "mean" | "blue" | "green" | "spray" | "thumb" | "quest" | "mob";

export type ChubInk = {
  id: string;
  name: string;
  hex: string;
};

/** Originals are orange (mean) and blue (blue mood). The rest recolor that drawing. */
export const CHUB_INKS: ChubInk[] = [
  { id: "orange", name: "Orange", hex: "#f08010" },
  { id: "blue", name: "Blue", hex: "#7eb6e4" },
  { id: "yellow", name: "Yellow", hex: "#f5c518" },
  { id: "red", name: "Red", hex: "#e0232a" },
  { id: "pink", name: "Pink", hex: "#ff2d78" },
  { id: "green", name: "Green", hex: "#3cba4a" },
  { id: "purple", name: "Purple", hex: "#7a3cff" },
  { id: "white", name: "White", hex: "#f4f4f4" },
];

/** Homepage stays one orange, one blue, one green. The classic orange and blue chubs are off this row. */
export const CHUB_FACES: Array<{ face: ChubFace; ink: string; label: string }> = [
  { face: "spray", ink: "orange", label: "Spray" },
  { face: "quest", ink: "blue", label: "Quest" },
  { face: "thumb", ink: "green", label: "Marker" },
  { face: "mob", ink: "green", label: "Mob" },
];

const NEW_FACES = new Set<ChubFace>(["spray", "thumb", "quest", "mob"]);

export function inkById(id: string) {
  return CHUB_INKS.find((ink) => ink.id === id) ?? CHUB_INKS[0];
}

export function faceLabel(face: string) {
  return CHUB_FACES.find((item) => item.face === face)?.label ?? "Chub";
}

export function isNewFace(face: ChubFace) {
  return NEW_FACES.has(face);
}

/** The file Printful should print. New characters are precolored so the order matches the model. */
export function printSrc(face: ChubFace, inkId: string) {
  const ink = inkById(inkId).id;
  const ext = face === "mob" ? "jpg" : "png";
  return `/art/prints/${face}-${ink}.${ext}`;
}

const MODEL_COLORS = new Set(["orange", "blue", "yellow", "red", "pink", "green"]);

/** Model in the shirt. No bare chub. Face "blue" is the slanted-eye drawing. */
export function modelLook(face: ChubFace, ink: string) {
  if (isNewFace(face)) return "/looks/blank-tee.jpg";
  const side = face === "blue" ? "mood" : "mean";
  const color = MODEL_COLORS.has(ink) ? ink : face === "blue" ? "blue" : "orange";
  return `/looks/${side}-${color}.jpg`;
}

export function faceSrc(face: ChubFace) {
  if (face === "blue") return "/art/chub-blue.png";
  if (face === "green") return "/art/chub-green.png";
  if (face === "spray") return "/art/chub-spray.png";
  if (face === "thumb") return "/art/chub-thumb.png";
  if (face === "quest") return "/art/prints/quest-blue.png";
  if (face === "mob") return "/art/chub-mob.jpg";
  return "/art/chub-orange.png";
}

const cache = new Map<string, string>();

export function renderChub(face: ChubFace, inkId: string): Promise<string> {
  if (isNewFace(face)) return Promise.resolve(printSrc(face, inkId));
  const ink = inkById(inkId);
  const native =
    (face === "mean" && ink.id === "orange") ||
    (face === "blue" && ink.id === "blue") ||
    (face === "green" && ink.id === "green");
  if (native) return Promise.resolve(faceSrc(face));
  const key = `${face}:${ink.id}`;
  const hit = cache.get(key);
  if (hit) return Promise.resolve(hit);
  return paint(faceSrc(face), ink.hex).then((url) => {
    cache.set(key, url);
    return url;
  });
}

function paint(src: string, hex: string): Promise<string> {
  const target = hexToRgb(hex);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const max = 720;
      const scale = Math.min(1, max / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        reject(new Error("Couldn’t recolor the chub."));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const frame = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = frame.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (a < 20) continue;
        const maxC = Math.max(r, g, b);
        const minC = Math.min(r, g, b);
        const sat = maxC === 0 ? 0 : (maxC - minC) / maxC;
        const lum = (r + g + b) / 3;
        if (lum < 48 || sat < 0.22) continue;
        const tone = Math.max(0.45, Math.min(1.2, lum / 145));
        data[i] = Math.min(255, Math.round(target[0] * tone));
        data[i + 1] = Math.min(255, Math.round(target[1] * tone));
        data[i + 2] = Math.min(255, Math.round(target[2] * tone));
      }
      context.putImageData(frame, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    image.onerror = () => reject(new Error("Couldn’t load the chub."));
    image.src = src;
  });
}

function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
