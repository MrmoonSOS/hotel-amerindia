import type { Route } from './+types/home';
import { seo } from '@/lib/seo';
import { HotelShell } from '@/components/layout/hotel-shell';
import { Hero } from '@/components/home/hero';
import { Welcome } from '@/components/home/welcome';
import { Rooms } from '@/components/home/rooms';
import { Village } from '@/components/home/village';
import { Contact } from '@/components/home/contact';

export function meta({ matches, location }: Route.MetaArgs) {
 return seo({ matches, location }, { title: 'Hotel Amerindia · Un descanso a ritmo de pueblo', description: 'Conoce Hotel Amerindia, un acogedor hotel de pueblo. Descubre su ambiente tranquilo y prepara tu consulta de alojamiento y disponibilidad.' });
}
export default function HomePage() {
 return <HotelShell><main><Hero/><Welcome/><Rooms/><Village/><Contact/></main></HotelShell>;
}
