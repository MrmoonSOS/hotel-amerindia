import type { Route } from './+types/bpmn';
import { seo } from '@/lib/seo';
import { HotelShell } from '@/components/layout/hotel-shell';
import { PageIntro } from '@/components/procesos/page-intro';
import { DocSection } from '@/components/procesos/doc-section';
import { DiagramFigure } from '@/components/procesos/diagram-figure';
import { AsIsToBe } from '@/components/procesos/as-is-to-be';
import { UserStories } from '@/components/procesos/user-stories';
import { expectedBenefits, generalObjective, problem, scope, strategicAlignment, teamMembers } from '@/data/bpmn';
import { TeamMembers } from '@/components/procesos/team-members';

export function meta({ matches, location }: Route.MetaArgs) {
 return seo({ matches, location }, { title: 'BPMN · Entregable · Hotel Amerindia', description: 'Chatbot de reservas del Hotel Amerindia: problema, alcance, objetivos, BPMN TO BE, AS IS vs TO BE, historias de usuario, User Story Map, beneficios e integrantes.' });
}
export default function BpmnPage() {
 return <HotelShell><main>
  <PageIntro eyebrow="BPMN · ENTREGABLE" title={<>Chatbot de reservas<br/>Hotel Amerindia.</>}><p>Problema, alcance, objetivo general, alineación estratégica, diagrama BPMN TO BE, AS IS vs TO BE, historias de usuario, User Story Map, beneficios esperados e integrantes del proyecto.</p></PageIntro>
  <DocSection id="problema" eyebrow="01 / PROBLEMA" title="Problema." tone="mint"><p>{problem}</p></DocSection>
  <DocSection id="alcance" eyebrow="02 / ALCANCE" title="Alcance.">{scope.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</DocSection>
  <DocSection id="objetivo-general" eyebrow="03 / OBJETIVO GENERAL" title="Objetivo general." tone="blue"><p className="doc-statement">{generalObjective}</p></DocSection>
  <DocSection id="alineacion" eyebrow="04 / ALINEACIÓN ESTRATÉGICA" title="Alineación estratégica."><p>{strategicAlignment}</p></DocSection>
  <DocSection id="bpmn-to-be" eyebrow="05 / DIAGRAMA BPMN TO BE" title="Diagrama BPMN TO BE." tone="mint" wide><DiagramFigure src="/entregable/bpmn-to-be.png" alt="Diagrama BPMN TO BE del proceso de reservas con chatbot"/></DocSection>
  <DocSection id="as-is-to-be" eyebrow="06 / AS IS VS TO BE" title="AS IS vs TO BE." wide><AsIsToBe/></DocSection>
  <DocSection id="historias" eyebrow="07 / HISTORIAS DE USUARIO" title="Historias de usuario." tone="mint" wide><UserStories/></DocSection>
  <DocSection id="user-story-map" eyebrow="08 / USER STORY MAP" title="User Story Map." wide><DiagramFigure src="/entregable/user-story-map.jpg" alt="User Story Map del Hotel Amerindia"/></DocSection>
  <DocSection id="beneficios" eyebrow="09 / BENEFICIOS ESPERADOS PARA LA ORGANIZACIÓN" title="Beneficios esperados." tone="blue"><p className="doc-statement">{expectedBenefits}</p></DocSection>
  {teamMembers.length > 0 && <DocSection id="integrantes" eyebrow="10 / INTEGRANTES DEL PROYECTO" title="Integrantes." tone="mint"><TeamMembers/></DocSection>}
 </main></HotelShell>;
}
