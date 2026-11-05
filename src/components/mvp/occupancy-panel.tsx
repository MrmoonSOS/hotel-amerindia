import { useMemo } from 'react';
import { hotelFacts, rooms } from '@/data/habitaciones';
import { occupancyStats } from '@/lib/reservas/disponibilidad';
import { formatDate } from '@/lib/reservas/fechas';
import type { Reservation } from '@/lib/reservas/types';

/** HU05 — Indicadores de ocupación del día, calculados en vivo a partir de las reservas. */
export function OccupancyPanel({ reservations, today }: { reservations: Reservation[]; today: string }) {
	const stats = useMemo(() => occupancyStats(rooms, reservations, today), [reservations, today]);
	const segments = [
		{ key: 'ocupada', label: 'Ocupadas', value: stats.occupied },
		{ key: 'reservada', label: 'Reservadas hoy', value: stats.reservedToday },
		{ key: 'disponible', label: 'Disponibles', value: stats.available },
	];
	return <section className="mvp-stats" id="ocupacion" aria-labelledby="ocupacion-title">
		<div className="mvp-stats__head">
			<span className="eyebrow">HU05 / ESTADO DE OCUPACIÓN · HOY, {formatDate(today).toUpperCase()}</span>
			<h2 id="ocupacion-title">Así está el hotel hoy.</h2>
		</div>
		<dl className="mvp-stats__grid">
			<div className="mvp-stat"><dt>Total de habitaciones</dt><dd>{stats.totalRooms}</dd></div>
			<div className="mvp-stat"><dt>Disponibles</dt><dd>{stats.available}</dd></div>
			<div className="mvp-stat"><dt>Ocupadas</dt><dd>{stats.occupied}</dd></div>
			<div className="mvp-stat"><dt>Pendientes de check-in</dt><dd>{stats.pendingCheckIn}</dd><small>{stats.arrivalsToday} {stats.arrivalsToday === 1 ? 'llega' : 'llegan'} hoy</small></div>
			<div className="mvp-stat mvp-stat--hero"><dt>Ocupación</dt><dd>{stats.occupancyRate}%</dd><small>{stats.guestsInHouse} huéspedes alojados · capacidad aprox. {hotelFacts.maxCapacity}</small></div>
		</dl>
		<div className="mvp-meter" role="img" aria-label={segments.map(s => `${s.label}: ${s.value}`).join(', ')}>
			{segments.filter(s => s.value > 0).map(s => <span key={s.key} className={`mvp-meter__segment mvp-meter__segment--${s.key}`} style={{ flexGrow: s.value }} title={`${s.label}: ${s.value}`}>{s.value}</span>)}
		</div>
		<ul className="mvp-legend">{segments.map(s => <li key={s.key}><span className={`mvp-legend__swatch mvp-meter__segment--${s.key}`}/>{s.label} ({s.value})</li>)}</ul>
	</section>;
}
