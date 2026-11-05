import { findConflicts } from './disponibilidad';
import { formatDate, isValidIsoDate, nightsBetween } from './fechas';
import type { FieldErrors, Reservation, ReservationInput, Room } from './types';

export const MAX_NIGHTS = 30;

/** Valida el formulario de reserva (HU02). Devuelve un objeto vacío si todo está bien. */
export function validateReservation(input: ReservationInput, rooms: Room[], reservations: Reservation[], today: string): FieldErrors {
	const errors: FieldErrors = {};
	const name = input.guestName.trim();
	const document = input.document.trim();
	const phone = input.phone.replace(/[\s-]/g, '');

	if (!name) errors.guestName = 'Escribe el nombre completo del huésped.';
	else if (name.length < 5 || !name.includes(' ')) errors.guestName = 'Escribe nombre y apellido.';
	else if (!/^[\p{L} '.-]+$/u.test(name)) errors.guestName = 'El nombre solo puede contener letras.';

	if (!document) errors.document = 'Escribe el documento de identidad.';
	else if (!/^[A-Za-z0-9]{5,12}$/.test(document)) errors.document = 'El documento debe tener entre 5 y 12 caracteres, sin puntos ni espacios.';

	if (!phone) errors.phone = 'Escribe un teléfono de contacto.';
	else if (!/^\+?\d{7,13}$/.test(phone)) errors.phone = 'El teléfono debe tener entre 7 y 13 dígitos.';

	if (!input.checkIn) errors.checkIn = 'Selecciona la fecha de entrada.';
	else if (!isValidIsoDate(input.checkIn)) errors.checkIn = 'La fecha de entrada no es válida.';
	else if (input.checkIn < today) errors.checkIn = 'La fecha de entrada no puede estar en el pasado.';

	if (!input.checkOut) errors.checkOut = 'Selecciona la fecha de salida.';
	else if (!isValidIsoDate(input.checkOut)) errors.checkOut = 'La fecha de salida no es válida.';
	else if (input.checkIn && input.checkOut <= input.checkIn) errors.checkOut = 'La fecha de salida debe ser posterior a la de entrada.';
	else if (input.checkIn && nightsBetween(input.checkIn, input.checkOut) > MAX_NIGHTS) errors.checkOut = `La estadía máxima en línea es de ${MAX_NIGHTS} noches.`;

	if (input.guests === '' || !Number.isInteger(input.guests)) errors.guests = 'Indica la cantidad de huéspedes.';
	else if (input.guests < 1) errors.guests = 'Debe haber al menos 1 huésped.';

	if (input.roomNumber === '') {
		errors.roomNumber = 'Selecciona una habitación.';
		return errors;
	}
	const room = rooms.find(r => r.number === input.roomNumber);
	if (!room) {
		errors.roomNumber = 'La habitación seleccionada no existe.';
		return errors;
	}
	if (!errors.guests && typeof input.guests === 'number' && input.guests > room.capacity) {
		errors.guests = `La habitación ${room.number} admite máximo ${room.capacity} ${room.capacity === 1 ? 'huésped' : 'huéspedes'}.`;
	}
	if (!errors.checkIn && !errors.checkOut) {
		const [conflict] = findConflicts(reservations, room.number, input.checkIn, input.checkOut);
		if (conflict) {
			errors.roomNumber = `La habitación ${room.number} ya está reservada del ${formatDate(conflict.checkIn)} al ${formatDate(conflict.checkOut)}. Elige otra habitación u otras fechas.`;
		}
	}
	return errors;
}

/** Motivo por el que no se puede hacer check-in (HU04), o `null` si se puede. */
export function checkInBlocker(reservation: Reservation, today: string): string | null {
	switch (reservation.status) {
		case 'checkin': return 'Esta reserva ya tiene el check-in registrado.';
		case 'finalizada': return 'No se puede hacer check-in: la reserva está finalizada.';
		case 'cancelada': return 'No se puede hacer check-in: la reserva fue cancelada.';
	}
	if (today < reservation.checkIn) return `El check-in está disponible a partir del ${formatDate(reservation.checkIn)}.`;
	if (today >= reservation.checkOut) return 'La fecha de salida de esta reserva ya pasó; no se puede registrar el check-in.';
	return null;
}

/** Motivo por el que no se puede cancelar (HU06), o `null` si se puede. */
export function cancelBlocker(reservation: Reservation): string | null {
	if (reservation.status === 'confirmada') return null;
	if (reservation.status === 'checkin') return 'El huésped ya hizo check-in; registra su salida en lugar de cancelar.';
	return `La reserva ya está ${reservation.status}.`;
}

/** Normaliza un texto de búsqueda (sin tildes ni mayúsculas). */
export function normalize(text: string): string {
	return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

/** Busca por código exacto o por documento (HU03 / HU04). */
export function findByCodeOrDocument(reservations: Reservation[], query: string): Reservation[] {
	const q = normalize(query).replace(/\s/g, '');
	if (!q) return [];
	return reservations
		.filter(r => normalize(r.code) === q || normalize(r.document) === q)
		.sort((a, b) => b.checkIn.localeCompare(a.checkIn));
}
