import { createFileRoute } from '@tanstack/react-router';
import Register from '../features/bytes/pages/Register';
export const Route = createFileRoute('/register')({
  head: () => ({ meta: [{ title: 'Create Account — BytesMusic' }, { name: 'description', content: 'Join BytesMusic to save and discover music.' }, { property: 'og:title', content: 'Create Account — BytesMusic' }, { property: 'og:description', content: 'Join BytesMusic to save and discover music.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: Register,
});
