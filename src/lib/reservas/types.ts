// Modelo de datos del MVP de reservas y check-in.

export type RoomType = 'matrimonial' | 'doble' | 'triple';

export type Room = {
	number: number;
	type: RoomType;
	beds: number;
	bedsLabel: string;
	/** Capacidad estimada para el MVP (no es un dato oficial del hotel). */
	capacity: number;
};

export type ReservationStatus = 'confirmada' | 'checkin' | 'finalizada' | 'cancelada';

/** Fechas en formato ISO local `AAAA-MM-DD`. La salida no cuenta como noche ocupada. */
export type Reservation = {
	code: string;
	guestName: string;
	document: string;
	phone: string;
	roomNumber: number;
	checkIn: string;
	checkOut: string;
	guests: number;
	status: ReservationStatus;
	createdAt: string;
	checkedInAt?: string;
	checkedOutAt?: string;
	cancelledAt?: string;
};

export type ReservationInput = {
	guestName: string;
	document: string;
	phone: string;
	checkIn: string;
	checkOut: string;
	guests: number | '';
	roomNumber: number | '';
};

export type FieldErrors = Partial<Record<keyof ReservationInput, string>>;

/** Estado de una habitación para un día o rango de fechas. */
export type RoomAvailability = 'disponible' | 'reservada' | 'ocupada';
