# TicketHub

Biglietteria per concerti ed eventi. È il progetto su cui lavoriamo durante il corso di Design Pattern.

## Setup

Serve Node 24 (la versione è in `.nvmrc`).

```bash
nvm use
npm ci
npm test
npm run test:e2e
npm run start:dev
```

Poi apri http://localhost:3000/events.

## Come si lavora sui ticket

I ticket sono le issue del repository su GitHub, nella scheda Issues. All'apertura di una issue, crea un tuo ramo a partire da `develop`:

```bash
git switch develop && git pull && git switch -c <nome-del-ramo>
```

Il ramo resta sul tuo computer: non si pusha. Se durante il lavoro arriva una nuova issue che segue la precedente, continua sullo stesso ramo.

Fai commit spesso sul tuo ramo. A fine ticket la soluzione costruita in classe arriva su `develop` e il giro ricomincia.

## API

| Metodo | Percorso | Cosa fa |
|---|---|---|
| GET | `/health` | Controllo che l'app sia su |
| GET | `/events` | Eventi in vendita |
| GET | `/events/:id` | Dettaglio con disponibilità |
| GET | `/events/:id/revenue` | Incassi dell'evento |
| GET | `/venues/:id/map?eventId=` | Mappa dei posti con disponibilità |
| POST | `/orders` | Acquisto |
| GET | `/orders/:id` | Dettaglio dell'ordine con i biglietti |
| POST | `/orders/:id/cancel` | Annullamento con rimborso |
| GET | `/tickets/:id/download?format=html` | Biglietto in HTML (`format=text` per la stampante della cassa) |
| POST | `/payments/alpha/webhook` | Notifiche di AlphaPay |
| POST | `/gates/:gate/scan` | Lettura di un biglietto a un varco |
| POST | `/imports/promoter-a` | Import degli eventi dal promoter A (CSV) |
| POST | `/imports/promoter-b` | Import degli eventi dal promoter B (JSON) |

L'header `x-user-id` identifica l'utente. Gli utenti di prova sono in `src/data/seed.ts`.

Esempio di acquisto:

```bash
curl -X POST localhost:3000/orders -H 'content-type: application/json' -d '{"eventId":"e-1","seats":[{"seatId":"A-1-1"}],"card":"4242424242424242","holderName":"Giulia Rossi","email":"giulia@example.com"}'
```

## Carte di prova AlphaPay

| Carta | Esito |
|---|---|
| 4242424242424242 | Addebito riuscito |
| 4000000000000002 | Addebito rifiutato |
| 4000000000000119 | La prima chiamata va in timeout |

## Regole per l'AI

Le regole per gli assistenti AI sono in `AGENTS.md`. Se usi una chat generica, incolla prima il blocco di `docs/contesto-ai.md`.
