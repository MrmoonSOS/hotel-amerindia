/** Mensaje de éxito o error, coherente con el estilo del sitio. */
export function Feedback({ tone, title, children }: { tone: 'success' | 'error' | 'info'; title?: string; children?: React.ReactNode }) {
	return <div className={`mvp-feedback mvp-feedback--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>{title && <strong>{title}</strong>}{children && <div>{children}</div>}</div>;
}
