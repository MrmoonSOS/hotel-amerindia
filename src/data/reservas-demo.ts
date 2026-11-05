import { addDays } from '@/lib/reservas/fechas';
import type { Reservation, ReservationStatus } from '@/lib/reservas/types';

// Reservas ficticias para que el MVP no aparezca vacío durante la exposición.
// Las fechas se calculan a partir del día en que se cargan los datos, así la demo siempre luce "en curso".
// Ocupación inicial ≈ 11 habitaciones y 18 huéspedes (similar al promedio diario real del hotel).

type Seed = [code: string, guestName: string, document: string, phone: string, room: number, from: number, to: number, guests: number, status: ReservationStatus];

const seeds: Seed[] = [
	// Huéspedes alojados (check-in realizado)
	['AMR-7K2Q9D', 'Luisa Fernanda Restrepo', '1036654321', '3104567812', 1, -2, 2, 2, 'checkin'],
	['AMR-3H8M1P', 'Carlos Andrés Úsuga', '71234567', '3127788990', 2, -1, 1, 1, 'checkin'],
	['AMR-9T4W6B', 'Marta Lucía Higuita', '43567890', '3001234567', 3, -1, 3, 2, 'checkin'],
	['AMR-5N2C7R', 'Jhon Fredy Durango', '1040123987', '3158765432', 5, -3, 1, 1, 'checkin'],
	['AMR-2F6J8L', 'Paula Andrea Tuberquia', '1017234561', '3205550123', 7, 0, 2, 2, 'checkin'],
	['AMR-8V1X3G', 'Hernán Darío Graciano', '98765432', '3116549870', 9, -1, 2, 1, 'checkin'],
	['AMR-4D9S2K', 'Diana Marcela Borja', '1128456789', '3014447788', 10, -2, 1, 2, 'checkin'],
	['AMR-6P3Z5Y', 'Óscar Iván Manco', '15432876', '3186660011', 12, 0, 3, 1, 'checkin'],
	['AMR-1R7H4T', 'Familia Cardona Pino', '70543219', '3142223344', 17, -1, 2, 3, 'checkin'],
	['AMR-2L5B9W', 'Yeison Alexis David', '1045789123', '3227771122', 18, -2, 1, 1, 'checkin'],
	['AMR-9C6F1N', 'Sandra Milena Oquendo', '32456781', '3009998877', 14, -1, 1, 2, 'checkin'],
	// Llegan hoy: pendientes de check-in
	['AMR-3Q8D2M', 'Alejandro Rivera Gómez', '1020304050', '3135556677', 4, 0, 2, 2, 'confirmada'],
	['AMR-7B4N6H', 'Natalia Correa Sepúlveda', '1152678903', '3046781234', 19, 0, 3, 2, 'confirmada'],
	// Reservas futuras confirmadas
	['AMR-5G2T8V', 'Julián Esteban Quiroz', '1001987654', '3191234560', 6, 2, 4, 2, 'confirmada'],
	['AMR-8W3K5C', 'Empresa Vías del Atrato (Ing. Ramírez)', '80123456', '3167894561', 20, 5, 8, 2, 'confirmada'],
	['AMR-4M9R1X', 'Camila Andrea Vélez', '1036998877', '3125674321', 1, 3, 5, 2, 'confirmada'],
	['AMR-6J1P7S', 'Grupo Ciclistas Dabeiba', '1037112233', '3178889900', 17, 10, 12, 3, 'confirmada'],
	// Historial
	['AMR-2X7L4Q', 'Gloria Inés Arango', '21987654', '3112345678', 8, -4, -1, 2, 'finalizada'],
	['AMR-9H5D3Z', 'Mauricio Lopera Ruiz', '71876543', '3209876543', 11, -3, 0, 1, 'finalizada'],
	['AMR-1K8V6F', 'Andrés Felipe Monsalve', '1039456123', '3051112233', 13, 1, 3, 2, 'cancelada'],
	['AMR-7S2G9J', 'Valentina Ospina Mejía', '1000567234', '3013334455', 21, -2, 0, 1, 'cancelada'],
];

export function createDemoReservations(today: string): Reservation[] {
	const now = new Date();
	const stamp = (dayOffset: number, hour: number) => {
		const date = new Date(now);
		date.setDate(date.getDate() + dayOffset);
		date.setHours(hour, 15, 0, 0);
		return date.toISOString();
	};
	return seeds.map(([code, guestName, document, phone, roomNumber, from, to, guests, status]) => ({
		code,
		guestName,
		document,
		phone,
		roomNumber,
		checkIn: addDays(today, from),
		checkOut: addDays(today, to),
		guests,
		status,
		createdAt: stamp(from - 7, 10),
		...(status === 'checkin' || status === 'finalizada' ? { checkedInAt: stamp(from, 14) } : {}),
		...(status === 'finalizada' ? { checkedOutAt: stamp(to, 11) } : {}),
		...(status === 'cancelada' ? { cancelledAt: stamp(from - 2, 9) } : {}),
	}));
}
