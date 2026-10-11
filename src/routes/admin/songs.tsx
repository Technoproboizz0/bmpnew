import { createFileRoute } from '@tanstack/react-router';
import AdminSongs from '../../features/bytes/pages/admin/AdminSongs';
export const Route = createFileRoute('/admin/songs')({
  head: () => ({ meta: [{ title: 'Songs — BytesMusic Admin' }, { name: 'description', content: 'Manage BytesMusic songs.' }, { property: 'og:title', content: 'Songs — BytesMusic Admin' }, { property: 'og:description', content: 'Manage BytesMusic songs.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: AdminSongs,
});
