import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
	index('routes/home.tsx'),
	route('contexto', 'routes/contexto.tsx'),
	route('bpmn', 'routes/bpmn.tsx'),
	route('mvp', 'routes/mvp.tsx'),
] satisfies RouteConfig;
