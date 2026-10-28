# Registro del debito tecnico

Ogni riga è un problema noto del codice. Si aggiunge quando lo si trova, si chiude quando un ticket lo ripaga.

## `src/orders/`

| # | Smell | Dove | Quale cambiamento rende costoso | Principio violato | Stato |
|---|---|---|---|---|---|
| 1 | Long Function | [orders.controller.ts:47-160](src/orders/orders.controller.ts#L47-L160) | Aggiungere un controllo antifrode all'acquisto obbliga a toccare un metodo da 110 righe | SRP | aperto |
| 2 | Large Class | [orders.controller.ts:36-44](src/orders/orders.controller.ts#L36-L44), [orders.controller.ts:47-213](src/orders/orders.controller.ts#L47-L213) | Cambiare prezzi, pagamenti, inventario o email riapre sempre lo stesso controller | SRP | aperto |
| 3 | Repeated Switches | [orders.controller.ts:63-70](src/orders/orders.controller.ts#L63-L70), [orders.controller.ts:89-94](src/orders/orders.controller.ts#L89-L94), [orders.controller.ts:131-135](src/orders/orders.controller.ts#L131-L135), [orders.controller.ts:199-203](src/orders/orders.controller.ts#L199-L203) | Un nuovo tipo di posto (es. tavolo) richiede quattro `if` su `seat.kind` da aggiornare | OCP | aperto |
| 4 | Switch Statements | [orders.controller.ts:73-86](src/orders/orders.controller.ts#L73-L86) | Aggiungere una tariffa early bird obbliga a modificare il controller degli ordini | OCP | aperto |
| 5 | Duplicated Code | [orders.controller.ts:87](src/orders/orders.controller.ts#L87), [orders.controller.ts:91](src/orders/orders.controller.ts#L91) | Cambiare la commissione dal 12% richiede due costanti da aggiornare, con risultati divergenti | SRP | aperto |
| 6 | Duplicated Code | [orders.controller.ts:102-126](src/orders/orders.controller.ts#L102-L126), [orders.controller.ts:177-194](src/orders/orders.controller.ts#L177-L194) | Cambiare la politica di retry o i log del pagamento richiede due cicli diversi da allineare | SRP | aperto |
| 7 | Insider Trading | [orders.controller.ts:104](src/orders/orders.controller.ts#L104), [orders.controller.ts:178](src/orders/orders.controller.ts#L178), [orders.controller.ts:14](src/orders/orders.controller.ts#L14) | Passare a un altro gateway di pagamento obbliga a riscrivere il controller degli ordini | DIP | aperto |
| 8 | Global Data | [orders.controller.ts:57](src/orders/orders.controller.ts#L57), [orders.controller.ts:196](src/orders/orders.controller.ts#L196) | Testare un ordine senza stato condiviso tra test diventa impossibile (da verificare: stato statico in SeatInventory) | DIP | aperto |
| 9 | Duplicated Code | [orders.controller.ts:129-136](src/orders/orders.controller.ts#L129-L136), [orders.controller.ts:197-204](src/orders/orders.controller.ts#L197-L204) | Aggiungere la prenotazione temporanea dei posti richiede due cicli sull'inventario da modificare | SRP | aperto |
| 10 | Primitive Obsession | [orders.controller.ts:26-32](src/orders/orders.controller.ts#L26-L32), [orders.controller.ts:110](src/orders/orders.controller.ts#L110), [orders.controller.ts:183](src/orders/orders.controller.ts#L183) | Gestire valute diverse dall'euro richiede di cercare ogni `number` e `* 100` sparso | SRP | aperto |
| 11 | Feature Envy | [orders.controller.ts:152-154](src/orders/orders.controller.ts#L152-L154), [orders.controller.ts:211](src/orders/orders.controller.ts#L211) | Cambiare il template delle email di conferma e rimborso obbliga a toccare il controller ordini | SRP | aperto |
| 12 | Mutable Data | [orders.controller.ts:205-210](src/orders/orders.controller.ts#L205-L210) | Aggiungere uno stato "rimborso parziale" richiede regole di transizione sparse nel controller (da verificare: tipi in data/types) | SRP | aperto |

## `src/events/` e `src/venues/`

| # | Smell | Dove | Quale cambiamento rende costoso | Principio violato | Stato |
|---|---|---|---|---|---|
| 13 | Duplicated Code | [events.controller.ts:42-50](src/events/events.controller.ts#L42-L50), [venues.controller.ts:44-52](src/venues/venues.controller.ts#L44-L52) | Un nuovo tipo di posto, ad esempio i tavoli, va gestito in due cicli di disponibilità | SRP | aperto |
| 14 | Repeated Switches | [events.controller.ts:43-49](src/events/events.controller.ts#L43-L49), [venues.controller.ts:44-52](src/venues/venues.controller.ts#L44-L52) | Un nuovo `kind` di posto richiede di aggiungere rami `if` in ogni controller | OCP | aperto |
| 15 | Duplicated Code | [events.controller.ts:10](src/events/events.controller.ts#L10), [events.controller.ts:32-35](src/events/events.controller.ts#L32-L35), [events.controller.ts:57](src/events/events.controller.ts#L57), [venues.controller.ts:17](src/venues/venues.controller.ts#L17), [venues.controller.ts:26-30](src/venues/venues.controller.ts#L26-L30), [venues.controller.ts:55](src/venues/venues.controller.ts#L55) | Cambiare la durata della cache o invalidarla dopo una vendita vuol dire toccare ogni controller | SRP | aperto |
| 16 | Global Data | [events.controller.ts:10](src/events/events.controller.ts#L10), [venues.controller.ts:17](src/venues/venues.controller.ts#L17) | Una cache statica resta condivisa tra i test e non si azzera con un'istanza nuova | DIP | aperto |
| 17 | Global Data | [events.controller.ts:39](src/events/events.controller.ts#L39), [venues.controller.ts:37](src/venues/venues.controller.ts#L37) | `SeatInventory.getInstance()` non si sostituisce nei test e salta la DI (da verificare: seat-inventory.ts) | DIP | aperto |
| 18 | Feature Envy | [events.controller.ts:36-50](src/events/events.controller.ts#L36-L50), [venues.controller.ts:31-53](src/venues/venues.controller.ts#L31-L53) | Il calcolo di disponibilità e mappa vive nei controller, quindi non lo riusano gli ordini né i report | SRP | aperto |
| 19 | Duplicated Code | [events.controller.ts:24-25](src/events/events.controller.ts#L24-L25) | Il locale si cerca due volte per evento, e un `venueId` errato manda in errore l'elenco | SRP | aperto |
| 20 | Repeated Switches | [events.service.ts:16-26](src/events/events.service.ts#L16-L26) | Un nuovo `pricingType` va aggiunto qui e negli altri calcoli di prezzo (da verificare: orders) | OCP | aperto |
| 21 | Magic Number | [events.service.ts:27](src/events/events.service.ts#L27) | Cambiare la commissione del 12% vuol dire cercare ogni `1.12` nel codice (da verificare: altri moduli) | SRP | aperto |
| 22 | Primitive Obsession | [events.service.ts:14](src/events/events.service.ts#L14), [events.service.ts:27](src/events/events.service.ts#L27) | Il prezzo come `number` e poi `string` lascia gli arrotondamenti dei centesimi a ogni chiamante | SRP | aperto |
| 23 | Primitive Obsession | [venues.controller.ts:8](src/venues/venues.controller.ts#L8), [venues.controller.ts:48](src/venues/venues.controller.ts#L48), [events.controller.ts:47-48](src/events/events.controller.ts#L47-L48) | I campi opzionali con `!` (`row`, `number`, `capacity`) nascondono gli errori sui dati dei posti | LSP | aperto |

## `src/tickets/`

| # | Smell | Dove | Quale cambiamento rende costoso | Principio violato | Stato |
|---|---|---|---|---|---|
| 24 | Repeated Switches | [tickets.controller.ts:25-38](src/tickets/tickets.controller.ts#L25-L38), [tickets.service.ts:52-59](src/tickets/tickets.service.ts#L52-L59) | Aggiungere il formato PDF richiede di toccare due switch e il controller | OCP | aperto |
| 25 | Duplicated Code | [tickets.controller.ts:18-21](src/tickets/tickets.controller.ts#L18-L21), [tickets.service.ts:50-51](src/tickets/tickets.service.ts#L50-L51) | Cambiare come si risale a evento e locale va fatto in due punti | SRP | aperto |
| 26 | Duplicated Code | [renderers.ts:3-23](src/tickets/renderers.ts#L3-L23), [renderers.ts:26-45](src/tickets/renderers.ts#L26-L45) | Aggiungere un campo al biglietto, ad esempio il varco, richiede due renderer da aggiornare | SRP | aperto |
| 27 | Alternative Classes with Different Interfaces | [renderers.ts:9](src/tickets/renderers.ts#L9), [renderers.ts:32](src/tickets/renderers.ts#L32) | Un nuovo renderer non è intercambiabile: `render` e `print` costringono a uno switch | LSP | aperto |
| 28 | Insider Trading | [tickets.controller.ts:10-14](src/tickets/tickets.controller.ts#L10-L14), [tickets.controller.ts:27](src/tickets/tickets.controller.ts#L27), [tickets.controller.ts:32](src/tickets/tickets.controller.ts#L32) | Cambiare la generazione del biglietto obbliga a modificare il controller, che salta il service | DIP | aperto |
| 29 | Primitive Obsession | [tickets.service.ts:9-13](src/tickets/tickets.service.ts#L9-L13), [tickets.service.ts:39](src/tickets/tickets.service.ts#L39) | Cambiare il formato del codice letto ai varchi richiede di cercare le stringhe `TH\|` (da verificare: modulo gates) | SRP | aperto |
| 30 | Primitive Obsession | [tickets.service.ts:35-36](src/tickets/tickets.service.ts#L35-L36), [renderers.ts:10](src/tickets/renderers.ts#L10), [renderers.ts:33](src/tickets/renderers.ts#L33) | Un nuovo tipo di posto, ad esempio palco, richiede controlli `kind`/`row` sparsi | OCP | aperto |
| 31 | Speculative Generality | [tickets.service.ts:62-65](src/tickets/tickets.service.ts#L62-L65) | Codice QR commentato confonde chi aggiunge un formato e diverge dal codice reale | SRP | aperto |

## `src/payments/` e `src/reports/`

| # | Smell | Dove | Quale cambiamento rende costoso | Principio violato | Stato |
|---|---|---|---|---|---|
| 32 | Divergent Change | [alpha-webhook.controller.ts:13-33](src/payments/alpha-webhook.controller.ts#L13-L33) | Gestire un nuovo evento di Alpha tocca controller, ordini e biglietti insieme | SRP | aperto |
| 33 | Repeated Switches | [alpha-webhook.controller.ts:22-30](src/payments/alpha-webhook.controller.ts#L22-L30) | Aggiungere `charge.captured` o un altro tipo richiede un nuovo ramo else-if | OCP | aperto |
| 34 | Feature Envy | [alpha-webhook.controller.ts:23-27](src/payments/alpha-webhook.controller.ts#L23-L27) | Una nuova regola sul rimborso va duplicata ovunque si cambia stato a ordini e biglietti | SRP | aperto |
| 35 | Global Data | [alpha-webhook.controller.ts:16](src/payments/alpha-webhook.controller.ts#L16) | Ruotare il segreto o testare la firma richiede di manipolare `process.env`, con fallback hardcoded | DIP | aperto |
| 36 | Insider Trading | [alpha-webhook.controller.ts:2](src/payments/alpha-webhook.controller.ts#L2), [alpha-webhook.controller.ts:15-17](src/payments/alpha-webhook.controller.ts#L15-L17) | Aggiungere un secondo gateway di pagamento impone un controller copiato legato all'SDK | DIP | aperto |
| 37 | Long Function | [reports.controller.ts:15-47](src/reports/reports.controller.ts#L15-L47) | Aggiungere un nuovo indicatore al report allunga ancora il metodo nel controller | SRP | aperto |
| 38 | Feature Envy | [reports.controller.ts:26-32](src/reports/reports.controller.ts#L26-L32) | Un nuovo tipo di posto obbliga a cambiare il conteggio biglietti nel report (da verificare: altri conteggi simili) | OCP | aperto |
| 39 | Duplicated Code | [reports.controller.ts:38](src/reports/reports.controller.ts#L38), [reports.controller.ts:44](src/reports/reports.controller.ts#L44) | Cambiare la regola di arrotondamento degli importi va fatto in più punti | SRP | aperto |
| 40 | Global Data | [reports.controller.ts:5](src/reports/reports.controller.ts#L5), [reports.controller.ts:43](src/reports/reports.controller.ts#L43) | Sostituire l'inventario o isolarlo nei test è impossibile con lo stato statico dietro `getInstance()` | DIP | aperto |
| 41 | Primitive Obsession | [reports.controller.ts:24](src/reports/reports.controller.ts#L24), [alpha-webhook.controller.ts:23](src/payments/alpha-webhook.controller.ts#L23), [alpha-webhook.controller.ts:29](src/payments/alpha-webhook.controller.ts#L29) | Aggiungere uno stato ordine obbliga a cercare le stringhe ovunque (da verificare: altri moduli) | OCP | aperto |

## `src/gates/`

| # | Smell | Dove | Quale cambiamento rende costoso | Principio violato | Stato |
|---|---|---|---|---|---|
| 42 | Primitive Obsession | [gates.service.ts:27-28](src/gates/gates.service.ts#L27-L28) | Cambiare il formato del codice biglietto `TH\|id\|checksum` obbliga a toccare il parsing nei varchi (da verificare: altri parser in tickets) | SRP | aperto |
| 43 | Divergent Change | [gates.service.ts:26-50](src/gates/gates.service.ts#L26-L50) | Una nuova regola d'ingresso tocca lo stesso metodo che parla con l'SDK tornelli e logga | SRP | aperto |
| 44 | Repeated Switches | [gates.service.ts:34-45](src/gates/gates.service.ts#L34-L45) | Aggiungere uno stato del biglietto (es. rimborsato) richiede un nuovo ramo qui e altrove (da verificare: altri moduli) | OCP | aperto |
| 45 | Inappropriate Intimacy | [gates.service.ts:11](src/gates/gates.service.ts#L11), [gates.service.ts:28](src/gates/gates.service.ts#L28) | Cambiare il calcolo del checksum in tickets rompe i varchi senza che il tipo lo segnali | DIP | aperto |
| 46 | Feature Envy | [gates.service.ts:38-47](src/gates/gates.service.ts#L38-L47) | Cambiare le regole di validazione del biglietto impone modifiche nel service dei varchi, non nel biglietto | SRP | aperto |
| 47 | Global Data | [gates.service.ts:20-22](src/gates/gates.service.ts#L20-L22) | Aprire un evento in un altro locale o con altri varchi richiede modificare il codice | OCP | aperto |
| 48 | Insider Trading | [gates.service.ts:15](src/gates/gates.service.ts#L15), [gates.service.ts:20](src/gates/gates.service.ts#L20), [gates.controller.ts:2](src/gates/gates.controller.ts#L2), [gates.controller.ts:11](src/gates/gates.controller.ts#L11) | Cambiare fornitore dei tornelli tocca service, controller e risposta HTTP; nei test il Gatekeeper non è sostituibile | DIP | aperto |
| 49 | Duplicated Code | [gates.service.ts:29](src/gates/gates.service.ts#L29), [gates.service.ts:48](src/gates/gates.service.ts#L48) | Passare a un logger strutturato o a un audit degli ingressi richiede cercare ogni `console.log` | DIP | aperto |
| 50 | Temporal Coupling | [gates.service.ts:52-55](src/gates/gates.service.ts#L52-L55) | Rendere asincrona la decisione del tornello rompe `scan`, che legge `lastDecision` subito dopo `simulate` | LSP | aperto |

## `src/imports/`

| # | Smell | Dove | Quale cambiamento rende costoso | Principio violato | Stato |
|---|---|---|---|---|---|
| 51 | Duplicated Code | [imports.service.ts:33-40](src/imports/imports.service.ts#L33-L40), [imports.service.ts:74-81](src/imports/imports.service.ts#L74-L81), [imports.service.ts:41-44](src/imports/imports.service.ts#L41-L44), [imports.service.ts:82](src/imports/imports.service.ts#L82) | Una nuova regola di validazione va copiata per ogni promoter, e B salta già il controllo del locale | SRP | aperto |
| 52 | Duplicated Code | [imports.service.ts:45-56](src/imports/imports.service.ts#L45-L56), [imports.service.ts:83-94](src/imports/imports.service.ts#L83-L94) | Un campo nuovo su `EventRecord` importato va aggiunto in ogni blocco `save` | SRP | aperto |
| 53 | Divergent Change | [imports.service.ts:17-97](src/imports/imports.service.ts#L17-L97), [imports.controller.ts:8-16](src/imports/imports.controller.ts#L8-L16) | Un terzo promoter richiede nuovo metodo nel service e nuovo endpoint nel controller | OCP | aperto |
| 54 | Long Function | [imports.service.ts:17-59](src/imports/imports.service.ts#L17-L59), [imports.service.ts:61-97](src/imports/imports.service.ts#L61-L97) | Cambiare il formato CSV o JSON obbliga a toccare anche validazione e salvataggio | SRP | aperto |
| 55 | Primitive Obsession | [imports.service.ts:21-31](src/imports/imports.service.ts#L21-L31) | Una colonna in più nel CSV sposta gli indici `cols[n]` letti a mano | SRP | aperto |
| 56 | Primitive Obsession | [imports.service.ts:24-26](src/imports/imports.service.ts#L24-L26), [imports.service.ts:68](src/imports/imports.service.ts#L68) | Gestire il fuso orario del promoter richiede cambiare due conversioni di data diverse | SRP | aperto |
| 57 | Primitive Obsession | [imports.service.ts:46](src/imports/imports.service.ts#L46), [imports.service.ts:50-51](src/imports/imports.service.ts#L50-L51), [imports.service.ts:84](src/imports/imports.service.ts#L84), [imports.service.ts:88-89](src/imports/imports.service.ts#L88-L89) | Assegnare un promoter a un altro organizzatore richiede modificare stringhe cablate nel codice | OCP | aperto |
| 58 | Global Data | [imports.service.ts:37](src/imports/imports.service.ts#L37), [imports.service.ts:78](src/imports/imports.service.ts#L78) | Testare l'import di date al limite dipende dall'orologio reale via `Date.now()` | DIP | aperto |
