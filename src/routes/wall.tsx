import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { TagBoard } from "@/components/tag-board";
import { addWallPost, listWallPosts, type WallPost } from "@/lib/wall";

export const Route = createFileRoute("/wall")({
  head: () => ({
    meta: [
      { title: "The Wall — Chubz" },
      { name: "description", content: "Write from your city. Drop a photo of the piece." },
    ],
  }),
  component: WallPage,
});

const house = [
  { src: "/looks/campaign.jpg", alt: "Campaign group in Chubz black", caption: "Drop 01, full crew" },
  { src: "/looks/orange-tee-a.jpg", alt: "Orange chub tee", caption: "Mean Orange" },
  { src: "/looks/blue-hoodie.jpg", alt: "Blue chub hoodie", caption: "Blue Mood Hood" },
];

const slaps = ["bg-pink text-pink-ink", "bg-yellow text-yellow-ink", "bg-volt text-volt-ink"] as const;

function WallPage() {
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [ready, setReady] = useState(false);
  const [handle, setHandle] = useState("");
  const [city, setCity] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let live = true;
    void listWallPosts()
      .then((rows) => {
        if (live) setPosts(rows);
      })
      .catch(() => {
        if (live) setError("The wall didn’t load.");
      })
      .finally(() => {
        if (live) setReady(true);
      });
    return () => {
      live = false;
    };
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setError("");
    const line = body.trim().length >= 4 ? body.trim() : "Threw a tag.";
    if (!image) {
      setError("Draw the tag, then hit Use this tag.");
      setSending(false);
      return;
    }
    if (image.length > 180_000) {
      setError("That tag is too heavy. Clear it and throw a simpler one.");
      setSending(false);
      return;
    }
    try {
      await addWallPost({ data: { handle, city, body: line, image } });
      const rows = await listWallPosts();
      setPosts(rows);
      setBody("");
      setImage(undefined);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Couldn’t post that.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-volt">Forum</p>
      <h1 className="mt-2 text-4xl font-semibold">The wall</h1>
      <p className="mt-3 max-w-xl text-mute">
        Draw the tag on the board. Add your writer name and city so people know where it landed. Don’t put a real name or a phone number up here.
      </p>
      <div className="mt-8 grid grid-cols-3 gap-2 md:gap-4">
        {house.map((shot) => (
          <figure key={shot.src} className="border border-line bg-panel">
            <img src={shot.src} alt={shot.alt} className="aspect-[3/4] w-full object-cover" />
            <figcaption className="px-3 py-2 text-xs font-semibold uppercase tracking-widest">{shot.caption}</figcaption>
          </figure>
        ))}
      </div>
      <section className="mt-12 grid gap-8">
        <form onSubmit={(event) => void onSubmit(event)} className="border border-line bg-panel p-4 md:col-span-2">
          <h2 className="text-xl font-semibold">Write on it</h2>
          <div className="mt-4">
            <TagBoard onExport={(jpeg) => { setImage(jpeg); setError(""); }} />
          </div>
          {image ? <p className="mt-2 text-sm text-yellow">Tag locked in. Name it and throw it up.</p> : null}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-semibold uppercase tracking-widest text-mute">Tag</span>
              <input value={handle} onChange={(event) => setHandle(event.target.value)} maxLength={16} className="mt-1 min-h-11 w-full border border-line bg-ink px-3" />
            </label>
            <label className="block text-sm">
              <span className="font-semibold uppercase tracking-widest text-mute">City</span>
              <input value={city} onChange={(event) => setCity(event.target.value)} maxLength={32} className="mt-1 min-h-11 w-full border border-line bg-ink px-3" />
            </label>
          </div>
          <label className="mt-4 block text-sm">
            <span className="font-semibold uppercase tracking-widest text-mute">Caption, optional</span>
            <input value={body} onChange={(event) => setBody(event.target.value)} maxLength={280} className="mt-1 min-h-11 w-full border border-line bg-ink px-3" />
          </label>
          {error ? (
            <p className="mt-3 text-pink" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={sending} className="mt-4 inline-flex min-h-11 items-center bg-pink px-4 font-semibold uppercase tracking-widest text-pink-ink disabled:opacity-40">
            {sending ? "Throwing…" : "Throw it up"}
          </button>
        </form>
        <div>
          <h2 className="text-xl font-semibold">Fresh tags</h2>
          {!ready ? <p className="mt-4 text-mute">Loading the wall…</p> : null}
          {ready && posts.length === 0 ? (
            <p className="mt-4 border border-dashed border-line p-6 text-mute">Nobody’s written yet. You first.</p>
          ) : null}
          <ul className="mt-4 flex flex-col gap-3">
            {posts.map((post, index) => (
              <li key={post.id} className={`px-4 py-3 ${slaps[index % slaps.length]}`}>
                <p className="text-xs font-semibold uppercase tracking-widest">
                  @{post.handle} · {post.city}
                </p>
                <p className="mt-1 text-lg font-semibold">{post.body}</p>
                {post.image ? <img src={post.image} alt="" className="mt-3 max-h-64 w-full object-cover" /> : null}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
