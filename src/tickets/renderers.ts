import type { EventRecord, Ticket, Venue } from '../data/types';

export interface TicketRenderer {
  render(ticket: Ticket): string;
}

export class HtmlTicketRenderer implements TicketRenderer {
  constructor(
    private readonly event: EventRecord,
    private readonly venue: Venue,
  ) {}

  render(ticket: Ticket): string {
    const place = ticket.row !== null ? `Fila ${ticket.row} Posto ${ticket.number}` : 'Posto unico';
    return [
      '<html><body>',
      `<h1>${this.event.title}</h1>`,
      `<p>${this.venue.name}, ${this.venue.city}</p>`,
      `<p>${this.event.date}</p>`,
      `<p>Settore ${ticket.sector} - ${place}</p>`,
      `<p>Intestato a ${ticket.holderName}</p>`,
      `<p>Prezzo € ${ticket.price.toFixed(2)}</p>`,
      `<p>Codice: ${ticket.code}</p>`,
      '</body></html>',
    ].join('');
  }
}

// usato dalla stampante termica della cassa
export class TextTicketRenderer implements TicketRenderer {
  constructor(
    private readonly event: EventRecord,
    private readonly venue: Venue,
  ) {}

  render(ticket: Ticket): string {
    const place = ticket.row !== null ? `FILA ${ticket.row} POSTO ${ticket.number}` : 'POSTO UNICO';
    return [
      'TICKETHUB',
      this.event.title.toUpperCase(),
      `${this.venue.name} - ${this.venue.city}`,
      this.event.date,
      `SETTORE ${ticket.sector} ${place}`,
      `INTESTATARIO: ${ticket.holderName}`,
      `EUR ${ticket.price.toFixed(2)}`,
      ticket.code,
    ].join('\n');
  }
}
