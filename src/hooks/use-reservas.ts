import { useEffect, useState, useSyncExternalStore } from 'react';
import { reservationStore } from '@/lib/reservas/store';
import { todayIso } from '@/lib/reservas/fechas';

/** Reservas compartidas por todo el MVP (se actualizan en todas las secciones a la vez). */
export function useReservations() {
	return useSyncExternalStore(reservationStore.subscribe, reservationStore.getSnapshot, reservationStore.getServerSnapshot);
}

/** `true` una vez que el componente se montó en el navegador (localStorage disponible). */
export function useIsClient() {
	const [isClient, setIsClient] = useState(false);
	useEffect(() => setIsClient(true), []);
	return isClient;
}

/** Fecha de hoy; se recalcula si la página queda abierta al cambiar de día. */
export function useToday() {
	const [today, setToday] = useState(todayIso);
	useEffect(() => {
		const id = window.setInterval(() => setToday(todayIso()), 60_000);
		return () => window.clearInterval(id);
	}, []);
	return today;
}
