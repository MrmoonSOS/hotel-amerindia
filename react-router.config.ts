import type { Config } from '@react-router/dev/config';

// Sitio 100% estático: sin servidor, cada página se genera como HTML en el build.
// El MVP guarda sus datos en el navegador (localStorage), por lo que tampoco necesita backend.
export default {
	appDirectory: 'src',
	ssr: false,
	prerender: ['/', '/contexto', '/bpmn', '/mvp'],
} satisfies Config;
