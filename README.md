# Blondie Cosmetic

Proyecto listo para subir a GitHub y desplegar en Vercel.

## Requisitos
- Node.js 18 o superior

## Instalar
```bash
npm install
```

## Ejecutar local
```bash
npm run dev
```

## Compilar
```bash
npm run build
```

## Subir a GitHub
1. Crea un repositorio nuevo en GitHub.
2. Sube todos los archivos de esta carpeta.
3. Verifica que `package.json` quede en la raíz del repositorio.

## Desplegar en Vercel
1. Entra a Vercel.
2. Importa tu repositorio de GitHub.
3. Framework: Vite.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy.

## Nota
Esta versión guarda datos en el navegador. Para sincronizar iPhone + PC, el siguiente paso es conectar Supabase.
