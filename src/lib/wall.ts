import { createServerFn } from "@tanstack/react-start";
import type { WallPost } from "@/lib/wall.server";

const ART_LIMIT = 180_000;

export type { WallPost };

export const listWallPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { listWallRows } = await import("@/lib/wall.server");
  return listWallRows();
});

export const addWallPost = createServerFn({ method: "POST" })
  .validator((data: { handle: string; city: string; body: string; image?: string }) => {
    const handle = data.handle.trim().replace(/^@/, "");
    const city = data.city.trim();
    const body = data.body.trim();
    if (handle.length < 2 || handle.length > 16) throw new Error("Tag is 2–16 letters.");
    if (city.length < 2 || city.length > 32) throw new Error("City is 2–32 letters.");
    if (body.length < 4 || body.length > 280) throw new Error("Write between 4 and 280 characters.");
    let image: string | undefined;
    if (data.image) {
      if (!data.image.startsWith("data:image/jpeg") || data.image.length > ART_LIMIT) {
        throw new Error("Photo has to be a small JPEG.");
      }
      image = data.image;
    }
    return { handle, city, body, image };
  })
  .handler(async ({ data }) => {
    const { insertWallRow } = await import("@/lib/wall.server");
    return insertWallRow(data);
  });
