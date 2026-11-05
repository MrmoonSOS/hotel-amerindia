import { useMemo, useState } from 'react';
import { formatDate, formatDateTime } from '@/lib/reservas/fechas';
import { reservationStore } from '@/lib/reservas/store';
import { checkInBlocker, findByCodeOrDocument } from '@/lib/reservas/validacion';
import type { Reservation } from '@/lib/reservas/types';
import { Feedback } from './feedback';
import { ReservationDetails } from './reservation-details';
import { ReservationSearch } from './reservation-search';

type Message = { tone: 'success' | 'error'; title: string; body?: string };

/** HU04 — Registrar la llegada del huésped desde recepción. */
export function CheckInDesk({ reservations, today }: { reservations: Reservation[]; today: string }) {
	const [query, setQuery] = useState('');
	const [message, setMessage] = useState<Message | null>(null);
	const results = useMemo(() => findByCodeOrDocument(reservations, query), [reservations, query]);
	const arrivals = useMemo(() => reservations.filter(r => r.status === 'confirmada' && r.checkIn <= today && today < r.checkOut), [reservations, today]);

	function search(value: string) {
		setQuery(value);
		setMessage(null);
	}

	function register(code: string) {
		const result = reservationStore.checkIn(code);
		setMessage(result.ok
			? { tone: 'success', title: `Check-in exitoso: ${result.value.guestName}`, body: `Habitación ${result.value.roomNumber} entregada el ${formatDateTime(result.value.checkedInAt!)}. Salida prevista: ${formatDate(result.value.checkOut)}.` }
			: { tone: 'error', title: 'No se pudo registrar el check-in.', body: result.error });
	}

	return <div className="mvp-panel">
		<div className="mvp-panel__head">
			<div><span className="eyebrow">HU04 / CHECK-IN</span><h2>Check-in en recepción.</h2></div>
			<p>Busca la reserva, verifica los datos con el documento del huésped y registra su llegada. El estado y los indicadores se actualizan al instante.</p>
		</div>
		<ReservationSearch id="checkin-busqueda" onSearch={search}/>
		{message && <Feedback tone={message.tone} title={message.title}>{message.body}</Feedback>}
		{query.trim() && results.length === 0 && <Feedback tone="error" title="No hay ninguna reserva con ese código o documento.">Verifica el dato o registra una nueva reserva desde «Habitaciones».</Feedback>}
		<div className="mvp-results">{results.map(r => {
			const blocker = checkInBlocker(r, today);
			return <ReservationDetails key={r.code} reservation={r}>
				<div className="mvp-ticket__actions">
					{blocker ? <p className="mvp-ticket__blocked">{blocker}</p> : <p className="mvp-ticket__ready">Reserva confirmada y vigente: lista para check-in.</p>}
					<button type="button" className="button" disabled={Boolean(blocker)} onClick={() => register(r.code)}>Registrar check-in <span>↗</span></button>
				</div>
			</ReservationDetails>;
		})}</div>
		{!query.trim() && <div className="mvp-arrivals">
			<span className="eyebrow">LLEGADAS PENDIENTES HOY ({arrivals.length})</span>
			{arrivals.length === 0 ? <p className="form-note">No hay huéspedes pendientes de check-in para hoy.</p> : <ul>{arrivals.map(r => <li key={r.code}><button type="button" className="mvp-link-button" onClick={() => search(r.code)}>{r.code}</button> · {r.guestName} · Hab. {r.roomNumber}</li>)}</ul>}
		</div>}
	</div>;
}
