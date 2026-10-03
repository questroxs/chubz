import { readFile, writeFile } from "node:fs/promises";
import { head, put } from "@vercel/blob";
import { env } from "@/lib/env.server";

const PATH = "chubz/visits.json";
const FILE = "/tmp/chubz-visits.json";

async function readBlob(token: string): Promise<{ n: number; etag?: string }> {
  try {
    const meta = await head(PATH, { token });
    const response = await fetch(meta.url, { cache: "no-store" });
    if (!response.ok) return { n: 0 };
    const data = (await response.json()) as { n?: unknown };
    const n = typeof data.n === "number" && Number.isFinite(data.n) ? data.n : 0;
    return { n, etag: meta.etag };
  } catch {
    return { n: 0 };
  }
}

async function fileCount(increment: boolean): Promise<number> {
  let n = 0;
  try {
    const data = JSON.parse(await readFile(FILE, "utf8")) as { n?: unknown };
    if (typeof data.n === "number" && Number.isFinite(data.n)) n = data.n;
  } catch {
    n = 0;
  }
  if (!increment) return n;
  n += 1;
  await writeFile(FILE, JSON.stringify({ n }));
  return n;
}

/** One number for the homepage. Blob when the store token exists, a temp file otherwise. */
export async function nextVisitCount(increment: boolean): Promise<number> {
  const token = env("BLOB_READ_WRITE_TOKEN");
  if (!token) return fileCount(increment);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const current = await readBlob(token);
    if (!increment) return current.n;
    const n = current.n + 1;
    try {
      await put(PATH, JSON.stringify({ n }), {
        access: "public",
        token,
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
        cacheControlMaxAge: 0,
        ...(current.etag ? { ifMatch: current.etag } : {}),
      });
      return n;
    } catch {
      if (attempt === 2) return n;
    }
  }
  return 0;
}
