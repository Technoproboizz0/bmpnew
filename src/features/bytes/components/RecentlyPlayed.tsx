import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { Link } from "../routing";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";

type Recent = { id: string; video_id: string; title: string; artist: string; thumbnail: string | null };

export default function RecentlyPlayed() {
  const { user } = useAuth();
  const { playTrack, currentTrack } = usePlayer();
  const [items, setItems] = useState<Recent[]>([]);

  useEffect(() => {
    if (!user) { setItems([]); return; }
    let active = true;
    supabase
      .from("user_history")
      .select("id, video_id, title, artist, thumbnail")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(40)
      .then(({ data }) => {
        if (!active) return;
        const seen = new Set<string>();
        const unique = (data ?? []).filter((r: Recent) => r.video_id && !seen.has(r.video_id) && seen.add(r.video_id));
        setItems(unique.slice(0, 12));
      });
    return () => { active = false; };
  }, [user, currentTrack]);

  if (!user || items.length === 0) return null;

  const queue = items.map((i) => ({ videoId: i.video_id, title: i.title, artist: i.artist, thumbnail: i.thumbnail })) as any[];

  return (
    <section className="animate-fade-in">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="section-title">Recently played</h2>
        <Link to="/history" className="text-xs text-muted-foreground transition hover:text-foreground">See all</Link>
      </div>
      <div className="scrollbar-hide -mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
        {items.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => playTrack(queue[idx], queue)}
            className="group w-36 shrink-0 text-left sm:w-40"
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-card">
              {item.thumbnail && <img src={item.thumbnail} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
              <span className="absolute bottom-2 right-2 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-xl transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <Play size={16} fill="currentColor" />
              </span>
            </div>
            <p className="mt-2.5 truncate text-sm font-medium">{item.title}</p>
            <p className="truncate text-xs text-muted-foreground">{item.artist}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
