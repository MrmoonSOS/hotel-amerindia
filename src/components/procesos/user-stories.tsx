import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { badgeVariants } from '@/components/ui/badge';
import { userStories } from '@/data/entregable';

export function UserStories() {
 return <Accordion type="multiple" className="user-stories">{userStories.map(story=><AccordionItem key={story.id} value={story.id}><AccordionTrigger className="user-story__trigger py-6 hover:no-underline"><span className="user-story__heading"><span className="eyebrow">{story.id} · HISTORIA DE USUARIO</span><span className="user-story__title">{story.title}</span><span className="user-story__tags"><span className={badgeVariants({ variant: 'outline' })}>Épica: {story.epic}</span><span className={badgeVariants()}>Prioridad: {story.priority}</span></span></span></AccordionTrigger><AccordionContent className="user-story__content"><p>{story.story[0]}<br/>{story.story[1]}<br/>{story.story[2]}</p><span className="eyebrow">CRITERIOS DE ACEPTACIÓN</span><ol>{story.criteria.map(criterion=><li key={criterion.dado}><b>Dado</b> {criterion.dado}, <b>cuando</b> {criterion.cuando}, <b>entonces</b> {criterion.entonces}</li>)}</ol></AccordionContent></AccordionItem>)}</Accordion>;
}
