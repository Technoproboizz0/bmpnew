import { createFileRoute } from '@tanstack/react-router';
import Home from '../features/bytes/pages/Home';
export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: 'BytesMusic — Listen & Discover' }, { name: 'description', content: 'Discover new music, trending tracks, artists and playlists on BytesMusic.' }, { property: 'og:title', content: 'BytesMusic — Listen & Discover' }, { property: 'og:description', content: 'Discover new music, trending tracks, artists and playlists on BytesMusic.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: Home,
});
