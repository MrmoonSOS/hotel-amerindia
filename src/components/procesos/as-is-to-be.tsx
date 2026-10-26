import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { asIsToBe } from '@/data/entregable';

export function AsIsToBe() {
 return <Table className="as-is-to-be"><TableHeader><TableRow><TableHead>AS IS (hoy)</TableHead><TableHead>TO BE (con chatbot)</TableHead></TableRow></TableHeader><TableBody>{asIsToBe.map(row=><TableRow key={row.asIs}><TableCell>{row.asIs}</TableCell><TableCell>{row.toBe}</TableCell></TableRow>)}</TableBody></Table>;
}
