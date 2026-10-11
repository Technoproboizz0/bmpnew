import { createFileRoute } from '@tanstack/react-router';
import Login from '../features/bytes/pages/Login';
export const Route = createFileRoute('/login')({
  head: () => ({ meta: [{ title: 'Sign In — BytesMusic' }, { name: 'description', content: 'Sign in to BytesMusic to keep your music close.' }, { property: 'og:title', content: 'Sign In — BytesMusic' }, { property: 'og:description', content: 'Sign in to BytesMusic to keep your music close.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: Login,
});
