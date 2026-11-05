// Fuente única de datos del MVP. Todas las secciones (habitaciones, consulta, check-in,
// indicadores y panel administrativo) leen y escriben aquí, y los cambios se guardan en localStorage.

import { rooms } from '@/data/habitaciones';
import { createDemoReservations } from '@/data/reservas-demo';
import { findConflicts } from './disponibilidad';
import { todayIso } from './fechas';
import { cancelBlocker, checkInBlocker, validateReservation } from './validacion';
import type { FieldErrors, Reservation, ReservationInput } from './types';

export const STORAGE_KEY = 'hotel-amerindia:mvp:reservas:v1';

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

let reservations: Reservation[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function isReservation(value: unknown): value is Reservation {
	if (!value || typeof value !== 'object') return false;
	const r = value as Record<string, unknown>;
	return typeof r.code === 'string' && typeof r.guestName === 'string' && typeof r.document === 'string' && typeof r.roomNumber === 'number' && typeof r.checkIn === 'string' && typeof r.checkOut === 'string' && typeof r.status === 'string';
}

function readStorage(): Reservation[] | null {
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed: unknown = JSON.parse(raw);
		return Array.isArray(parsed) && parsed.every(isReservation) ? parsed : null;
	} catch {
		return null;
	}
}

function persist() {
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
	} catch {
		// Modo privado o almacenamiento lleno: la demo sigue funcionando en memoria.
	}
}

function emit() {
	for (const listener of listeners) listener();
}

function commit(next: Reservation[]) {
	reservations = next;
	persist();
	emit();
}

function ensureLoaded() {
	if (loaded || typeof window === 'undefined') return;
	loaded = true;
	const stored = readStorage();
	if (stored) reservations = stored;
	else {
		reservations = createDemoReservations(todayIso());
		persist();
	}
	// Sincroniza si la demo está abierta en otra pestaña.
	window.addEventListener('storage', event => {
		if (event.key !== STORAGE_KEY) return;
		reservations = readStorage() ?? createDemoReservations(todayIso());
		emit();
	});
}

const EMPTY: Reservation[] = [];

export const reservationStore = {
	subscribe(listener: () => void) {
		ensureLoaded();
		listeners.add(listener);
		return () => listeners.delete(listener);
	},
	getSnapshot(): Reservation[] {
		ensureLoaded();
		return reservations;
	},
	getServerSnapshot(): Reservation[] {
		return EMPTY;
	},

	/** HU02: crea una reserva confirmada con código único si pasa todas las validaciones. */
	create(input: ReservationInput): { ok: true; reservation: Reservation } | { ok: false; errors: FieldErrors } {
		const today = todayIso();
		const errors = validateReservation(input, rooms, reservations, today);
		if (Object.keys(errors).length > 0) return { ok: false, errors };
		const reservation: Reservation = {
			code: generateCode(new Set(reservations.map(r => r.code))),
			guestName: input.guestName.trim().replace(/\s+/g, ' '),
			document: input.document.trim().toUpperCase(),
			phone: input.phone.replace(/[\s-]/g, ''),
			roomNumber: Number(input.roomNumber),
			checkIn: input.checkIn,
			checkOut: input.checkOut,
			guests: Number(input.guests),
			status: 'confirmada',
			createdAt: new Date().toISOString(),
		};
		commit([reservation, ...reservations]);
		return { ok: true, reservation };
	},

	/** HU04: registra la llegada del huésped. */
	checkIn(code: string): Result<Reservation> {
		const current = reservations.find(r => r.code === code);
		if (!current) return { ok: false, error: 'No se encontró la reserva.' };
		const blocker = checkInBlocker(current, todayIso());
		if (blocker) return { ok: false, error: blocker };
		// Protección extra: no permitir dos huéspedes alojados en la misma habitación.
		const clash = findConflicts(reservations, current.roomNumber, current.checkIn, current.checkOut, current.code).find(r => r.status === 'checkin');
		if (clash) return { ok: false, error: `La habitación ${current.roomNumber} todavía está ocupada por ${clash.guestName}.` };
		return update(code, { status: 'checkin', checkedInAt: new Date().toISOString() });
	},

	/** HU06: registra la salida del huésped (la reserva pasa a finalizada y libera la habitación). */
	checkOut(code: string): Result<Reservation> {
		const current = reservations.find(r => r.code === code);
		if (!current) return { ok: false, error: 'No se encontró la reserva.' };
		if (current.status !== 'checkin') return { ok: false, error: 'Solo se puede registrar la salida de huéspedes con check-in.' };
		const today = todayIso();
		// Si sale antes de lo previsto, la habitación queda libre desde hoy.
		const checkOut = today < current.checkOut && today > current.checkIn ? today : current.checkOut;
		return update(code, { status: 'finalizada', checkOut, checkedOutAt: new Date().toISOString() });
	},

	/** HU06: cancela una reserva confirmada y libera sus fechas. */
	cancel(code: string): Result<Reservation> {
		const current = reservations.find(r => r.code === code);
		if (!current) return { ok: false, error: 'No se encontró la reserva.' };
		const blocker = cancelBlocker(current);
		if (blocker) return { ok: false, error: blocker };
		return update(code, { status: 'cancelada', cancelledAt: new Date().toISOString() });
	},

	/** Vuelve a cargar los datos de demostración. */
	reset() {
		commit(createDemoReservations(todayIso()));
	},
};

function update(code: string, patch: Partial<Reservation>): Result<Reservation> {
	let updated: Reservation | undefined;
	commit(reservations.map(r => (r.code === code ? (updated = { ...r, ...patch }) : r)));
	return updated ? { ok: true, value: updated } : { ok: false, error: 'No se encontró la reserva.' };
}

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin 0/O ni 1/I para evitar confusiones al dictarlo

function generateCode(existing: Set<string>): string {
	const bytes = new Uint8Array(6);
	for (;;) {
		crypto.getRandomValues(bytes);
		const code = `AMR-${Array.from(bytes, b => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('')}`;
		if (!existing.has(code)) return code;
	}
}
