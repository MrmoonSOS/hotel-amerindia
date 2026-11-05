// Reglas de negocio del MVP. Cada función indica la historia de usuario documentada (página BPMN) que respalda.

import { findConflicts } from './disponibilidad';
import { formatDate, isValidIsoDate, nightsBetween } from './fechas';
import type { FieldErrors, GuestData, Reservation, ReservationInput, Room } from './types';

export const MAX_NIGHTS = 30;

/** HU-03 (criterio 2): datos obligatorios del huésped y formato del correo. */
export function validateGuest(input: GuestData): FieldErrors {
	const errors: FieldErrors = {};
	const name = input.guestName.trim();
	const document = input.document.trim();
	const phone = input.phone.replace(/[\s-]/g, '');
	const email = input.email.trim();

	if (!name) errors.guestName = 'Escribe el nombre completo del huésped.';
	else if (name.length < 5 || !name.includes(' ')) errors.guestName = 'Escribe nombre y apellido.';
	else if (!/^[\p{L} '.()-]+$/u.test(name)) errors.guestName = 'El nombre solo puede contener letras.';

	if (!document) errors.document = 'Escribe el documento de identidad.';
	else if (!/^[A-Za-z0-9]{5,12}$/.test(document)) errors.document = 'El documento debe tener entre 5 y 12 caracteres, sin puntos ni espacios.';

	if (!phone) errors.phone = 'Escribe un teléfono de contacto.';
	else if (!/^\+?\d{7,13}$/.test(phone)) errors.phone = 'El teléfono debe tener entre 7 y 13 dígitos.';

	if (!email) errors.email = 'Escribe un correo electrónico.';
	else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'El correo no tiene un formato válido (ej. nombre@correo.com).';

	return errors;
}

/** HU-01 (criterio 2) y HU-13: fechas de llegada y salida válidas. */
export function validateStay(checkIn: string, checkOut: string, today: string): FieldErrors {
	const errors: FieldErrors = {};
	if (!checkIn) errors.checkIn = 'Selecciona la fecha de entrada.';
	else if (!isValidIsoDate(checkIn)) errors.checkIn = 'La fecha de entrada no es válida.';
	else if (checkIn < today) errors.checkIn = 'La fecha de entrada no puede estar en el pasado.';

	if (!checkOut) errors.checkOut = 'Selecciona la fecha de salida.';
	else if (!isValidIsoDate(checkOut)) errors.checkOut = 'La fecha de salida no es válida.';
	else if (checkIn && checkOut <= checkIn) errors.checkOut = 'La fecha de salida debe ser posterior a la de entrada.';
	else if (checkIn && nightsBetween(checkIn, checkOut) > MAX_NIGHTS) errors.checkOut = `La estadía máxima en línea es de ${MAX_NIGHTS} noches.`;
	return errors;
}

/** Habitaciones libres que se pueden proponer como alternativa (HU-03, criterio 3). */
function alternatives(rooms: Room[], reservations: Reservation[], checkIn: string, checkOut: string, guests: number, exclude: number): string {
	const free = rooms.filter(r => r.number !== exclude && r.capacity >= guests && findConflicts(reservations, r.number, checkIn, checkOut).length === 0).map(r => r.number);
	if (free.length === 0) return 'No quedan otras habitaciones libres en esas fechas: prueba con otras fechas o comunícate con recepción.';
	return `Habitaciones libres en esas fechas: ${free.slice(0, 6).join(', ')}${free.length > 6 ? '…' : ''}.`;
}

/** HU-03: valida la solicitud completa de reserva. Devuelve un objeto vacío si todo está bien. */
export function validateReservation(input: ReservationInput, rooms: Room[], reservations: Reservation[], today: string): FieldErrors {
	const errors: FieldErrors = { ...validateGuest(input), ...validateStay(input.checkIn, input.checkOut, today) };

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
			errors.roomNumber = `La habitación ${room.number} ya no está disponible: está reservada del ${formatDate(conflict.checkIn)} al ${formatDate(conflict.checkOut)}. ${alternatives(rooms, reservations, input.checkIn, input.checkOut, Number(input.guests) || 1, room.number)}`;
		}
	}
	return errors;
}

/** HU-13: valida el cambio de fechas de una reserva existente (sin chocar consigo misma). */
export function validateDateChange(reservation: Reservation, checkIn: string, checkOut: string, reservations: Reservation[], today: string): FieldErrors {
	const blocker = dateChangeBlocker(reservation, today);
	if (blocker) return { checkIn: blocker };
	const errors = validateStay(checkIn, checkOut, today);
	if (Object.keys(errors).length > 0) return errors;
	if (checkIn === reservation.checkIn && checkOut === reservation.checkOut) return { checkOut: 'Las fechas nuevas son iguales a las actuales.' };
	const [conflict] = findConflicts(reservations, reservation.roomNumber, checkIn, checkOut, reservation.code);
	if (conflict) return { checkOut: `No hay disponibilidad: la habitación ${reservation.roomNumber} está reservada del ${formatDate(conflict.checkIn)} al ${formatDate(conflict.checkOut)}. Tu reserva original se mantiene; prueba otras fechas o comunícate con recepción.` };
	return {};
}

/** HU-13 (criterio 3): motivo por el que no se pueden modificar las fechas, o `null`. */
export function dateChangeBlocker(reservation: Reservation, today: string): string | null {
	if (reservation.status !== 'confirmada') return `No se pueden modificar las fechas: la reserva está ${statusText(reservation)}.`;
	if (reservation.checkIn < today) return 'No se pueden modificar las fechas: la fecha de llegada ya pasó. Comunícate con recepción.';
	return null;
}

/** HU-10: motivo por el que no se puede registrar la llegada (check-in), o `null` si se puede. */
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

/** HU-10 (criterio 2): solo se corrigen datos de reservas vigentes. */
export function editGuestBlocker(reservation: Reservation): string | null {
	return reservation.status === 'confirmada' || reservation.status === 'checkin' ? null : `La reserva está ${statusText(reservation)}; sus datos ya no se pueden modificar.`;
}

/** HU-09 (criterio 3), vista del huésped: no se cancela si ya está cancelada o la llegada ya pasó. */
export function guestCancelBlocker(reservation: Reservation, today: string): string | null {
	if (reservation.status !== 'confirmada') return `No es posible cancelar: la reserva está ${statusText(reservation)}. Comunícate con recepción.`;
	if (reservation.checkIn < today) return 'No es posible cancelar: la fecha de llegada ya pasó. Comunícate con recepción.';
	return null;
}

/** Recepción puede cancelar cualquier reserva confirmada (por ejemplo, huéspedes que no llegaron). */
export function cancelBlocker(reservation: Reservation): string | null {
	if (reservation.status === 'confirmada') return null;
	if (reservation.status === 'checkin') return 'El huésped ya hizo check-in; registra su salida en lugar de cancelar.';
	return `La reserva ya está ${statusText(reservation)}.`;
}

function statusText(reservation: Reservation): string {
	return reservation.status === 'checkin' ? 'con check-in realizado' : reservation.status;
}

/** Normaliza un texto de búsqueda (sin tildes ni mayúsculas). */
export function normalize(text: string): string {
	return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

/** HU-06 / HU-10: busca por código exacto o por documento. */
export function findByCodeOrDocument(reservations: Reservation[], query: string): Reservation[] {
	const q = normalize(query).replace(/\s/g, '');
	if (!q) return [];
	return reservations
		.filter(r => normalize(r.code) === q || normalize(r.document) === q)
		.sort((a, b) => b.checkIn.localeCompare(a.checkIn));
}
