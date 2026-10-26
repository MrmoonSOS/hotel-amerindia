import type { Config } from '@react-router/dev/config';

// Sitio 100% estático: sin servidor, cada página se genera como HTML en el build.
export default {
	appDirectory: 'src',
	ssr: false,
	prerender: ['/', '/correcciones', '/entregable'],
} satisfies Config;
