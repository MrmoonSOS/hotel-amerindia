import { useMemo, useState } from 'react';
import { roomTypes, rooms } from '@/data/habitaciones';
import { findConflicts, roomAvailability } from '@/lib/reservas/disponibilidad';
import { addDays, formatDate } from '@/lib/reservas/fechas';
import type { Reservation, RoomAvailability } from '@/lib/reservas/types';
import type { ReservationDraft } from './reservation-dialog';
import { RoomStatusBadge } from './status-badge';

type Filter = 'todas' | 'disponible' | 'no-disponible';

/** HU01 — Habitaciones del hotel con su estado para las fechas elegidas. */
export function RoomsSection({ reservations, today, onReserve }: { reservations: Reservation[]; today: string; onReserve: (draft: ReservationDraft) => void }) {
	const [checkIn, setCheckIn] = useState(today);
	const [checkOut, setCheckOut] = useState(addDays(today, 1));
	const [guests, setGuests] = useState(1);
	const [filter, setFilter] = useState<Filter>('todas');

	const rangeValid = checkOut > checkIn;
	const cards = useMemo(() => rooms.map(room => {
		const status: RoomAvailability = rangeValid ? roomAvailability(reservations, room.number, checkIn, checkOut) : 'disponible';
		const [blocking] = rangeValid ? findConflicts(reservations, room.number, checkIn, checkOut) : [];
		return { room, status, blocking, fits: room.capacity >= guests };
	}), [reservations, checkIn, checkOut, guests, rangeValid]);

	const visible = cards.filter(c => filter === 'todas' || (filter === 'disponible' ? c.status === 'disponible' && c.fits : c.status !== 'disponible' || !c.fits));
	const availableCount = cards.filter(c => c.status === 'disponible' && c.fits).length;

	function changeCheckIn(value: string) {
		setCheckIn(value);
		if (value && checkOut <= value) setCheckOut(addDays(value, 1));
	}

	return <div className="mvp-panel">
		<div className="mvp-panel__head">
			<div><span className="eyebrow">HU01 / CONSULTAR HABITACIONES</span><h2>Habitaciones.</h2></div>
			<p>Las 21 habitaciones del hotel. Elige fechas y número de huéspedes para ver cuáles están libres; las capacidades son estimadas para esta demostración.</p>
		</div>
		<div className="mvp-toolbar">
			<label>Entrada<input type="date" value={checkIn} min={today} onChange={e => changeCheckIn(e.target.value)}/></label>
			<label>Salida<input type="date" value={checkOut} min={addDays(checkIn || today, 1)} onChange={e => setCheckOut(e.target.value)}/></label>
			<label>Huéspedes<select value={guests} onChange={e => setGuests(Number(e.target.value))}>{[1, 2, 3].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
			<label>Mostrar<select value={filter} onChange={e => setFilter(e.target.value as Filter)}><option value="todas">Todas</option><option value="disponible">Solo disponibles</option><option value="no-disponible">No disponibles</option></select></label>
		</div>
		{!rangeValid ? <p className="mvp-field-error">La fecha de salida debe ser posterior a la de entrada.</p> : <p className="form-note" role="status">{availableCount} de {rooms.length} habitaciones disponibles para {guests} {guests === 1 ? 'huésped' : 'huéspedes'} del {formatDate(checkIn)} al {formatDate(checkOut)}.</p>}
		<ul className="mvp-rooms">
			{visible.map(({ room, status, blocking, fits }) => <li key={room.number} className={`mvp-room mvp-room--${status}${fits ? '' : ' mvp-room--small'}`}>
				<div className="mvp-room__top"><span className="mvp-room__number">{String(room.number).padStart(2, '0')}</span><RoomStatusBadge status={status}/></div>
				<h3>{roomTypes[room.type].label}</h3>
				<ul className="mvp-room__facts"><li>{room.bedsLabel}</li><li>Hasta {room.capacity} {room.capacity === 1 ? 'huésped' : 'huéspedes'}</li></ul>
				{status === 'disponible' && fits && <button type="button" className="button mvp-room__cta" disabled={!rangeValid} onClick={() => onReserve({ roomNumber: room.number, checkIn, checkOut, guests })}>Reservar <span>↗</span></button>}
				{status === 'disponible' && !fits && <p className="mvp-room__note">Capacidad insuficiente para {guests} huéspedes.</p>}
				{blocking && <p className="mvp-room__note">{status === 'ocupada' ? 'Ocupada' : 'Reservada'} del {formatDate(blocking.checkIn)} al {formatDate(blocking.checkOut)}.</p>}
			</li>)}
		</ul>
		{visible.length === 0 && <p className="form-note">Ninguna habitación coincide con el filtro.</p>}
	</div>;
}
