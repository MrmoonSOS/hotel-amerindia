import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { formatDate } from '@/lib/reservas/fechas';
import { reservationStore } from '@/lib/reservas/store';
import { cancelBlocker, normalize } from '@/lib/reservas/validacion';
import type { Reservation, ReservationStatus } from '@/lib/reservas/types';
import { ConfirmDialog } from './confirm-dialog';
import { Feedback } from './feedback';
import { ReservationDetails } from './reservation-details';
import { ReservationStatusBadge, reservationStatusLabels } from './status-badge';

type StatusFilter = 'todas' | ReservationStatus;
type PendingAction = { kind: 'cancel' | 'checkout'; reservation: Reservation };

const statusOrder: ReservationStatus[] = ['confirmada', 'checkin', 'finalizada', 'cancelada'];

/** HU06 — Panel administrativo: ver, buscar, filtrar y gestionar reservas. */
export function AdminPanel({ reservations }: { reservations: Reservation[] }) {
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState<StatusFilter>('todas');
	const [detailsCode, setDetailsCode] = useState<string | null>(null);
	const [pending, setPending] = useState<PendingAction | null>(null);
	const [confirmOpen, setConfirmOpen] = useState(false);
	// La acción se conserva mientras el diálogo se cierra, para que el texto no cambie durante la animación.
	const ask = (action: PendingAction) => { setPending(action); setConfirmOpen(true); };
	const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);

	const counts = useMemo(() => Object.fromEntries(statusOrder.map(s => [s, reservations.filter(r => r.status === s).length])) as Record<ReservationStatus, number>, [reservations]);
	const rows = useMemo(() => {
		const q = normalize(search);
		return reservations
			.filter(r => status === 'todas' || r.status === status)
			.filter(r => !q || normalize(r.guestName).includes(q) || normalize(r.document).includes(q) || normalize(r.code).includes(q))
			.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	}, [reservations, search, status]);
	const details = reservations.find(r => r.code === detailsCode) ?? null;

	function run(action: PendingAction) {
		const result = action.kind === 'cancel' ? reservationStore.cancel(action.reservation.code) : reservationStore.checkOut(action.reservation.code);
		setMessage(result.ok
			? { tone: 'success', text: action.kind === 'cancel' ? `Reserva ${result.value.code} cancelada. La habitación ${result.value.roomNumber} quedó libre en esas fechas.` : `Salida registrada para ${result.value.guestName}. La habitación ${result.value.roomNumber} quedó disponible.` }
			: { tone: 'error', text: result.error });
	}

	const actionsFor = (r: Reservation) => <div className="mvp-row-actions">
		<button type="button" className="mvp-link-button" onClick={() => setDetailsCode(r.code)}>Detalles</button>
		{!cancelBlocker(r) && <button type="button" className="mvp-link-button mvp-link-button--danger" onClick={() => ask({ kind: 'cancel', reservation: r })}>Cancelar</button>}
		{r.status === 'checkin' && <button type="button" className="mvp-link-button" onClick={() => ask({ kind: 'checkout', reservation: r })}>Registrar salida</button>}
	</div>;

	return <div className="mvp-panel">
		<div className="mvp-panel__head">
			<div><span className="eyebrow">HU06 / PANEL ADMINISTRATIVO</span><h2>Gestión de reservas.</h2></div>
			<p>Vista del personal del hotel. Al cancelar una reserva o registrar una salida, la disponibilidad y los indicadores se actualizan automáticamente.</p>
		</div>
		<div className="mvp-toolbar mvp-toolbar--admin">
			<label>Buscar<input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Nombre, documento o código"/></label>
			<div className="mvp-chips" role="group" aria-label="Filtrar por estado">
				<button type="button" aria-pressed={status === 'todas'} onClick={() => setStatus('todas')}>Todas ({reservations.length})</button>
				{statusOrder.map(s => <button key={s} type="button" aria-pressed={status === s} onClick={() => setStatus(s)}>{reservationStatusLabels[s]} ({counts[s]})</button>)}
			</div>
		</div>
		{message && <Feedback tone={message.tone} title={message.text}/>}
		<p className="form-note" role="status">{rows.length} {rows.length === 1 ? 'reserva' : 'reservas'}{status !== 'todas' ? ` con estado «${reservationStatusLabels[status]}»` : ''}{search ? ` que coinciden con «${search}»` : ''}.</p>
		<div className="mvp-table-wrap">
			<table className="mvp-table">
				<thead><tr><th>Código</th><th>Huésped</th><th>Hab.</th><th>Entrada</th><th>Salida</th><th>Pers.</th><th>Estado</th><th><span className="sr-only">Acciones</span></th></tr></thead>
				<tbody>{rows.map(r => <tr key={r.code}>
					<td data-label="Código"><code>{r.code}</code></td>
					<td data-label="Huésped"><span>{r.guestName}<small>{r.document}</small></span></td>
					<td data-label="Habitación">{r.roomNumber}</td>
					<td data-label="Entrada">{formatDate(r.checkIn)}</td>
					<td data-label="Salida">{formatDate(r.checkOut)}</td>
					<td data-label="Huéspedes">{r.guests}</td>
					<td data-label="Estado"><ReservationStatusBadge status={r.status}/></td>
					<td>{actionsFor(r)}</td>
				</tr>)}</tbody>
			</table>
			{rows.length === 0 && <p className="mvp-empty">No hay reservas que coincidan con la búsqueda.</p>}
		</div>

		<Dialog open={Boolean(details)} onOpenChange={open => !open && setDetailsCode(null)}>
			<DialogContent className="mvp-dialog">
				<DialogTitle className="mvp-dialog__title">Detalle de la reserva.</DialogTitle>
				{details && <ReservationDetails reservation={details}>{actionsFor(details)}</ReservationDetails>}
			</DialogContent>
		</Dialog>
		<ConfirmDialog
			open={confirmOpen}
			onOpenChange={setConfirmOpen}
			title={pending?.kind === 'cancel' ? '¿Cancelar esta reserva?' : '¿Registrar la salida del huésped?'}
			description={pending && <p>{pending.reservation.code} · {pending.reservation.guestName} · Habitación {pending.reservation.roomNumber} · {formatDate(pending.reservation.checkIn)} → {formatDate(pending.reservation.checkOut)}.{pending.kind === 'cancel' ? ' La habitación quedará libre en esas fechas. Esta acción no se puede deshacer.' : ' La reserva pasará a «Finalizada» y la habitación quedará disponible.'}</p>}
			confirmLabel={pending?.kind === 'cancel' ? 'Sí, cancelar reserva' : 'Sí, registrar salida'}
			onConfirm={() => { if (pending) { run(pending); setDetailsCode(null); } }}
		/>
	</div>;
}
