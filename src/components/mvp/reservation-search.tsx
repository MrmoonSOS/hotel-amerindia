import { useEffect, useState } from 'react';

/** Buscador por código de reserva o documento (compartido por HU03 y HU04). */
export function ReservationSearch({ id, initialQuery = '', onSearch }: { id: string; initialQuery?: string; onSearch: (query: string) => void }) {
	const [query, setQuery] = useState(initialQuery);
	useEffect(() => setQuery(initialQuery), [initialQuery]);
	return <form className="mvp-search" role="search" onSubmit={event => { event.preventDefault(); onSearch(query); }}>
		<label htmlFor={id}>Código de reserva o documento de identidad</label>
		<div className="mvp-search__row">
			<input id={id} value={query} onChange={e => setQuery(e.target.value)} placeholder="Ej. AMR-3Q8D2M o 1020304050" autoComplete="off"/>
			<button className="button" type="submit">Buscar <span>↗</span></button>
		</div>
	</form>;
}
