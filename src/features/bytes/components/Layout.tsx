import { Outlet, Link } from '../routing';
import HeaderSearch from './HeaderSearch';
import Sidebar from './Sidebar';
import PlayerBar from './PlayerBar';
import { useAuth } from '../context/AuthContext';
import { Disc3, Menu, PanelLeftClose, PanelLeft, Search, ChevronDown, LogOut, Shield, Clock, Heart } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';

export default function Layout() {
  const { user, isAdmin, signOut } = useAuth();
  const pathname = useLocation({ select: l => l.pathname });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return <div className="ambient-bg flex h-dvh flex-col overflow-hidden">
    <div className="flex min-h-0 flex-1">
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} collapsed={sidebarCollapsed} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="floating-header z-20 grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-7 lg:px-9">
          <div className="flex min-w-0 items-center gap-3">
            <button aria-label="Open menu" onClick={() => setMobileNavOpen(true)} className="glass-control rounded-xl p-2 text-muted-foreground transition hover:text-foreground lg:hidden"><Menu size={21}/></button>
            <button aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} onClick={() => setSidebarCollapsed(v => !v)} className="glass-control hidden rounded-xl p-2 text-muted-foreground transition hover:text-foreground lg:inline-flex">{sidebarCollapsed ? <PanelLeft size={19}/> : <PanelLeftClose size={19}/>}</button>
            <HeaderSearch/>
          </div>
          {user ? <div className="relative" ref={profileRef}>
            <button onClick={() => setProfileOpen(v => !v)} className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5 transition hover:border-border-strong sm:pr-3" aria-label="Account menu"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">{user.email?.[0]?.toUpperCase()}</span><span className="hidden max-w-32 truncate text-xs sm:inline">{user.email}</span><ChevronDown size={14} className="hidden text-muted-foreground sm:block"/></button>
            {profileOpen && <div className="animate-slide-up absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden glass-float rounded-2xl p-2"><p className="truncate border-b border-border px-3 py-2 text-xs text-muted-foreground">{user.email}</p>{isAdmin && <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary"><Shield size={15}/>Admin panel</Link>}<Link to="/history" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary"><Clock size={15}/>History</Link><Link to="/likes" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary"><Heart size={15}/>Liked songs</Link><button onClick={() => { setProfileOpen(false); signOut(); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"><LogOut size={15}/>Sign out</button></div>}
          </div> : <Link to="/login" className="btn-primary whitespace-nowrap">Sign in</Link>}
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto pb-10"><div key={pathname} className="page-enter"><Outlet/></div></main>
      </div>
    </div>
    <PlayerBar/>
  </div>;
}
