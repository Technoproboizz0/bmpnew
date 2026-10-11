import { createFileRoute } from '@tanstack/react-router';
import AdminDashboard from '../../features/bytes/pages/admin/AdminDashboard';
export const Route = createFileRoute('/admin/')({
  head: () => ({ meta: [{ title: 'Dashboard — BytesMusic Admin' }, { name: 'description', content: 'Manage BytesMusic dashboard.' }, { property: 'og:title', content: 'Dashboard — BytesMusic Admin' }, { property: 'og:description', content: 'Manage BytesMusic dashboard.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: AdminDashboard,
});
