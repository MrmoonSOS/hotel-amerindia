import { useState } from 'react';

export function Contact() {
 const [status, setStatus] = useState('Esta consulta no se envía ni confirma una reserva.');
 const [arrival, setArrival] = useState('');
 const [copy, setCopy] = useState('');
 const [busy, setBusy] = useState(false);
 async function submit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const values = new FormData(event.currentTarget);
  if (String(values.get('departure')) <= String(values.get('arrival'))) { setStatus('La salida debe ser posterior a la llegada.'); return; }
  const text = `Hola, soy ${String(values.get('name')).trim()}. Quisiera consultar disponibilidad en Hotel Amerindia. Llegada: ${values.get('arrival')}. Salida: ${values.get('departure')}. Personas: ${values.get('guests')}. Gracias.`;
  setBusy(true);
  try { await navigator.clipboard.writeText(text); setCopy(''); setStatus('Consulta copiada. Compártela con el hotel por su canal de contacto habitual. Esto no confirma una reserva.'); }
  catch { setCopy(text); setStatus('No se pudo copiar automáticamente. Selecciona y copia el texto de tu consulta.'); }
  finally { setBusy(false); }
 }
 return <section className="contact" id="contacto"><div><span className="eyebrow">04 / NOS ENCANTARÁ RECIBIRTE</span><h2>Tu próxima pausa<br/>empieza aquí.</h2><p>Prepara tu consulta y compártela con el hotel a través de su canal de contacto habitual. Las reservas se confirman directamente con el hotel.</p><p className="contact-note">Teléfono, correo y dirección: pendientes de publicación.</p></div><form onSubmit={submit}><label>Tu nombre<input required placeholder="¿Cómo te llamas?" name="name" autoComplete="name"/></label><div className="form-row"><label>Llegada<input type="date" required name="arrival" value={arrival} onChange={event=>setArrival(event.target.value)}/></label><label>Salida<input type="date" required name="departure" min={arrival || undefined}/></label></div><label>Personas<select name="guests"><option>1</option><option>2</option><option>3</option><option>4</option><option>5 o más</option></select></label><button className="button" type="submit" disabled={busy}>{busy ? 'Copiando consulta…' : 'Copiar consulta de reserva ↗'}</button><p className="form-note" role="status">{status}</p>{copy && <label>Tu consulta<textarea readOnly value={copy} onFocus={event=>event.target.select()}/></label>}</form></section>;
}
