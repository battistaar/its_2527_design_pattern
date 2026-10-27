# Contesto da incollare in una chat AI

Se usi un assistente che non legge `AGENTS.md` (una chat nel browser, per esempio), copia il blocco qui sotto all'inizio della conversazione. Poi incolla il testo della issue e i file su cui stai lavorando.

```text
Sto lavorando a TicketHub, un'app NestJS 12 su Express in TypeScript, generata con la CLI di NestJS in modalità CommonJS: import senza estensione, test con Jest e supertest. Vende biglietti per eventi: eventi, locali con posti numerati e in piedi, ordini, pagamenti, biglietti, varchi d'ingresso, import degli eventi dai promoter. Non c'è database, i dati stanno in repository in memoria.

Regole:
- lavoro in TDD: prima il test che fallisce, poi il codice minimo, poi il refactoring;
- la cartella vendor/ contiene SDK esterni e non si modifica;
- le dipendenze arrivano dal costruttore tramite la DI di NestJS, niente new su service e repository;
- resta nello scope della issue che ti incollo: se vedi altri problemi elencali a parte, non correggerli;
- niente astrazioni che il ticket non richiede, niente dipendenze npm nuove;
- identificatori in inglese, commenti e messaggi in italiano;
- rispondi in italiano e mostra il contenuto completo dei file che cambi.
```
