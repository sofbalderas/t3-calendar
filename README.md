# Transforma 3 · Calendario de contenido

App de calendario de contenido para Instagram de **Transforma 3**, construida con React + Vite y Supabase como base de datos en tiempo real. Incluye:

- **Calendario** mensual con las publicaciones por fecha.
- **Vista por plataforma** (Instagram, con TikTok/Facebook listos para activarse a futuro) agrupada por semana, con filtro por pilar/estatus y cambio rápido de estatus de producción.
- **Estadísticas** con balance de pilares (Pilar A / Pilar B / Newsletter), cadencia semanal, formatos producidos y estatus de producción.
- Botón **"Generar ritmo"** que crea automáticamente el esquema fijo semanal del plan de estrategia (martes = Pilar A · Reel, jueves = Pilar B · Carrusel, domingo = Newsletter).
- Colores de marca tomados del material de campaña (carbón, mostaza, crema, salvia y vino).

---

## 1. Crear el proyecto en Supabase

1. Entra a [supabase.com](https://supabase.com) y crea un proyecto (o usa uno existente).
2. Ve a **SQL Editor** → pega el contenido de [`supabase/schema.sql`](./supabase/schema.sql) → Run.
   - Esto crea la tabla `posts`, activa Realtime y deja políticas de acceso público (pensadas para uso interno con la llave anónima, sin login).
3. Ve a **Project Settings → API** y copia:
   - **Project URL**
   - **anon public key**

## 2. Configurar el proyecto localmente

```bash
npm install
cp .env.example .env
```

Edita `.env` con tus datos de Supabase:

```
VITE_SUPABASE_URL=https://tuproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publica
```

Corre en local:

```bash
npm run dev
```

## 3. Subir a GitHub

```bash
git init
git add .
git commit -m "Calendario de contenido Transforma 3"
git branch -M main
git remote add origin https://github.com/tu-usuario/transforma3-calendario.git
git push -u origin main
```

> El archivo `.env` está en `.gitignore` — nunca se sube tu llave. En Vercel la agregas como variable de entorno (paso siguiente).

## 4. Desplegar en Vercel

1. Entra a [vercel.com](https://vercel.com) → **Add New… → Project** → importa el repo de GitHub.
2. Framework detectado: **Vite** (se configura solo).
3. En **Environment Variables**, agrega:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. Cada vez que hagas `git push`, Vercel vuelve a desplegar automáticamente.

## 5. Uso diario

- **+ Nueva publicación**: crea una pieza en cualquier fecha, con pilar, formato, estatus, descripción/guion y CTA.
- **Generar ritmo**: elige una semana de inicio y cuántas semanas, y crea automáticamente el esquema martes/jueves/domingo del plan de estrategia. Después edita cada tarjeta con el contenido real.
- **Calendario**: clic en un día vacío para crear, clic en una pieza para editarla.
- **Instagram**: vista por semana con cambio rápido de estatus (Idea → Para grabar → Grabado → Editado → Programado → Publicado).
- **Estadísticas**: revisa si Pilar A y Pilar B están balanceados, cuántas piezas llevas publicadas y cómo va la cadencia semana a semana.

## Estructura del proyecto

```
src/
  components/       Calendario, vista por plataforma, estadísticas, modales
  lib/
    constants.js     Colores de marca, pilares, formatos, estatus, cadencia
    supabaseClient.js
    usePosts.js      Lectura/escritura + suscripción realtime a Supabase
  App.jsx
  styles.css
supabase/
  schema.sql          Tabla, índices, trigger de updated_at, políticas RLS y Realtime
```

## Notas

- La tabla `posts` no tiene autenticación de usuario: cualquiera con el link y las llaves puede leer/escribir (uso interno del equipo). Si más adelante quieres restringir el acceso, activa Supabase Auth y ajusta las políticas en `schema.sql`.
- El campo `platform` ya soporta `tiktok` y `facebook` para cuando quieran expandir; hoy solo Instagram está activo en la interfaz.
