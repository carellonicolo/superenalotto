# 📐 Documentazione Matematica

Questo documento descrive in dettaglio la teoria matematica alla base del SuperEnalotto Simulator: calcolo combinatorio, probabilità, simulazione Monte Carlo e valore atteso.

---

## 📋 Indice

- [Fondamenti di Calcolo Combinatorio](#-fondamenti-di-calcolo-combinatorio)
- [Il Coefficiente Binomiale](#-il-coefficiente-binomiale)
- [Applicazione al SuperEnalotto](#-applicazione-al-superenalotto)
- [Probabilità per Categoria di Vincita](#-probabilità-per-categoria-di-vincita)
- [Il Numero Jolly](#-il-numero-jolly)
- [Simulazione Monte Carlo](#-simulazione-monte-carlo)
- [Valore Atteso e Rendimento](#-valore-atteso-e-rendimento)
- [Confronti con la Vita Reale](#-confronti-con-la-vita-reale)
- [Implementazione nel Codice](#-implementazione-nel-codice)
- [Riferimenti Bibliografici](#-riferimenti-bibliografici)

---

## 🔢 Fondamenti di Calcolo Combinatorio

Il **calcolo combinatorio** è la branca della matematica che studia i modi in cui si possono selezionare, disporre o raggruppare elementi di un insieme finito. Nel contesto del SuperEnalotto, ci interessa in particolare il concetto di **combinazione**: la selezione di un sottoinsieme di elementi da un insieme più grande, **senza considerare l'ordine**.

### Permutazioni vs. Combinazioni

- **Permutazione**: l'ordine conta. Quanti modi per disporre k elementi da n? → P(n,k) = n! / (n-k)!
- **Combinazione**: l'ordine NON conta. Quanti modi per scegliere k elementi da n? → C(n,k) = n! / (k! × (n-k)!)

Nel SuperEnalotto l'ordine di estrazione non è rilevante: i numeri {3, 15, 27, 42, 56, 88} e {88, 56, 42, 27, 15, 3} sono la stessa combinazione. Per questo usiamo le **combinazioni**.

### Il Fattoriale

Il fattoriale di un numero naturale n, indicato con **n!**, è il prodotto di tutti i numeri interi positivi da 1 a n:

```
n! = n × (n-1) × (n-2) × ... × 2 × 1

Esempi:
  6! = 6 × 5 × 4 × 3 × 2 × 1 = 720
 84! = 84 × 83 × ... × 2 × 1 ≈ 3.314 × 10^126
 90! = 90 × 89 × ... × 2 × 1 ≈ 1.486 × 10^138
```

Per convenzione: **0! = 1**

---

## 📊 Il Coefficiente Binomiale

Il **coefficiente binomiale** C(n, k), anche scritto come "n choose k" o (n k), rappresenta il numero di modi per scegliere k elementi da un insieme di n elementi distinti, senza ripetizione e senza considerare l'ordine:

```
            n!
C(n, k) = ─────────
          k! × (n-k)!
```

### Proprietà Fondamentali

1. **Simmetria**: C(n, k) = C(n, n-k)
   - Es: C(90, 6) = C(90, 84) — scegliere 6 numeri da includere equivale a scegliere 84 da escludere

2. **Casi base**: C(n, 0) = C(n, n) = 1
   - C'è un solo modo per scegliere tutti gli elementi o nessuno

3. **Ricorrenza di Pascal**: C(n, k) = C(n-1, k-1) + C(n-1, k)
   - Ogni scelta si riduce a: includere o escludere l'n-esimo elemento

4. **Somma su k**: Σ C(n, k) per k=0..n = 2^n
   - Il numero totale di sottoinsiemi di un insieme di n elementi

### Calcolo Numerico Stabile

Per evitare overflow con fattoriali molto grandi (90! ha 138 cifre!), nel codice usiamo un approccio iterativo:

```
C(n, k) = ∏(i=0 to k-1) [(n-i) / (i+1)]
```

Questa formula calcola il risultato moltiplicando e dividendo alternamente, mantenendo i valori intermedi in un range gestibile.

---

## 🎰 Applicazione al SuperEnalotto

### Regole del Gioco

- Si scelgono **6 numeri** distinti dall'insieme {1, 2, 3, ..., 90}
- Vengono estratti **6 numeri** principali + **1 Jolly** (dai rimanenti 84)
- Il **SuperStar** è un numero separato da 1 a 90 (estrazione indipendente)

### Combinazioni Totali

Il numero totale di combinazioni possibili per i 6 numeri principali:

```
C(90, 6) = 90! / (6! × 84!)
         = (90 × 89 × 88 × 87 × 86 × 85) / (6 × 5 × 4 × 3 × 2 × 1)
         = 448.282.533.600 / 720
         = 622.614.630
```

**Ci sono esattamente 622.614.630 combinazioni possibili.**

---

## 📉 Probabilità per Categoria di Vincita

Per ogni categoria, la probabilità si calcola come il rapporto tra **casi favorevoli** e **casi totali** (622.614.630).

### Categoria "6" — Tutti e 6 i numeri

```
Casi favorevoli = C(6,6) × C(84,0) = 1 × 1 = 1

P(6) = 1 / 622.614.630 ≈ 1,607 × 10⁻⁹
```

**1 possibilità su 622.614.630** — circa 0,00000016%

### Categoria "5+1" — 5 numeri + Jolly

Per ottenere il "5+1":
1. Indovinare esattamente 5 dei 6 numeri estratti: C(6,5) = 6 modi
2. Il sesto numero giocato deve essere il Jolly

Il Jolly è 1 numero specifico tra gli 84 non estratti. La sesta posizione della nostra giocata (quella sbagliata) deve coincidere con il Jolly.

```
Casi favorevoli = C(6,5) × 1 = 6

P(5+1) = 6 / 622.614.630 ≈ 9,641 × 10⁻⁹
```

**1 possibilità su 103.769.105**

### Categoria "5" — 5 numeri (senza Jolly)

```
Casi favorevoli = C(6,5) × C(84,1) = 6 × 84 = 504

Ma dobbiamo sottrarre i casi "5+1" (dove il sesto è il Jolly):
Casi favorevoli netti = 504 - 6 = 498

P(5) = 498 / 622.614.630 ≈ 7,998 × 10⁻⁷
```

**1 possibilità su 1.250.230** (circa)

### Categoria "4" — 4 numeri

```
Casi favorevoli = C(6,4) × C(84,2) = 15 × 3.486 = 52.290

P(4) = 52.290 / 622.614.630 ≈ 8,398 × 10⁻⁵
```

**1 possibilità su 11.907**

### Categoria "3" — 3 numeri

```
Casi favorevoli = C(6,3) × C(84,3) = 20 × 95.284 = 1.905.680

P(3) = 1.905.680 / 622.614.630 ≈ 3,062 × 10⁻³
```

**1 possibilità su 327**

### Categoria "2" — 2 numeri

```
Casi favorevoli = C(6,2) × C(84,4) = 15 × 1.929.501 = 28.942.515

P(2) = 28.942.515 / 622.614.630 ≈ 4,649 × 10⁻²
```

**1 possibilità su 22** (circa)

### Tabella Riepilogativa

| Categoria | Casi Favorevoli | Probabilità | 1 su N | Premio Medio |
|---|---|---|---|---|
| **6** | 1 | 1,607 × 10⁻⁹ | 622.614.630 | €100.000.000 |
| **5+1** | 6 | 9,641 × 10⁻⁹ | 103.769.105 | €500.000 |
| **5** | 498 | 7,998 × 10⁻⁷ | 1.250.230 | €50.000 |
| **4** | 52.290 | 8,398 × 10⁻⁵ | 11.907 | €300 |
| **3** | 1.905.680 | 3,062 × 10⁻³ | 327 | €25 |
| **2** | 28.942.515 | 4,649 × 10⁻² | 22 | €5 |

### Probabilità di NON vincere nulla

```
P(nulla) = 1 - P(2) - P(3) - P(4) - P(5) - P(5+1) - P(6)
         ≈ 1 - 0,04649 - 0,00306 - 0,0000840 - 0,000000800 - 0,00000000964 - 0,00000000000161
         ≈ 0,9504 = 95,04%
```

**In circa 95 giocate su 100, non si vince nulla.**

---

## 🃏 Il Numero Jolly

Il Jolly è il 7° numero estratto dall'urna (dopo i 6 principali). Viene estratto dai **84 numeri rimanenti** nel pool.

Il Jolly è rilevante solo per la categoria "5+1": se hai indovinato esattamente 5 numeri e il tuo sesto numero (sbagliato) coincide con il Jolly, la vincita passa da categoria "5" a "5+1".

### Probabilità condizionale del Jolly

Dato che hai indovinato esattamente 5 numeri, la probabilità che il tuo sesto numero sia il Jolly:

```
P(Jolly | 5 indovinati) = 1/84 ≈ 1,19%
```

Perché il tuo sesto numero è uno degli 84 non estratti, e il Jolly è uno specifico tra questi 84.

---

## 🎲 Simulazione Monte Carlo

### Principio

La **simulazione Monte Carlo** è una tecnica computazionale che utilizza il campionamento casuale ripetuto per ottenere risultati numerici. Prende il nome dal famoso casinò di Monte Carlo, a sottolineare il ruolo centrale del caso.

Nel nostro contesto, invece di calcolare analiticamente le probabilità (cosa che facciamo comunque nel pannello dedicato), **simuliamo effettivamente** migliaia o milioni di estrazioni per verificare empiricamente che i risultati convergano verso i valori teorici.

### Algoritmo

```
Per ogni iterazione i = 1, 2, ..., N:
  1. Genera un'estrazione casuale (6 numeri + Jolly + SuperStar)
  2. Per ogni colonna giocata:
     a. Conta i numeri in comune con l'estrazione
     b. Verifica la corrispondenza del Jolly e del SuperStar
     c. Determina la categoria di vincita (se presente)
     d. Somma il premio corrispondente
  3. Aggiorna i contatori aggregati
```

### Convergenza

Per la **Legge dei Grandi Numeri**, al crescere di N, le frequenze relative osservate convergono verso le probabilità teoriche:

```
lim(N→∞) [Vincite_categoria / N] = P(categoria)
```

In pratica:
- Con **1.000 estrazioni**: le categorie "2" e "3" mostrano già buona convergenza
- Con **100.000 estrazioni**: anche la categoria "4" converge bene
- Con **1.000.000+ estrazioni**: la categoria "5" inizia a comparire
- Per osservare un "6" servirebbero in media **~623 milioni** di estrazioni

### Generazione Casuale

L'estrazione viene simulata con **campionamento senza reinserimento**:

```
1. Crea un pool [1, 2, ..., 90]
2. Per i = 1, 2, ..., 6:
   - Seleziona un indice casuale nel pool
   - Estrai il numero e rimuovilo dal pool
3. Seleziona il Jolly dal pool residuo (84 numeri)
4. Il SuperStar è un numero indipendente 1-90
```

Questo garantisce che i 6 numeri principali siano tutti distinti, come nell'estrazione reale.

---

## 💰 Valore Atteso e Rendimento

### Definizione di Valore Atteso

Il **valore atteso** E[V] di una giocata è la media ponderata dei possibili guadagni, dove i pesi sono le rispettive probabilità:

```
E[V] = Σ P(categoria_i) × Premio(categoria_i)
```

### Calcolo

```
E[V] = P(6) × €100.000.000
     + P(5+1) × €500.000
     + P(5) × €50.000
     + P(4) × €300
     + P(3) × €25
     + P(2) × €5

     ≈ 1,607×10⁻⁹ × 100.000.000
     + 9,641×10⁻⁹ × 500.000
     + 7,998×10⁻⁷ × 50.000
     + 8,398×10⁻⁵ × 300
     + 3,062×10⁻³ × 25
     + 4,649×10⁻² × 5

     ≈ 0,1607 + 0,00482 + 0,03999 + 0,02519 + 0,07654 + 0,23245

     ≈ €0,5397
```

### Interpretazione

- **Costo di una giocata**: €1,00
- **Valore atteso**: ≈ €0,35 (considerando che i premi reali sono inferiori agli importi teorici)
- **Rendimento**: ≈ -65% (si perde in media il 65% di ogni euro giocato)

> Il valore esatto dipende dal jackpot corrente e dalla ripartizione dei premi. Il valore di ~€0,35 è una stima conservativa basata sui premi medi storici.

### Rovina del Giocatore

Anche aumentando il numero di giocate, il valore atteso resta negativo. Per la Legge dei Grandi Numeri, più si gioca, più ci si avvicina alla perdita attesa complessiva:

```
E[Perdita dopo N giocate] ≈ N × (1 - 0,35) = N × 0,65 €
```

Dopo 1.000 giocate, la perdita attesa è di circa **€650**.

---

## 🌍 Confronti con la Vita Reale

Per rendere tangibili le probabilità del SuperEnalotto, ecco alcuni confronti:

| Evento | Probabilità | Confronto con "fare 6" |
|---|---|---|
| Essere colpiti da un fulmine (anno) | 1 su 1.000.000 | 623× più probabile |
| Incidente aereo fatale | 1 su 11.000.000 | 57× più probabile |
| Trovare un diamante per caso | 1 su 10.000.000 | 62× più probabile |
| **Fare 6 al SuperEnalotto** | **1 su 622.614.630** | — |
| Vincere 2 volte il jackpot | 1 su ~3,9 × 10¹⁷ | — |

### Tempo necessario per vincere

Se si giocasse **una schedina al giorno**:

```
Tempo medio per un "6" = 622.614.630 giorni ≈ 1.705.793 anni
```

Servirebbero circa **1,7 milioni di anni** di giocate quotidiane.

---

## 💻 Implementazione nel Codice

### File: `src/lib/superenalotto.ts`

#### Coefficiente Binomiale

```typescript
export function binomial(n: number, k: number): number {
  if (k > n) return 0;
  if (k === 0 || k === n) return 1;
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = result * (n - i) / (i + 1);
  }
  return Math.round(result);
}
```

L'approccio iterativo evita il calcolo di fattoriali enormi, mantenendo la precisione numerica.

#### Generazione Estrazione

```typescript
export function generateExtraction(): ExtractionResult {
  const pool = Array.from({ length: 90 }, (_, i) => i + 1);
  const numbers: number[] = [];

  for (let i = 0; i < 6; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    numbers.push(pool[idx]);
    pool.splice(idx, 1);  // Rimozione per evitare duplicati
  }

  const jollyIdx = Math.floor(Math.random() * pool.length);
  const jolly = pool[jollyIdx];

  const superstar = Math.floor(Math.random() * 90) + 1;

  return { numbers: numbers.sort((a, b) => a - b), jolly, superstar };
}
```

#### Simulazione Monte Carlo

```typescript
export function runSimulation(
  columns: ColumnSelection[],
  numExtractions: number
): SimulationResult {
  const winsByCategory = { '6': 0, '5+1': 0, '5': 0, '4': 0, '3': 0, '2': 0 };
  let totalWon = 0;
  const totalSpent = numExtractions * columns.length * TICKET_COST;

  for (let i = 0; i < numExtractions; i++) {
    const extraction = generateExtraction();
    for (const col of columns) {
      const result = checkMatches(col, extraction);
      if (result.category) {
        winsByCategory[result.category]++;
        totalWon += result.prize;
      }
    }
  }

  return { totalExtractions: numExtractions, totalSpent, totalWon, winsByCategory };
}
```

### Nota sulla Casualità

`Math.random()` utilizza un generatore pseudo-casuale (PRNG). Per scopi didattici e di simulazione, è più che sufficiente. Per applicazioni crittografiche o di gioco reale, si dovrebbe usare `crypto.getRandomValues()`.

---

## 📚 Riferimenti Bibliografici

1. **Feller, W.** (1968). *An Introduction to Probability Theory and Its Applications, Vol. 1*. Wiley.
2. **Ross, S. M.** (2014). *A First Course in Probability*. 9th Edition. Pearson.
3. **Metropolis, N. & Ulam, S.** (1949). "The Monte Carlo Method". *Journal of the American Statistical Association*, 44(247), 335-341.
4. **Regolamento SuperEnalotto** — Sisal S.p.A. [sisal.it](https://www.sisal.it)
5. **Calcolo Combinatorio** — Enciclopedia Treccani. [treccani.it](https://www.treccani.it)

---

<p align="center">
  <sub>La matematica non mente: il banco vince sempre. 🎲📐</sub>
</p>
