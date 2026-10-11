import { createFileRoute } from '@tanstack/react-router';
import PlaylistPage from '../../features/bytes/pages/PlaylistPage';
export const Route = createFileRoute('/playlist/$id')({
  head: () => ({ meta: [{ title: 'Playlist — BytesMusic' }, { name: 'description', content: 'Listen to a playlist on BytesMusic.' }, { property: 'og:title', content: 'Playlist — BytesMusic' }, { property: 'og:description', content: 'Listen to a playlist on BytesMusic.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: PlaylistPage,
});
