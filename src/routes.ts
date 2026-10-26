import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
	index('routes/home.tsx'),
	route('correcciones', 'routes/correcciones.tsx'),
	route('entregable', 'routes/entregable.tsx'),
] satisfies RouteConfig;
