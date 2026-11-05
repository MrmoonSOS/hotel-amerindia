import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { roomTypes, rooms } from '@/data/habitaciones';
import { availableRooms } from '@/lib/reservas/disponibilidad';
import { addDays, formatDate, nightsBetween } from '@/lib/reservas/fechas';
import { reservationStore } from '@/lib/reservas/store';
import type { FieldErrors, Reservation, ReservationInput } from '@/lib/reservas/types';
import { Feedback } from './feedback';

export type ReservationDraft = Partial<Pick<ReservationInput, 'roomNumber' | 'checkIn' | 'checkOut' | 'guests'>>;

type Props = {
	open: boolean;
	draft: ReservationDraft;
	reservations: Reservation[];
	today: string;
	onOpenChange: (open: boolean) => void;
	onViewReservation: (code: string) => void;
};

const emptyInput = (today: string, draft: ReservationDraft): ReservationInput => ({
	guestName: '',
	document: '',
	phone: '',
	checkIn: draft.checkIn ?? today,
	checkOut: draft.checkOut ?? addDays(draft.checkIn ?? today, 1),
	guests: draft.guests ?? 1,
	roomNumber: draft.roomNumber ?? '',
});

/** HU02 — Formulario de reserva en una ventana emergente, con validaciones y código único. */
export function ReservationDialog({ open, draft, reservations, today, onOpenChange, onViewReservation }: Props) {
	const [input, setInput] = useState(() => emptyInput(today, draft));
	const [errors, setErrors] = useState<FieldErrors>({});
	const [created, setCreated] = useState<Reservation | null>(null);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!open) return;
		setInput(emptyInput(today, draft));
		setErrors({});
		setCreated(null);
		setCopied(false);
	}, [open, draft, today]);

	const datesValid = input.checkIn >= today && input.checkOut > input.checkIn;
	const freeRooms = useMemo(() => new Set(datesValid ? availableRooms(rooms, reservations, input.checkIn, input.checkOut, Number(input.guests) || 1).map(r => r.number) : []), [datesValid, reservations, input.checkIn, input.checkOut, input.guests]);
	const nights = datesValid ? nightsBetween(input.checkIn, input.checkOut) : 0;

	function set<K extends keyof ReservationInput>(key: K, value: ReservationInput[K]) {
		setInput(prev => {
			const next = { ...prev, [key]: value };
			// Si la entrada pasa a ser igual o posterior a la salida, se propone una noche.
			if (key === 'checkIn' && typeof value === 'string' && value && next.checkOut <= value) next.checkOut = addDays(value, 1);
			return next;
		});
		setErrors(prev => ({ ...prev, [key]: undefined }));
	}

	function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const result = reservationStore.create(input);
		if (result.ok) setCreated(result.reservation);
		else {
			setErrors(result.errors);
			const firstField = Object.keys(result.errors)[0];
			document.getElementById(`reserva-${firstField}`)?.focus();
		}
	}

	async function copyCode(code: string) {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
		} catch {
			setCopied(false);
		}
	}

	const errorCount = Object.values(errors).filter(Boolean).length;
	const field = (key: keyof ReservationInput) => ({
		id: `reserva-${key}`,
		'aria-invalid': errors[key] ? true : undefined,
		'aria-describedby': errors[key] ? `reserva-${key}-error` : undefined,
	});
	const fieldError = (key: keyof ReservationInput) => errors[key] && <span className="mvp-field-error" id={`reserva-${key}-error`}>{errors[key]}</span>;

	return <Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent className="mvp-dialog">
			{created ? <div className="mvp-success">
				<span className="eyebrow">HU02 / RESERVA REGISTRADA</span>
				<DialogTitle className="mvp-dialog__title">¡Reserva exitosa!</DialogTitle>
				<DialogDescription className="mvp-dialog__lead">Guarda este código: con él puedes consultar la reserva y hacer el check-in al llegar.</DialogDescription>
				<p className="mvp-success__code">{created.code}</p>
				<p className="mvp-dialog__lead">{created.guestName} · Habitación {created.roomNumber} · {formatDate(created.checkIn)} → {formatDate(created.checkOut)} · {created.guests} {created.guests === 1 ? 'huésped' : 'huéspedes'}</p>
				<div className="mvp-actions">
					<button type="button" className="button" onClick={() => onViewReservation(created.code)}>Ver mi reserva <span>↗</span></button>
					<button type="button" className="mvp-link-button" onClick={() => copyCode(created.code)}>{copied ? 'Código copiado ✓' : 'Copiar código'}</button>
					<button type="button" className="mvp-link-button" onClick={() => onOpenChange(false)}>Cerrar</button>
				</div>
			</div> : <form onSubmit={submit} noValidate>
				<span className="eyebrow">HU02 / NUEVA RESERVA</span>
				<DialogTitle className="mvp-dialog__title">Reservar habitación.</DialogTitle>
				<DialogDescription className="mvp-dialog__lead">Todos los campos son obligatorios. La reserva queda confirmada al instante.</DialogDescription>
				{errorCount > 0 && <Feedback tone="error" title={`Revisa ${errorCount === 1 ? 'el campo marcado' : `los ${errorCount} campos marcados`}.`}/>}
				<label>Nombre completo<input {...field('guestName')} value={input.guestName} onChange={e => set('guestName', e.target.value)} autoComplete="name" placeholder="Ej. María Fernanda Úsuga"/>{fieldError('guestName')}</label>
				<div className="form-row">
					<label>Documento de identidad<input {...field('document')} value={input.document} onChange={e => set('document', e.target.value)} inputMode="numeric" placeholder="Sin puntos"/>{fieldError('document')}</label>
					<label>Teléfono<input {...field('phone')} type="tel" value={input.phone} onChange={e => set('phone', e.target.value)} autoComplete="tel" placeholder="Ej. 3101234567"/>{fieldError('phone')}</label>
				</div>
				<div className="form-row">
					<label>Fecha de entrada<input {...field('checkIn')} type="date" min={today} value={input.checkIn} onChange={e => set('checkIn', e.target.value)}/>{fieldError('checkIn')}</label>
					<label>Fecha de salida<input {...field('checkOut')} type="date" min={input.checkIn ? addDays(input.checkIn, 1) : today} value={input.checkOut} onChange={e => set('checkOut', e.target.value)}/>{fieldError('checkOut')}</label>
				</div>
				<div className="form-row">
					<label>Cantidad de huéspedes<input {...field('guests')} type="number" min={1} max={10} value={input.guests} onChange={e => set('guests', e.target.value === '' ? '' : Number(e.target.value))}/>{fieldError('guests')}</label>
					<label>Habitación<select {...field('roomNumber')} value={input.roomNumber} onChange={e => set('roomNumber', e.target.value === '' ? '' : Number(e.target.value))}>
						<option value="">Selecciona…</option>
						<optgroup label={datesValid ? `Disponibles (${freeRooms.size})` : 'Habitaciones'}>
							{rooms.filter(r => !datesValid || freeRooms.has(r.number)).map(r => <option key={r.number} value={r.number}>N.º {r.number} · {roomTypes[r.type].label} · hasta {r.capacity} pers.</option>)}
						</optgroup>
						{datesValid && freeRooms.size < rooms.length && <optgroup label="No disponibles en esas fechas o capacidad insuficiente">
							{rooms.filter(r => !freeRooms.has(r.number)).map(r => <option key={r.number} value={r.number}>N.º {r.number} · {roomTypes[r.type].label} · hasta {r.capacity} pers. (no disponible)</option>)}
						</optgroup>}
					</select>{fieldError('roomNumber')}</label>
				</div>
				{datesValid && <p className="form-note">{nights} {nights === 1 ? 'noche' : 'noches'} · {freeRooms.size} {freeRooms.size === 1 ? 'habitación disponible' : 'habitaciones disponibles'} para {Number(input.guests) || 1} {Number(input.guests) === 1 ? 'huésped' : 'huéspedes'} en esas fechas.</p>}
				{datesValid && freeRooms.size === 0 && <Feedback tone="info" title="No hay disponibilidad para esas fechas y cantidad de huéspedes.">Prueba con otras fechas o menos huéspedes por habitación.</Feedback>}
				<button className="button mvp-submit" type="submit">Confirmar reserva <span>↗</span></button>
			</form>}
		</DialogContent>
	</Dialog>;
}
