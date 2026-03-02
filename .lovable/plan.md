

## Piano di Implementazione — Tutte le Migliorie (escluso localStorage)

### Alta Priorità

1. **Fix font 9px nella griglia numeri** (`SchedinaColumn.tsx` riga 114)
   - Da `text-[9px] sm:text-[11px]` a `text-[11px] sm:text-[12px] lg:text-[13px]` per WCAG compliance
   - Fix anche `text-[9px]` nel label SuperStar (riga 147) e nel pulsante Rimuovi (riga 223)

2. **Fix colori hardcoded nella bottom bar** (`Schedina.tsx` righe 236-267)
   - Sostituire `background: '#e8e8e8'`, `color: '#333'`, `color: '#999'` con classi Tailwind tema-aware (`bg-secondary`, `text-foreground`, `text-muted-foreground`)

3. **Fix font 10px residui** (`StatisticheDashboard.tsx` righe 77/81/85, `SimulazioneVeloce.tsx` righe 83/129)
   - Da `text-[10px]` a `text-[11px]`

### Media Priorità

4. **Pulsante "Nuova Partita"** (`Index.tsx`)
   - Aggiungere un pulsante dopo l'estrazione per resettare `extraction`, `matchedByColumn`, `lastResults` senza cancellare la storia

5. **SuperStar picker responsive** (`SchedinaColumn.tsx`)
   - Su mobile (< 640px), usare un Dialog/sheet centrato invece del popup absolute che esce dal viewport

6. **Vibrazione su mobile** (`Index.tsx`)
   - Aggiungere `navigator.vibrate?.(30)` nel setInterval dell'estrazione quando ogni pallina viene rivelata

7. **Condivisione risultati** (`Index.tsx`)
   - Pulsante "Condividi" accanto a "Nuova Partita" che copia un riepilogo testuale negli appunti via `navigator.clipboard.writeText`

8. **Footer link disclaimer** — Già presente, verificato

### Bassa Priorità

9. **Fix `_headers` newline finale** (`public/_headers`)

### File modificati
- `src/components/SchedinaColumn.tsx` — font sizes + responsive picker
- `src/components/Schedina.tsx` — bottom bar theme colors
- `src/components/StatisticheDashboard.tsx` — font sizes
- `src/components/SimulazioneVeloce.tsx` — font sizes
- `src/pages/Index.tsx` — nuova partita, vibrazione, condivisione
- `public/_headers` — newline finale

