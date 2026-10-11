import { createFileRoute } from '@tanstack/react-router';
import AdminHomepage from '../../features/bytes/pages/admin/AdminHomepage';
export const Route = createFileRoute('/admin/homepage')({
  head: () => ({ meta: [{ title: 'Homepage — BytesMusic Admin' }, { name: 'description', content: 'Manage BytesMusic homepage.' }, { property: 'og:title', content: 'Homepage — BytesMusic Admin' }, { property: 'og:description', content: 'Manage BytesMusic homepage.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: AdminHomepage,
});
