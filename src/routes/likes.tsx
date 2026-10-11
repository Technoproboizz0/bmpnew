import { createFileRoute } from '@tanstack/react-router';
import Likes from '../features/bytes/pages/Likes';
export const Route = createFileRoute('/likes')({
  head: () => ({ meta: [{ title: 'Liked Songs — BytesMusic' }, { name: 'description', content: 'Listen to your favorite songs on BytesMusic.' }, { property: 'og:title', content: 'Liked Songs — BytesMusic' }, { property: 'og:description', content: 'Listen to your favorite songs on BytesMusic.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: Likes,
});
