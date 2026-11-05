import type { ReservationStatus, RoomAvailability } from '@/lib/reservas/types';

export const reservationStatusLabels: Record<ReservationStatus, string> = {
	confirmada: 'Confirmada',
	checkin: 'Check-in realizado',
	finalizada: 'Finalizada',
	cancelada: 'Cancelada',
};

export const roomStatusLabels: Record<RoomAvailability, string> = {
	disponible: 'Disponible',
	reservada: 'Reservada',
	ocupada: 'Ocupada',
};

const reservationIcons: Record<ReservationStatus, string> = { confirmada: '●', checkin: '✓', finalizada: '■', cancelada: '✕' };
const roomIcons: Record<RoomAvailability, string> = { disponible: '○', reservada: '◐', ocupada: '●' };

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
	return <span className={`mvp-badge mvp-badge--${status}`}><span aria-hidden="true">{reservationIcons[status]}</span>{reservationStatusLabels[status]}</span>;
}

export function RoomStatusBadge({ status }: { status: RoomAvailability }) {
	return <span className={`mvp-badge mvp-badge--room-${status}`}><span aria-hidden="true">{roomIcons[status]}</span>{roomStatusLabels[status]}</span>;
}
