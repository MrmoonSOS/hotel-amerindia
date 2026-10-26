import type { MetaDescriptor } from 'react-router';

type SeoArgs = { matches?: unknown; location?: unknown };
type SeoOptions = { title: string; description: string };

/** Etiquetas básicas de título y descripción para cada página. */
export function seo(_args: SeoArgs, { title, description }: SeoOptions): MetaDescriptor[] {
	return [
		{ title },
		{ name: 'description', content: description },
		{ property: 'og:title', content: title },
		{ property: 'og:description', content: description },
	];
}
