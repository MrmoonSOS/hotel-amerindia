# Hotel Amerindia

Sitio estático (React Router en modo SPA con prerender, Vite, Tailwind y shadcn/ui) usado como apoyo visual en la exposición.

Páginas: `/` (Inicio), `/correcciones` y `/entregable`.

```bash
npm install
npm run dev        # desarrollo
npm run build      # genera el sitio estático en build/client
npm run typecheck
```

Vercel: Framework Preset "Other", Build Command `npm run build`, Output Directory `build/client` (ya definido en `vercel.json`).
