import { createFileRoute } from '@tanstack/react-router';
import AdminAlbums from '../../features/bytes/pages/admin/AdminAlbums';
export const Route = createFileRoute('/admin/albums')({
  head: () => ({ meta: [{ title: 'Albums — BytesMusic Admin' }, { name: 'description', content: 'Manage BytesMusic albums.' }, { property: 'og:title', content: 'Albums — BytesMusic Admin' }, { property: 'og:description', content: 'Manage BytesMusic albums.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: AdminAlbums,
});
