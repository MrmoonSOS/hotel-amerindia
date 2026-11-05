import { teamMembers } from '@/data/bpmn';

export function TeamMembers() {
 return <div className="objectives">{teamMembers.map((member,index)=><div key={member.name} className="service"><span>{String(index + 1).padStart(2,'0')}</span><div><h3>{member.name}</h3>{member.role && <p>{member.role}</p>}</div></div>)}</div>;
}
