# Factoring - Mock Frontend (React + Vite + Tailwind)

Proyecto minimal para consumir tu backend C# en el futuro. Actualmente el login y registro son *mock* (no llaman API) y se guarda información en localStorage.

## Instrucciones

1. `npm install`
2. `npm run dev`
3. Abrir `http://localhost:5173` (o puerto que indique Vite)

## Estructura

- src/pages: Login, Register, Dashboard, Clients, AddClient
- src/components: Header

Puedes sustituir las operaciones de `localStorage` por fetch a tu API C# en las páginas correspondientes.
