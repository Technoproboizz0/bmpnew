import { createFileRoute } from '@tanstack/react-router';
import AdminPlaylists from '../../features/bytes/pages/admin/AdminPlaylists';
export const Route = createFileRoute('/admin/playlists')({
  head: () => ({ meta: [{ title: 'Playlists — BytesMusic Admin' }, { name: 'description', content: 'Manage BytesMusic playlists.' }, { property: 'og:title', content: 'Playlists — BytesMusic Admin' }, { property: 'og:description', content: 'Manage BytesMusic playlists.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: AdminPlaylists,
});
