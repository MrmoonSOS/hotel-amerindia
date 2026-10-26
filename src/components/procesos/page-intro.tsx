export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode }) {
 return <section className="procesos-intro"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{children}</section>;
}
