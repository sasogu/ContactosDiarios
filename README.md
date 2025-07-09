# ContactosDiarios

Esta es una aplicación web creada con Vite y HTML5 para gestionar un diario de contactos. Permite agregar, editar, eliminar y listar contactos, así como añadir notas diarias para cada uno.

## Scripts principales

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Genera la versión de producción.
- `npm run preview`: Previsualiza la app en modo producción.
- `npm run deploy`: Despliega la app en GitHub Pages (requiere permisos de push en el repositorio).

## Despliegue en GitHub Pages

1. Asegúrate de que el campo `base` en `vite.config.js` es `/ContactosDiarios/` (o el nombre de tu repo).
2. Ejecuta:
   ```bash
   npm run deploy
   ```
3. La app estará disponible en `https://<tu-usuario>.github.io/ContactosDiarios/`.

> **Nota:** Los recursos estáticos y rutas deben funcionar correctamente gracias al campo `base` en la configuración de Vite.

## Estructura inicial

- `index.html`: Entrada principal de la app.
- `main.js`: Lógica principal de la aplicación.

## Próximos pasos

- Implementar la interfaz para gestión de contactos y notas.
- Mejorar la experiencia de usuario y el diseño visual.

---

Generado con Vite.
