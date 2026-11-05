import type { Room, RoomType } from '@/lib/reservas/types';

// Distribución real del Hotel Amerindia: 21 habitaciones.
//  - Habitaciones 1 a 16: una cama matrimonial.
//  - Habitación 17: tres camas.
//  - Habitaciones 18 a 21: dos camas.
// Las capacidades son estimaciones para el MVP (2 personas en cama matrimonial, 1 por cama sencilla);
// el hotel no las ha especificado oficialmente por habitación.

export const roomTypes: Record<RoomType, { label: string; beds: number; bedsLabel: string; capacity: number }> = {
	matrimonial: { label: 'Matrimonial', beds: 1, bedsLabel: '1 cama matrimonial', capacity: 2 },
	doble: { label: 'Doble', beds: 2, bedsLabel: '2 camas', capacity: 2 },
	triple: { label: 'Triple', beds: 3, bedsLabel: '3 camas', capacity: 3 },
};

function typeFor(number: number): RoomType {
	if (number <= 16) return 'matrimonial';
	if (number === 17) return 'triple';
	return 'doble';
}

export const rooms: Room[] = Array.from({ length: 21 }, (_, index) => {
	const number = index + 1;
	const type = typeFor(number);
	const { beds, bedsLabel, capacity } = roomTypes[type];
	return { number, type, beds, bedsLabel, capacity };
});

/** Datos generales del hotel (tomados del contexto del proyecto). */
export const hotelFacts = {
	maxCapacity: 35,
	averageDailyGuests: '18 a 20',
	staff: 4,
	cleaningStaff: 2,
};
