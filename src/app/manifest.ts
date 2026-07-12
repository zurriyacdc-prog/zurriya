import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Zurriya — Child Development Center',
    short_name: 'Zurriya',
    description: 'Family & therapist portal for Zurriya Child Development Center',
    start_url: '/en',
    display: 'standalone',
    background_color: '#FAFAF5',
    theme_color: '#1B5E6E',
    orientation: 'portrait',
    icons: [
      { src: '/logo/logo.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/logo/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
