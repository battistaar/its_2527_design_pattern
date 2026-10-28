# TicketHub: istruzioni per gli assistenti AI

## Il progetto

TicketHub vende biglietti per concerti ed eventi. È un'applicazione NestJS 12 su Express in CommonJS, scritta in TypeScript, senza database: i dati stanno in repository in memoria e ripartono dal seed a ogni avvio.

Il codice ha qualche anno e diversi problemi noti, elencati in `DEBITO.md`. Le regole qui sotto valgono per il codice nuovo e per quello che si modifica. Il resto si sistema un ticket alla volta.

## Glossario

| Termine | Significato |
|---|---|
| Evento | Concerto o spettacolo in una data e in un locale (`EventRecord`) |
| Locale | Il luogo dell'evento, con la sua mappa dei posti (`Venue`) |
| Settore | Gruppo di posti con lo stesso prezzo, per esempio `A`, `PLATEA`, `PIT` |
| Posto numerato | Posto con fila e numero, si vende una volta sola |
| Posto in piedi | Settore con una capienza, si vende a quantità |
| Ordine | Un acquisto: uno o più posti e un pagamento |
| Biglietto | Un ingresso, con il codice che si legge ai varchi |
| Varco | Tornello d'ingresso |
| Promoter | Organizzazione esterna che manda gli eventi da importare |
| Commissione | Il 12% aggiunto al prezzo del biglietto |

## Comandi

| Comando | Cosa fa |
|---|---|
| `npm run start:dev` | Avvia l'app in watch su http://localhost:3000 |
| `npm test` | Test unitari con Jest (`src/**/*.spec.ts`) |
| `npm run test:e2e` | Test e2e con Jest e supertest (`test/**/*.e2e-spec.ts`) |
| `npm run typecheck` | Controllo dei tipi su tutto il progetto, test compresi |
| `npm run lint` | oxlint |
| `npm run build` | Compila in `dist/` |

## Struttura

- `src/<modulo>/`: un modulo NestJS per area (events, venues, orders, tickets, payments, gates, imports, reports, notifications).
- `src/data/`: tipi del dominio, seed e repository in memoria.
- `vendor/`: SDK dei fornitori esterni (pagamenti, tornelli, feed dei promoter). Non si modifica. Se un SDK non fa quello che serve, si scrive codice nostro attorno.
- `test/`: test e2e.
- `DEBITO.md`: il registro dei problemi noti del codice.

## Convenzioni

- Identificatori in inglese. Messaggi d'errore, commenti e messaggi di commit in italiano.
- Interfacce e alias di tipo presi da altri file si importano con `import type`, altrimenti i file con `@Controller` o `@Injectable` non compilano.
- Le classi che arrivano dal costruttore (service, repository) si importano con un import normale. Con `import type` la DI di Nest non le trova, e l'errore compare solo all'avvio.
- Le dipendenze arrivano dal costruttore tramite la DI di NestJS. Nel codice nuovo niente `new` su service e repository.
- Ogni modulo dichiara in `providers` quello che offre e in `exports` quello che altri moduli possono usare.

## Come si lavora

- TDD: prima un test che fallisce, poi il codice minimo per farlo passare, poi il refactoring con i test verdi.
- Commit piccoli: ogni commit lascia verdi `npm test` e `npm run test:e2e`.
- Lo scope è la issue GitHub su cui si lavora. Se non hai il testo, chiedilo o leggilo con `gh issue view <numero>`. Niente refactoring del codice che il ticket non tocca: se trovi un problema fuori scope, aggiungi una riga a `DEBITO.md` e vai avanti.
- Niente astrazioni che il ticket non richiede. Un'interfaccia con una sola implementazione deve avere un motivo scritto nel ticket.
- Niente dipendenze npm nuove senza chiedere.
- I test esistenti non si modificano per farli passare. Se un test descrive un comportamento che il ticket chiede di cambiare, dillo esplicitamente.
- Prima di dichiarare finito un lavoro devono passare `npm test`, `npm run test:e2e`, `npm run typecheck`, `npm run lint` e `npm run build`.
