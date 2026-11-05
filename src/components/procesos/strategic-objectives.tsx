import { strategicObjectives } from '@/data/contexto';

export function StrategicObjectives() {
 return <div className="objectives">{strategicObjectives.map((objective,index)=><div key={objective} className="service"><span>{String(index + 1).padStart(2,'0')}</span><div><h3>{objective}</h3></div></div>)}</div>;
}
