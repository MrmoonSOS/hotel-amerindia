import { dofa } from '@/data/contexto';

export function DofaMatrix() {
 return <div className="dofa">{dofa.map(block=><div key={block.key} className={`dofa__block dofa__block--${block.key}`}><h3>{block.title}</h3><ul>{block.items.map(item=><li key={item}>{item}</li>)}</ul></div>)}</div>;
}
