import type { Route } from './+types/contexto';
import { seo } from '@/lib/seo';
import { HotelShell } from '@/components/layout/hotel-shell';
import { PageIntro } from '@/components/procesos/page-intro';
import { DocSection } from '@/components/procesos/doc-section';
import { DiagramFigure } from '@/components/procesos/diagram-figure';
import { DofaMatrix } from '@/components/procesos/dofa-matrix';
import { StrategicObjectives } from '@/components/procesos/strategic-objectives';
import { MissionVision } from '@/components/procesos/mission-vision';

export function meta({ matches, location }: Route.MetaArgs) {
 return seo({ matches, location }, { title: 'Contexto · Hotel Amerindia', description: 'Mapa de procesos, diagrama BPMN, matriz DOFA, objetivos estratégicos, misión y visión del Hotel Amerindia.' });
}
export default function ContextoPage() {
 return <HotelShell><main>
  <PageIntro eyebrow="CONTEXTO" title={<>Contexto del<br/>Hotel Amerindia.</>}><p>Hotel de 21 habitaciones en Dabeiba, Antioquia. Mapa de procesos, BPMN del proceso actual, matriz DOFA, objetivos estratégicos, misión y visión.</p></PageIntro>
  <DocSection id="mapa-procesos" eyebrow="01 / MAPA DE PROCESOS" title="Mapa de procesos." tone="mint" wide><DiagramFigure src="/diagramas/mapa-procesos.png" alt="Mapa de procesos del Hotel Amerindia"/></DocSection>
  <DocSection id="bpmn" eyebrow="02 / BPMN DEL PROCESO ACTUAL (AS IS)" title="BPMN del proceso actual." wide><DiagramFigure src="/diagramas/bpmn-as-is.png" alt="Diagrama BPMN del proceso actual del Hotel Amerindia"/></DocSection>
  <DocSection id="dofa" eyebrow="03 / MATRIZ DOFA" title="Matriz DOFA." wide><DofaMatrix/></DocSection>
  <DocSection id="objetivos" eyebrow="04 / OBJETIVOS ESTRATÉGICOS" title="Objetivos estratégicos." tone="mint"><StrategicObjectives/></DocSection>
  <MissionVision/>
 </main></HotelShell>;
}
