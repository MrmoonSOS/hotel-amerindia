# Hotel Amerindia

Sitio estático (React Router en modo SPA con prerender, Vite, Tailwind y shadcn/ui) usado como apoyo visual en la exposición, con un MVP funcional del sistema de reservas y check-in.

Páginas: `/` (Inicio), `/contexto`, `/bpmn` (entregable) y `/mvp`. Las URL antiguas `/correcciones` y `/entregable` redirigen a las nuevas en Vercel.

```bash
npm install
npm run dev        # desarrollo
npm run build      # genera el sitio estático en build/client
npm run typecheck
```

## Estructura

```
src/
  routes/              páginas (home, contexto, bpmn, mvp)
  components/
    layout/            navbar + footer compartidos (HotelShell)
    home/              secciones de la página de inicio
    procesos/          bloques del contenido académico (DOFA, AS IS/TO BE, historias…)
    mvp/               interfaz del MVP (habitaciones, reserva, consulta, check-in, panel)
    ui/                componentes shadcn/ui
  data/                contenido y datos: navegación, contexto, bpmn, habitaciones, reservas demo
  lib/reservas/        lógica del MVP sin React: tipos, fechas, disponibilidad, validaciones y store
  hooks/               hooks (use-reservas conecta React con el store)
  index.css            estilos del sitio (las clases del MVP usan el prefijo mvp-)
```

## MVP

- Las reservas se guardan en `localStorage` (clave `hotel-amerindia:mvp:reservas:v1`); todas las secciones leen de la misma fuente.
- La primera vez se cargan reservas de demostración con fechas relativas al día actual. El botón «Restablecer datos de demostración» vuelve a ese estado.
- Una habitación puede tener varias reservas mientras las fechas no se crucen (el día de salida queda libre para una nueva entrada).
- Las capacidades por habitación son estimadas (`src/data/habitaciones.ts`), no datos oficiales.

## Vercel

Framework Preset "Other", Build Command `npm run build`, Output Directory `build/client` (ya definido en `vercel.json`, junto con el fallback SPA y las redirecciones).
