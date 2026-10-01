import { getSql } from "@/lib/db";

export type WallPost = {
  id: string;
  handle: string;
  city: string;
  body: string;
  image: string | null;
  created_at: string;
};

export async function listWallRows(): Promise<WallPost[]> {
  const sql = await getSql();
  const rows = await sql<WallPost>`
    select id, handle, city, body, image, created_at
    from wall_posts
    order by created_at desc
    limit 40
  `;
  return rows.map((row) => ({ ...row, created_at: String(row.created_at) }));
}

export async function insertWallRow(data: { handle: string; city: string; body: string; image?: string }) {
  const sql = await getSql();
  const id = `tag_${crypto.randomUUID()}`;
  await sql`
    insert into wall_posts (id, handle, city, body, image)
    values (${id}, ${data.handle}, ${data.city}, ${data.body}, ${data.image ?? null})
  `;
  return { id };
}
