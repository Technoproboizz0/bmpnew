import { createFileRoute } from '@tanstack/react-router';
import AdminUsers from '../../features/bytes/pages/admin/AdminUsers';
export const Route = createFileRoute('/admin/users')({
  head: () => ({ meta: [{ title: 'Users — BytesMusic Admin' }, { name: 'description', content: 'Manage BytesMusic users.' }, { property: 'og:title', content: 'Users — BytesMusic Admin' }, { property: 'og:description', content: 'Manage BytesMusic users.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: AdminUsers,
});
