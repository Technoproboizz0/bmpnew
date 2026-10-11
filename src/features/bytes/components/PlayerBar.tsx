import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Shuffle, Repeat, Repeat1, List, X, Heart, AlertCircle } from "lucide-react";
import { usePlayer, getThumbnail, getTitle, getArtist, isYouTubeSource, formatTime } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { isSong } from "../types";
import { useState, useEffect, useRef } from "react";

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    playerReady,
    playbackError,
    currentTime,
    duration,
    togglePlay,
    next,
    prev,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    queue,
    currentIndex,
    removeFromQueue,
    dismissError,
    seek,
  } = usePlayer();
  const { user } = useAuth();
  const [showQueue, setShowQueue] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const seekBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!currentTrack || !user) {
      setLiked(false);
      return;
    }
    const vid = isSong(currentTrack) ? currentTrack.video_id : (currentTrack as any).videoId;
    if (!vid) return;
    supabase
      .from("user_likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("video_id", vid)
      .maybeSingle()
      .then(({ data }) => setLiked(!!data));
  }, [currentTrack, user]);

  const toggleLike = async () => {
    if (!currentTrack || !user) return;
    const vid = isSong(currentTrack) ? currentTrack.video_id : (currentTrack as any).videoId;
    if (!vid) return;

    if (liked) {
      await supabase.from("user_likes").delete().eq("user_id", user.id).eq("video_id", vid);
      setLiked(false);
    } else {
      await supabase.from("user_likes").insert({
        user_id: user.id,
        video_id: vid,
        song_id: isSong(currentTrack) ? currentTrack.id : null,
        title: getTitle(currentTrack),
        artist: getArtist(currentTrack),
        thumbnail: getThumbnail(currentTrack),
      });
      setLiked(true);
    }
  };

  const seekFromEvent = (clientX: number) => {
    const bar = seekBarRef.current;
    if (!bar || !duration) return 0;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return pct * duration;
  };

  const handleSeekStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!playerReady || !duration) return;
    const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
    const t = seekFromEvent(clientX);
    setIsDragging(true);
    setDragTime(t);
  };

  const handleSeekMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
    setDragTime(seekFromEvent(clientX));
  };

  const handleSeekEnd = () => {
    if (isDragging) {
      seek(dragTime);
      setIsDragging(false);
    }
  };

  // Interpolate between the player's 500ms time updates so the bar moves smoothly
  const [smoothTime, setSmoothTime] = useState(currentTime);
  const anchorRef = useRef({ time: currentTime, at: 0 });
  useEffect(() => {
    anchorRef.current = { time: currentTime, at: performance.now() };
    setSmoothTime(currentTime);
  }, [currentTime]);
  useEffect(() => {
    if (!isPlaying) return;
    let raf = 0;
    const tick = () => {
      const { time, at } = anchorRef.current;
      setSmoothTime(time + Math.min(1, (performance.now() - at) / 1000));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying]);

  if (!currentTrack) {
    return (
      <footer className="relative z-50 mx-3 mb-3 flex h-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl glass-float px-4">
        <p className="text-sm text-ink-400">Your music starts here — choose a song to listen</p>
      </footer>
    );
  }

  const thumb = getThumbnail(currentTrack);
  const title = getTitle(currentTrack);
  const artist = getArtist(currentTrack);
  const displayTime = isDragging ? dragTime : smoothTime;
  const progressPct = duration > 0 ? Math.min(100, (displayTime / duration) * 100) : 0;

  return (
    <>
      {playbackError && (
        <div className="fixed bottom-[128px] left-3 right-3 z-30 flex items-center gap-3 rounded-2xl border border-danger-500/30 bg-danger-500/10 px-4 py-2 backdrop-blur-md">
          <AlertCircle className="shrink-0 text-danger-500" size={16} />
          <p className="flex-1 truncate text-xs text-danger-500">{playbackError}</p>
          <button
            onClick={next}
            className="shrink-0 rounded-lg bg-danger-500/20 px-2 py-1 text-xs font-medium text-danger-500 transition hover:bg-danger-500/30"
          >
            Skip
          </button>
          <button
            onClick={dismissError}
            className="shrink-0 text-danger-500 transition hover:text-danger-400"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {expanded && <div className="fixed inset-0 z-40 flex items-center justify-center glass-scrim p-5" onClick={() => setExpanded(false)}><div className="flex w-full max-w-md flex-col items-center text-center" onClick={e => e.stopPropagation()}><button onClick={() => setExpanded(false)} className="mb-8 self-end rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Close Now Playing"><X size={22}/></button>{thumb && <img src={thumb} alt="" className="aspect-square w-full max-w-[320px] rounded-3xl object-cover shadow-2xl ring-1 ring-foreground/10"/>}<p className="mt-8 font-display text-4xl">{title}</p><p className="mt-2 text-sm text-muted-foreground">{artist}</p><div className="mt-7 flex items-center gap-8"><button onClick={prev} aria-label="Previous"><SkipBack size={22}/></button><button onClick={togglePlay} disabled={!playerReady} aria-label={isPlaying ? 'Pause' : 'Play'} className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground">{isPlaying ? <Pause fill="currentColor"/> : <Play fill="currentColor"/>}</button><button onClick={next} aria-label="Next"><SkipForward size={22}/></button></div><p className="mt-6 text-xs text-muted-foreground">{formatTime(currentTime)} / {formatTime(duration)}</p><button onClick={() => { setExpanded(false); setShowQueue(true); }} className="mt-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><List size={16}/> Up Next</button></div></div>}
      {showQueue && (
        <div className="fixed bottom-[128px] right-4 z-30 w-96 max-w-[calc(100vw-2rem)] glass-float rounded-3xl animate-slide-up">
          <div className="flex items-center justify-between border-b border-base-600 p-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-ink-50">Up Next</h3>
              {user && (
                <button
                  onClick={toggleLike}
                  className={`shrink-0 rounded-lg p-1 transition ${liked ? "text-mint-500" : "text-ink-400 hover:text-mint-400"}`}
                  title={liked ? "Unlike" : "Like"}
                >
                  <Heart size={14} fill={liked ? "currentColor" : "none"} />
                </button>
              )}
            </div>
            <button onClick={() => setShowQueue(false)} className="text-ink-400 hover:text-mint-400">
              <X size={16} />
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {queue.length === 0 ? (
              <p className="p-4 text-center text-xs text-ink-400">Queue is empty</p>
            ) : (
              queue.map((track, i) => (
                <div
                  key={i}
                  className={`group flex items-center gap-2 rounded-lg p-2 transition ${
                    i === currentIndex ? "bg-mint-500/10" : "hover:bg-base-700"
                  }`}
                >
                  <img
                    src={getThumbnail(track) || ""}
                    alt=""
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-ink-100">{getTitle(track)}</p>
                    <p className="truncate text-xs text-ink-400">{getArtist(track)}</p>
                  </div>
                  {i === currentIndex && (
                    <div className="flex items-center gap-0.5">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-mint-500" />
                    </div>
                  )}
                  <button
                    onClick={() => removeFromQueue(i)}
                    className="text-ink-400 opacity-0 transition hover:text-danger-500 group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <footer className="relative z-50 mx-3 mb-3 flex shrink-0 flex-col overflow-hidden rounded-3xl glass-float">
        {/* Seek bar */}
        <div
          ref={seekBarRef}
          className="group relative mx-4 mt-3 h-1.5 w-[calc(100%-2rem)] cursor-pointer overflow-hidden rounded-full bg-base-600 transition-[height] hover:h-2"
          onMouseDown={handleSeekStart}
          onMouseMove={handleSeekMove}
          onMouseUp={handleSeekEnd}
          onMouseLeave={handleSeekEnd}
          onTouchStart={handleSeekStart}
          onTouchMove={handleSeekMove}
          onTouchEnd={handleSeekEnd}
        >
          <div
            className={`progress-fill absolute left-0 top-0 h-full overflow-hidden bg-mint-500 transition-[width] duration-150 ${isPlaying ? 'is-playing' : ''}`}
            style={{ width: `${progressPct}%` }}
          />
          <div
            className={`progress-head absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint-500 transition-[opacity,transform] group-hover:scale-125 ${isPlaying ? 'is-playing' : ''}`}
            style={{ left: `${progressPct}%`, opacity: isDragging ? 1 : undefined }}
          />
        </div>

        <div className="grid min-h-[82px] grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 sm:grid-cols-[minmax(0,1fr)_minmax(240px,1.2fr)_minmax(0,1fr)] sm:px-6">
          {/* Cover artwork */}
          <div className="hidden min-w-0 items-center gap-3 sm:flex">
            {thumb && (
              <img src={thumb} alt="" className="h-11 w-11 rounded-xl object-cover" />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-medium text-ink-50">{title}</p>
              </div>
              <p className="truncate text-xs text-ink-400">{artist}</p>
            </div>
          </div>

          {/* Center: title + artist (above), then controls + time */}
          <div className="flex min-w-0 flex-col items-center justify-center gap-1.5">
            <button onClick={() => setExpanded(v => !v)} title="Now Playing" className="max-w-full truncate text-xs font-semibold text-foreground hover:underline">{title} <span className="font-normal text-muted-foreground">· {artist}</span></button>
          <div className="flex items-center justify-center gap-2 sm:gap-3">
              <span className="hidden w-10 text-right text-[10px] tabular-nums text-ink-400 sm:inline">
                {formatTime(displayTime)}
              </span>
              <button
                onClick={toggleShuffle}
                className={`hidden rounded-lg p-1.5 transition sm:block ${
                  isShuffled ? "text-mint-500" : "text-ink-400 hover:text-ink-100"
                }`}
              >
                <Shuffle size={14} />
              </button>
              <button onClick={prev} className="rounded-lg p-1.5 text-ink-200 transition hover:text-mint-400">
                <SkipBack size={16} />
              </button>
              <button
                onClick={togglePlay}
                disabled={!playerReady}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-mint-500 text-base-900 transition hover:bg-mint-400 active:scale-95 disabled:opacity-50"
              >
                {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
              </button>
              <button onClick={next} className="rounded-lg p-1.5 text-ink-200 transition hover:text-mint-400">
                <SkipForward size={16} />
              </button>
              <button
                onClick={cycleRepeat}
                className={`hidden rounded-lg p-1.5 transition sm:block ${
                  repeatMode !== "off" ? "text-mint-500" : "text-ink-400 hover:text-ink-100"
                }`}
              >
                {repeatMode === "one" ? <Repeat1 size={14} /> : <Repeat size={14} />}
              </button>
              <span className="hidden w-10 text-[10px] tabular-nums text-ink-400 sm:inline">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right: queue + like + volume */}
          <div className="flex items-center justify-end gap-1 sm:gap-2">
            {user && (
              <button
                onClick={toggleLike}
                className={`shrink-0 rounded-lg p-2 transition ${liked ? "text-mint-500" : "text-ink-400 hover:text-mint-400"}`}
                title={liked ? "Unlike" : "Like"}
              >
                <Heart size={16} fill={liked ? "currentColor" : "none"} />
              </button>
            )}
            <button
              title="Up Next" aria-label="Up Next"
              onClick={() => setShowQueue((s) => !s)}
              className={`rounded-lg p-2 transition ${showQueue ? "text-mint-500" : "text-ink-400 hover:text-ink-100"}`}
            >
              <List size={18} />
            </button>
            <div className="hidden items-center gap-2 md:flex">
              <button onClick={toggleMute} className="text-ink-400 transition hover:text-mint-400">
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-base-500 accent-mint-500"
              />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
