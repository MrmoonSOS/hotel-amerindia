import type { Route } from './+types/mvp';
import { seo } from '@/lib/seo';
import { HotelShell } from '@/components/layout/hotel-shell';
import { PageIntro } from '@/components/procesos/page-intro';
import { MvpApp } from '@/components/mvp/mvp-app';
import { useIsClient } from '@/hooks/use-reservas';

export function meta({ matches, location }: Route.MetaArgs) {
 return seo({ matches, location }, { title: 'MVP · Sistema de Reservas y Check-in · Hotel Amerindia', description: 'Demostración funcional del sistema de reservas y check-in del Hotel Amerindia: habitaciones, reservas, consulta, check-in, ocupación y gestión administrativa.' });
}
export default function MvpPage() {
 // Las reservas viven en el navegador (localStorage): el sistema se monta solo en el cliente.
 const isClient = useIsClient();
 return <HotelShell><main className="mvp">
  <PageIntro eyebrow="MVP" title={<>MVP — Sistema de Reservas y Check-in.</>}><p>Demostración funcional de cómo el Hotel Amerindia gestionaría sus 21 habitaciones: el huésped consulta y reserva; recepción registra el check-in, sigue la ocupación del día y administra las reservas. Los datos se guardan en este navegador.</p></PageIntro>
  {isClient ? <MvpApp/> : <p className="mvp-loading" role="status">Cargando el sistema de reservas…</p>}
 </main></HotelShell>;
}
