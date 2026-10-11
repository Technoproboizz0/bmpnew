import { createFileRoute } from '@tanstack/react-router';
import History from '../features/bytes/pages/History';
export const Route = createFileRoute('/history')({
  head: () => ({ meta: [{ title: 'Listening History — BytesMusic' }, { name: 'description', content: 'Revisit the songs you have played on BytesMusic.' }, { property: 'og:title', content: 'Listening History — BytesMusic' }, { property: 'og:description', content: 'Revisit the songs you have played on BytesMusic.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: History,
});
