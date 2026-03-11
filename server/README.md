# Node.js Express TypeScript Template

En minimal template för backend-utveckling med Node.js, Express och TypeScript.

## Kom igång

### 1. Installera dependencies

```bash
npm install
```

### 2. Starta utvecklingsservern (med hot reload)

```bash
npm run dev
```

Servern startar på [http://localhost:3000](http://localhost:3000).

### 3. Bygg för produktion

```bash
npm run build
```

### 4. Kör applikation för produktion

```bash
npm start
```

## Projektstruktur

```
src/
  server.ts   ← Huvudfil: skapar Express-app och startar servern
```

## Dependencies

### Runtime

| Paket | Beskrivning |
|-------|-------------|
| `express` | Webbramverk för Node.js - hanterar routes, requests och responses |

```bash
npm install express
```

### Dev

| Paket | Beskrivning |
|-------|-------------|
| `typescript` | TypeScript-kompilatorn - kompilerar `.ts`-filer till JavaScript |
| `tsx` | Kör TypeScript direkt i Node.js, med inbyggd watch-funktion (ersätter `ts-node` + `nodemon`) |
| `@types/node` | TypeScript-typdefinitioner för Node.js inbyggda moduler (fs, path, http etc.) |
| `@types/express` | TypeScript-typdefinitioner för Express (ger autocomplete och typkontroll) |

```bash
npm install -D typescript tsx @types/node @types/express
```

## TSConfig

Projektet använder ESM (ECMAScript Modules) med följande nyckelinställningar i `tsconfig.json`:

| Inställning | Värde | Beskrivning |
|-------------|-------|-------------|
| `target` | `ES2022` | Stöder moderna features som top-level await |
| `module` | `NodeNext` | Aktiverar ESM-moduler för Node.js |
| `moduleResolution` | `NodeNext` | Resolver imports enligt Node.js ESM-regler |

`package.json` har `"type": "module"` vilket gör att alla `.js`-filer behandlas som ESM.

## Scripts

| Script          | Beskrivning                                    |
| --------------- | ---------------------------------------------- |
| `npm run dev`   | Startar servern med tsx watch (hot reload)      |
| `npm run build` | Kompilerar TypeScript till JavaScript (dist/)   |
| `npm start`     | Kör kompilerad kod från dist/                  |