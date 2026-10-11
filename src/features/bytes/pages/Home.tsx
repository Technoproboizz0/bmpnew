import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Song, Artist, Album, Playlist, HomepageSection, HeroSlide } from "../types";
import { SongCard } from "../components/SongCard";
import RecentlyPlayed from "../components/RecentlyPlayed";
import { Play, ArrowUpRight, Disc3 } from "lucide-react";
import { Link } from "../routing";
import featureImage from "../../../assets/bytes-feature.jpg";

export default function Home() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [songsBySection, setSongsBySection] = useState<Record<string, Song[]>>({});
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: secs }, { data: slides }] = await Promise.all([
        supabase.from("homepage_sections").select("*").eq("is_active", true).order("display_order"),
        supabase.from("hero_slides").select("*").eq("is_active", true).order("display_order"),
      ]);

      const activeSections = secs ?? [];
      setSections(activeSections);
      setHeroSlides(slides ?? []);

      const sectionSongMap: Record<string, Song[]> = {};
      await Promise.all(
        activeSections
          .filter((s) => ["trending", "featured", "new_releases", "popular"].includes(s.section_key))
          .map(async (s) => {
            const sectionField =
              s.section_key === "new_releases" ? "new_release" : s.section_key === "trending" ? "trending" : s.section_key;
            const { data } = await supabase
              .from("songs")
              .select("*, artist:artists(*)")
              .eq("section", sectionField)
              .eq("is_published", true)
              .order("section_order")
              .limit(12);
            sectionSongMap[s.section_key] = data ?? [];
          })
      );
      setSongsBySection(sectionSongMap);

      const [{ data: art }, { data: alb }, { data: pl }] = await Promise.all([
        supabase.from("artists").select("*").order("created_at", { ascending: false }).limit(8),
        supabase.from("albums").select("*, artist:artists(*)").order("created_at", { ascending: false }).limit(8),
        supabase.from("playlists").select("*").order("created_at", { ascending: false }).limit(8),
      ]);
      setArtists(art ?? []);
      setAlbums(alb ?? []);
      setPlaylists(pl ?? []);

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div className="animate-[pulse_2.8s_ease-in-out_infinite] space-y-10 p-5 sm:p-8 lg:p-10"><div className="h-8 w-36 rounded-lg bg-secondary"/><div className="h-72 rounded-lg bg-card sm:h-96"/><div className="h-7 w-48 rounded-lg bg-secondary"/><div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{Array.from({ length: 5 }).map((_, i) => <div key={i}><div className="aspect-square rounded-lg bg-card"/><div className="mt-3 h-4 w-3/4 rounded-lg bg-secondary"/></div>)}</div></div>;
  }

  const hasNoContent =
    Object.values(songsBySection).every((s) => s.length === 0) &&
    artists.length === 0 &&
    albums.length === 0 &&
    playlists.length === 0;

  return (
    <div className="animate-fade-in">
      <div className="px-5 pb-10 pt-8 sm:px-8 lg:px-10 lg:pt-10">
        <div className="mb-7 flex items-end justify-between"><div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[.28em] text-muted-foreground">THE SOUND OF RIGHT NOW</p><h1 className="font-display text-4xl leading-none sm:text-5xl">Discover your next favorite.</h1></div><span className="hidden text-xs text-muted-foreground md:block">Curated for the curious listener</span></div>
        <section className="relative isolate min-h-[310px] overflow-hidden rounded-3xl bg-card sm:min-h-[380px] lg:min-h-[420px]">
          <img src={heroSlides[0]?.image_url || featureImage} alt="Editorial music feature" className="absolute inset-0 h-full w-full object-cover object-center opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent" />
          <div className="relative flex min-h-[310px] flex-col items-start justify-end p-6 sm:min-h-[380px] sm:p-10 lg:min-h-[420px] lg:p-12">
            <span className="mb-5 rounded-full border border-white/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.2em]">BYTESMUSIC EDITION 01</span>
            <h2 className="max-w-lg font-display text-5xl leading-[.95] text-white sm:text-6xl lg:text-7xl">{heroSlides[0]?.title || 'Stay for the sound.'}</h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">{heroSlides[0]?.subtitle || 'A place to find what moves you. Explore music without limits.'}</p>
            <Link to="/search" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:scale-[1.03]">Explore music <ArrowUpRight size={15}/></Link>
          </div>
        </section>
      </div>

      <div className="space-y-12 px-5 pb-12 sm:px-8 lg:px-10">
        <RecentlyPlayed />
        {hasNoContent && (
          <div className="card flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mint-500/10">
              <Play className="text-mint-500" size={28} />
            </div>
            <h2 className="mb-2 font-display text-3xl text-ink-50">Your next listen is waiting</h2>
            <p className="max-w-md text-sm text-ink-400">
              The collection is just getting started. In the meantime, search for something you love.
            </p>
            <Link to="/search" className="btn-primary mt-6">Explore search <ArrowUpRight size={15}/></Link>
          </div>
        )}

        {sections
          .filter((s) => s.section_key !== "hero")
          .map((section) => {
            if (["trending", "featured", "new_releases", "popular"].includes(section.section_key)) {
              const songs = songsBySection[section.section_key] ?? [];
              if (songs.length === 0) return null;
              return (
                <section key={section.id} className="mb-10">
                  <div className="mb-4">
                    <h2 className="section-title">{section.title}</h2>
                    {section.subtitle && <p className="mt-1 text-sm text-ink-400">{section.subtitle}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {songs.map((song) => (
                      <SongCard key={song.id} song={song} queue={songs} />
                    ))}
                  </div>
                </section>
              );
            }

            if (section.section_key === "featured_artists") {
              if (artists.length === 0) return null;
              return (
                <section key={section.id} className="mb-10">
                  <div className="mb-4">
                    <h2 className="section-title">{section.title}</h2>
                    {section.subtitle && <p className="mt-1 text-sm text-ink-400">{section.subtitle}</p>}
                  </div>
                  <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                    {artists.map((artist) => (
                      <div key={artist.id} className="shrink-0 w-36 text-center sm:w-40">
                        <div className="mx-auto mb-3 h-28 w-28 overflow-hidden rounded-full bg-base-700 sm:h-32 sm:w-32">
                          {artist.image_url && (
                            <img src={artist.image_url} alt={artist.name} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <h3 className="truncate text-sm font-semibold text-ink-50">{artist.name}</h3>
                        <p className="truncate text-xs text-ink-400">Artist</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            if (section.section_key === "featured_albums") {
              if (albums.length === 0) return null;
              return (
                <section key={section.id} className="mb-10">
                  <div className="mb-4">
                    <h2 className="section-title">{section.title}</h2>
                    {section.subtitle && <p className="mt-1 text-sm text-ink-400">{section.subtitle}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {albums.map((album) => (
                      <div key={album.id} className="card card-hover group cursor-pointer p-3">
                        <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-base-700">
                          {album.cover_url ? (
                            <img src={album.cover_url} alt={album.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-ink-400">
                              <Play size={28} />
                            </div>
                          )}
                        </div>
                        <h3 className="truncate text-sm font-semibold text-ink-50">{album.title}</h3>
                        <p className="truncate text-xs text-ink-400">{album.artist?.name ?? "Unknown"}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            if (section.section_key === "playlists") {
              if (playlists.length === 0) return null;
              return (
                <section key={section.id} className="mb-10">
                  <div className="mb-4">
                    <h2 className="section-title">{section.title}</h2>
                    {section.subtitle && <p className="mt-1 text-sm text-ink-400">{section.subtitle}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {playlists.map((pl) => (
                      <div key={pl.id} className="card card-hover group cursor-pointer p-3">
                        <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-base-700">
                          {pl.cover_url ? (
                            <img src={pl.cover_url} alt={pl.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-ink-400">
                              <Play size={28} />
                            </div>
                          )}
                        </div>
                        <h3 className="truncate text-sm font-semibold text-ink-50">{pl.title}</h3>
                        <p className="truncate text-xs text-ink-400">{pl.description ?? "Playlist"}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            return null;
          })}
      </div>
    </div>
  );
}
