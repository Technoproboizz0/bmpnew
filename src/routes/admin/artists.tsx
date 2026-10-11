import { createFileRoute } from '@tanstack/react-router';
import AdminArtists from '../../features/bytes/pages/admin/AdminArtists';
export const Route = createFileRoute('/admin/artists')({
  head: () => ({ meta: [{ title: 'Artists — BytesMusic Admin' }, { name: 'description', content: 'Manage BytesMusic artists.' }, { property: 'og:title', content: 'Artists — BytesMusic Admin' }, { property: 'og:description', content: 'Manage BytesMusic artists.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: AdminArtists,
});
