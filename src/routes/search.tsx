import { createFileRoute } from '@tanstack/react-router';
import Search from '../features/bytes/pages/Search';
export const Route = createFileRoute('/search')({
  head: () => ({ meta: [{ title: 'Search Music — BytesMusic' }, { name: 'description', content: 'Find songs, artists, albums and YouTube music on BytesMusic.' }, { property: 'og:title', content: 'Search Music — BytesMusic' }, { property: 'og:description', content: 'Find songs, artists, albums and YouTube music on BytesMusic.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: Search,
});
