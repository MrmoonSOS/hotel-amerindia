import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

/** Imagen de un diagrama que se abre en grande al hacer clic (con desplazamiento en pantallas pequeñas). */
export function DiagramFigure({ src, alt }: { src: string; alt: string }) {
 return <Dialog><figure className="diagram"><DialogTrigger asChild><button type="button" className="diagram__trigger" aria-label={`Ampliar: ${alt}`}><img loading="lazy" src={src} alt={alt}/></button></DialogTrigger><figcaption>Haz clic en la imagen para verla en grande ↗</figcaption></figure><DialogContent className="diagram-zoom" aria-describedby={undefined}><DialogTitle className="sr-only">{alt}</DialogTitle><div className="diagram-zoom__scroll"><img src={src} alt={alt}/></div></DialogContent></Dialog>;
}
