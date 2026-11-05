// Utilidades de fechas. Se trabaja con fechas locales (no UTC) para evitar
// que en Colombia la fecha "salte" al día siguiente después de las 7 p. m.

export function toIsoDate(date: Date): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
}

export function todayIso(): string {
	return toIsoDate(new Date());
}

export function addDays(iso: string, days: number): string {
	const [y, m, d] = iso.split('-').map(Number);
	return toIsoDate(new Date(y, m - 1, d + days));
}

export function isValidIsoDate(value: string): boolean {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
	const [y, m, d] = value.split('-').map(Number);
	const date = new Date(y, m - 1, d);
	return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export function nightsBetween(checkIn: string, checkOut: string): number {
	const [y1, m1, d1] = checkIn.split('-').map(Number);
	const [y2, m2, d2] = checkOut.split('-').map(Number);
	return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000);
}

const dateFormatter = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
const dateTimeFormatter = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

export function formatDate(iso: string): string {
	const [y, m, d] = iso.split('-').map(Number);
	return dateFormatter.format(new Date(y, m - 1, d));
}

export function formatDateTime(isoDateTime: string): string {
	return dateTimeFormatter.format(new Date(isoDateTime));
}
