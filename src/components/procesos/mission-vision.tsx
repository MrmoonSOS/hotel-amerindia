import { mission, vision } from '@/data/contexto';

export function MissionVision() {
 return <section className="mission-vision" id="mision-vision"><div><span className="eyebrow">MISIÓN</span><p>{mission}</p></div><div><span className="eyebrow">VISIÓN</span><p>{vision}</p></div></section>;
}
