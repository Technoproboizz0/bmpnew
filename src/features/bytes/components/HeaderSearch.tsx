import { useCallback, useEffect, useRef, useState } from "react";
import { Search as SearchIcon, X, Music2, Play, Loader2 } from "lucide-react";
import { Link } from "../routing";
import { usePlayer } from "../context/PlayerContext";
import { supabase, supabaseUrl, supabaseAnonKey } from "../lib/supabase";
import type { QueueItem, Song, YouTubeResult } from "../types";

const API_BASE = supabaseUrl;
const ANON_KEY = supabaseAnonKey;

interface SearchResponse {
  songs: Song[];
  artists?: unknown[];
  albums?: unknown[];
  youtube: YouTubeResult[];
  error?: string;
}

function thumbFor(item: QueueItem): string | null {
  if ("videoId" in item) return item.thumbnail || null;
  const song = item as Song;
  return song.cover_url || (song.video_id ? `https://i.ytimg.com/vi/${song.video_id}/mqdefault.jpg` : null);
}

function subtitleFor(item: QueueItem): string {
  if ("channel" in item) return item.channel;
  const song = item as Song;
  return song.artist?.name ?? "Unknown artist";
}

export default function HeaderSearch() {
  const { playTrack } = usePlayer();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/functions/v1/music-search?q=${encodeURIComponent(q)}`,
        { headers: { Authorization: `Bearer ${ANON_KEY}`, apikey: ANON_KEY } }
      );
      if (!res.ok) throw new Error(`Search failed (${res.status})`);
      const data: SearchResponse = await res.json();
      setResults([...(data.songs ?? []), ...(data.youtube ?? [])]);
    } catch {
      // Fallback: query the local database directly
      try {
        const { data } = await supabase
          .from("songs")
          .select("*, artist:artists(*)")
          .ilike("title", `%${q}%`)
          .eq("is_published", true)
          .order("plays", { ascending: false })
          .limit(10);
        setResults((data as Song[]) ?? []);
      } catch {
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 400);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  const shown = results.slice(0, 6);
  const hasAny = results.length > 0;

  const play = (item: QueueItem) => {
    playTrack(item, results);
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
  };

  return (
    <div ref={wrapRef} className="relative min-w-0 w-full max-w-2xl">
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className={`floating-search flex items-center gap-3 rounded-2xl px-4 sm:px-5 ${open ? "floating-search-active" : ""}`}
      >
        {loading ? (
          <Loader2 size={18} className="shrink-0 animate-[spin_1.6s_linear_infinite] text-muted-foreground" />
        ) : (
          <SearchIcon size={18} className="shrink-0 text-muted-foreground" />
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search songs, artists, playlists"
          aria-label="Search songs, artists, playlists"
          className="min-w-0 flex-1 bg-transparent py-0 text-xs text-foreground outline-none placeholder:text-muted-foreground sm:text-sm"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="shrink-0 text-muted-foreground transition hover:text-foreground"
          >
            <X size={15} />
          </button>
        )}
      </form>

      {open && query.trim() && (
        <div className="animate-slide-up absolute left-0 top-full z-50 mt-2 w-full overflow-hidden glass-float rounded-2xl p-2">
          {loading && !hasAny && (
            <p className="px-3 py-4 text-center text-xs text-muted-foreground">Searching…</p>
          )}
          {!loading && !hasAny && (
            <p className="px-3 py-4 text-center text-xs text-muted-foreground">No results for “{query}”</p>
          )}
          {hasAny && (
            <ul className="max-h-[52vh] overflow-y-auto scrollbar-hide">
              {shown.map((item) => {
                const thumb = thumbFor(item);
                return (
                  <li key={"videoId" in item ? item.videoId : (item as Song).id}>
                    <button
                      type="button"
                      onClick={() => play(item)}
                      className="group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition hover:bg-secondary/70"
                    >
                      <span className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-secondary">
                        {thumb ? (
                          <img src={thumb} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="grid h-full w-full place-items-center text-muted-foreground"><Music2 size={16} /></span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-foreground">{item.title}</span>
                        <span className="block truncate text-xs text-muted-foreground">{subtitleFor(item)}</span>
                      </span>
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foreground text-background opacity-0 transition group-hover:opacity-100">
                        <Play size={14} fill="currentColor" className="ml-0.5" />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {(hasAny || results.length > 6) && (
            <Link
              to="/search"
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center justify-center rounded-xl border-t border-border px-3 py-2.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
            >
              See all results
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
