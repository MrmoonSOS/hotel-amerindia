// Páginas principales del sitio (navbar y pestañas móviles). Al agregar una página, súmala también a `prerender` en react-router.config.ts.

export const pages = [
	{ to: '/', label: 'Inicio' },
	{ to: '/contexto', label: 'Contexto' },
	{ to: '/bpmn', label: 'BPMN' },
	{ to: '/mvp', label: 'MVP' },
] as const;

/** Anclas de la página de inicio que aparecen en el navbar de escritorio. */
export const homeAnchors = [
	{ to: '/#bienvenidos', label: 'El hotel' },
	{ to: '/#habitaciones', label: 'Habitaciones' },
	{ to: '/#entorno', label: 'El entorno' },
] as const;
