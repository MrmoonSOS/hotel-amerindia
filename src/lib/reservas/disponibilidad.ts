import type { Reservation, ReservationStatus, Room, RoomAvailability } from './types';

/** Estados que bloquean la habitación en sus fechas. */
export const BLOCKING_STATUSES: ReservationStatus[] = ['confirmada', 'checkin'];

export function isBlocking(reservation: Reservation): boolean {
	return BLOCKING_STATUSES.includes(reservation.status);
}

/**
 * Dos estadías se cruzan si una empieza antes de que termine la otra.
 * El día de salida queda libre: se puede entrar el mismo día que otro huésped sale.
 */
export function rangesOverlap(aIn: string, aOut: string, bIn: string, bOut: string): boolean {
	return aIn < bOut && bIn < aOut;
}

/** Reservas activas de una habitación que chocan con el rango indicado. */
export function findConflicts(reservations: Reservation[], roomNumber: number, checkIn: string, checkOut: string, ignoreCode?: string): Reservation[] {
	return reservations.filter(r => r.roomNumber === roomNumber && r.code !== ignoreCode && isBlocking(r) && rangesOverlap(checkIn, checkOut, r.checkIn, r.checkOut));
}

/** Estado de la habitación en un rango: ocupada (huésped alojado), reservada (reserva confirmada) o disponible. */
export function roomAvailability(reservations: Reservation[], roomNumber: number, checkIn: string, checkOut: string): RoomAvailability {
	const conflicts = findConflicts(reservations, roomNumber, checkIn, checkOut);
	if (conflicts.some(r => r.status === 'checkin')) return 'ocupada';
	if (conflicts.length > 0) return 'reservada';
	return 'disponible';
}

export function availableRooms(rooms: Room[], reservations: Reservation[], checkIn: string, checkOut: string, guests = 1): Room[] {
	return rooms.filter(room => room.capacity >= guests && findConflicts(reservations, room.number, checkIn, checkOut).length === 0);
}

export type OccupancyStats = {
	totalRooms: number;
	occupied: number;
	reservedToday: number;
	available: number;
	pendingCheckIn: number;
	arrivalsToday: number;
	occupancyRate: number;
	guestsInHouse: number;
	totalCapacity: number;
};

/** Indicadores de ocupación para un día concreto (por defecto, hoy). */
export function occupancyStats(rooms: Room[], reservations: Reservation[], day: string): OccupancyStats {
	// La reserva cubre la noche de `day` si empieza ese día o antes y termina después.
	const tonight = (r: Reservation) => isBlocking(r) && r.checkIn <= day && day < r.checkOut;
	const inHouse = reservations.filter(r => r.status === 'checkin' && tonight(r));
	const occupiedRooms = new Set(inHouse.map(r => r.roomNumber));
	const reservedRooms = new Set(reservations.filter(r => r.status === 'confirmada' && tonight(r) && !occupiedRooms.has(r.roomNumber)).map(r => r.roomNumber));
	const totalRooms = rooms.length;
	return {
		totalRooms,
		occupied: occupiedRooms.size,
		reservedToday: reservedRooms.size,
		available: totalRooms - occupiedRooms.size - reservedRooms.size,
		pendingCheckIn: reservations.filter(r => r.status === 'confirmada').length,
		arrivalsToday: reservations.filter(r => r.status === 'confirmada' && r.checkIn === day).length,
		occupancyRate: totalRooms ? Math.round((occupiedRooms.size / totalRooms) * 100) : 0,
		guestsInHouse: inHouse.reduce((sum, r) => sum + r.guests, 0),
		totalCapacity: rooms.reduce((sum, room) => sum + room.capacity, 0),
	};
}
