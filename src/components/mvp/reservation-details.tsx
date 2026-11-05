import { rooms } from '@/data/habitaciones';
import { formatDate, formatDateTime, nightsBetween } from '@/lib/reservas/fechas';
import type { Reservation } from '@/lib/reservas/types';
import { ReservationStatusBadge } from './status-badge';

/** Ficha con todos los datos de una reserva (se reutiliza en consulta, check-in y panel administrativo). */
export function ReservationDetails({ reservation, children }: { reservation: Reservation; children?: React.ReactNode }) {
	const room = rooms.find(r => r.number === reservation.roomNumber);
	const nights = nightsBetween(reservation.checkIn, reservation.checkOut);
	return <article className="mvp-ticket">
		<header className="mvp-ticket__head">
			<div><span className="eyebrow">CÓDIGO DE RESERVA</span><p className="mvp-ticket__code">{reservation.code}</p></div>
			<ReservationStatusBadge status={reservation.status}/>
		</header>
		<dl className="mvp-ticket__grid">
			<div><dt>Huésped</dt><dd>{reservation.guestName}</dd></div>
			<div><dt>Documento</dt><dd>{reservation.document}</dd></div>
			<div><dt>Teléfono</dt><dd>{reservation.phone}</dd></div>
			<div><dt>Habitación</dt><dd>N.º {reservation.roomNumber}{room && <small> · {room.bedsLabel}</small>}</dd></div>
			<div><dt>Entrada</dt><dd>{formatDate(reservation.checkIn)}</dd></div>
			<div><dt>Salida</dt><dd>{formatDate(reservation.checkOut)}</dd></div>
			<div><dt>Noches</dt><dd>{nights}</dd></div>
			<div><dt>Huéspedes</dt><dd>{reservation.guests}</dd></div>
		</dl>
		<ul className="mvp-ticket__log">
			<li>Registrada: {formatDateTime(reservation.createdAt)}</li>
			{reservation.checkedInAt && <li>Check-in: {formatDateTime(reservation.checkedInAt)}</li>}
			{reservation.checkedOutAt && <li>Salida registrada: {formatDateTime(reservation.checkedOutAt)}</li>}
			{reservation.cancelledAt && <li>Cancelada: {formatDateTime(reservation.cancelledAt)}</li>}
		</ul>
		{children}
	</article>;
}
