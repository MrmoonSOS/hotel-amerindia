import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { useReservations, useToday } from '@/hooks/use-reservas';
import { reservationStore } from '@/lib/reservas/store';
import { AdminPanel } from './admin-panel';
import { CheckInDesk } from './check-in-desk';
import { ConfirmDialog } from './confirm-dialog';
import { Feedback } from './feedback';
import { OccupancyPanel } from './occupancy-panel';
import { ReservationDialog, type ReservationDraft } from './reservation-dialog';
import { ReservationLookup } from './reservation-lookup';
import { RoomsSection } from './rooms-section';

const tabs = [
	{ value: 'habitaciones', label: 'Habitaciones', hu: 'HU01 · HU02' },
	{ value: 'consulta', label: 'Consultar reserva', hu: 'HU03' },
	{ value: 'checkin', label: 'Check-in', hu: 'HU04' },
	{ value: 'admin', label: 'Panel administrativo', hu: 'HU06' },
] as const;
type TabValue = (typeof tabs)[number]['value'];

/** MVP del sistema de reservas y check-in. Todas las secciones comparten la misma fuente de datos. */
export function MvpApp() {
	const reservations = useReservations();
	const today = useToday();
	const [tab, setTab] = useState<TabValue>('habitaciones');
	const [dialogOpen, setDialogOpen] = useState(false);
	const [draft, setDraft] = useState<ReservationDraft>({});
	const [lookupQuery, setLookupQuery] = useState('');
	const [resetOpen, setResetOpen] = useState(false);
	const [resetDone, setResetDone] = useState(false);

	function openReservation(next: ReservationDraft = {}) {
		setDraft(next);
		setDialogOpen(true);
	}

	function viewReservation(code: string) {
		setDialogOpen(false);
		setLookupQuery(code);
		setTab('consulta');
		document.getElementById('mvp-modulos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	return <>
		<div className="mvp-intro-actions">
			<button type="button" className="button" onClick={() => openReservation()}>Reservar habitación <span>↗</span></button>
			<button type="button" className="mvp-link-button" onClick={() => setResetOpen(true)}>Restablecer datos de demostración</button>
		</div>
		{resetDone && <div className="mvp-intro-feedback"><Feedback tone="success" title="Datos de demostración restablecidos."/></div>}

		<OccupancyPanel reservations={reservations} today={today}/>

		<Tabs.Root value={tab} onValueChange={value => setTab(value as TabValue)} className="mvp-modules" id="mvp-modulos">
			<Tabs.List className="mvp-tabs" aria-label="Módulos del sistema">
				{tabs.map(t => <Tabs.Trigger key={t.value} value={t.value} className="mvp-tabs__trigger"><small>{t.hu}</small>{t.label}</Tabs.Trigger>)}
			</Tabs.List>
			<Tabs.Content value="habitaciones"><RoomsSection reservations={reservations} today={today} onReserve={openReservation}/></Tabs.Content>
			<Tabs.Content value="consulta"><ReservationLookup reservations={reservations} initialQuery={lookupQuery}/></Tabs.Content>
			<Tabs.Content value="checkin"><CheckInDesk reservations={reservations} today={today}/></Tabs.Content>
			<Tabs.Content value="admin"><AdminPanel reservations={reservations}/></Tabs.Content>
		</Tabs.Root>

		<ReservationDialog open={dialogOpen} draft={draft} reservations={reservations} today={today} onOpenChange={setDialogOpen} onViewReservation={viewReservation}/>
		<ConfirmDialog
			open={resetOpen}
			onOpenChange={setResetOpen}
			title="¿Restablecer los datos de demostración?"
			description={<p>Se borrarán las reservas creadas, los check-in y las cancelaciones hechas en este navegador, y se cargarán de nuevo las reservas de ejemplo.</p>}
			confirmLabel="Sí, restablecer"
			onConfirm={() => { reservationStore.reset(); setLookupQuery(''); setResetDone(true); window.setTimeout(() => setResetDone(false), 4000); }}
		/>
	</>;
}
