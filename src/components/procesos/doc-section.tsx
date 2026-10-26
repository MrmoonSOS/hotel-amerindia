type Tone = 'stone' | 'mint' | 'blue';

/** Bloque de contenido con el mismo ritmo de la página principal: etiqueta + título a la izquierda, contenido a la derecha. */
export function DocSection({ id, eyebrow, title, tone = 'stone', wide = false, children }: { id?: string; eyebrow: string; title: React.ReactNode; tone?: Tone; wide?: boolean; children: React.ReactNode }) {
 return <section id={id} className={`doc-section doc-section--${tone} ${wide ? 'doc-section--wide' : ''}`}><div className="doc-section__head"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div><div className="doc-section__body">{children}</div></section>;
}
