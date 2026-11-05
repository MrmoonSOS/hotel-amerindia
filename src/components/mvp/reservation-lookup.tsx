import { useMemo, useState } from 'react';
import { findByCodeOrDocument } from '@/lib/reservas/validacion';
import type { Reservation } from '@/lib/reservas/types';
import { Feedback } from './feedback';
import { ReservationDetails } from './reservation-details';
import { ReservationSearch } from './reservation-search';

/** HU03 — Consultar el estado de una reserva por código o documento. */
export function ReservationLookup({ reservations, initialQuery }: { reservations: Reservation[]; initialQuery: string }) {
	const [query, setQuery] = useState(initialQuery);
	const [lastInitial, setLastInitial] = useState(initialQuery);
	if (initialQuery !== lastInitial) {
		setLastInitial(initialQuery);
		setQuery(initialQuery);
	}
	// Los resultados se recalculan con cada cambio en las reservas: el estado siempre está al día.
	const results = useMemo(() => findByCodeOrDocument(reservations, query), [reservations, query]);

	return <div className="mvp-panel">
		<div className="mvp-panel__head">
			<div><span className="eyebrow">HU03 / CONSULTAR RESERVA</span><h2>Consultar reserva.</h2></div>
			<p>El huésped o el personal del hotel pueden verificar que una reserva esté registrada y ver su estado actual.</p>
		</div>
		<ReservationSearch id="consulta-busqueda" initialQuery={initialQuery} onSearch={setQuery}/>
		{query.trim() && results.length === 0 && <Feedback tone="error" title="No encontramos ninguna reserva con ese código o documento.">Revisa que el código esté completo (formato AMR-XXXXXX) o intenta con el documento.</Feedback>}
		{results.length > 1 && <p className="form-note">{results.length} reservas asociadas a este documento.</p>}
		<div className="mvp-results">{results.map(r => <ReservationDetails key={r.code} reservation={r}/>)}</div>
		{!query.trim() && <p className="form-note">Prueba con un código de demostración: AMR-3Q8D2M, AMR-7K2Q9D o AMR-1K8V6F.</p>}
	</div>;
}
