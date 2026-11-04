import { PdfLite } from '../../vendor/pdf-lite';
import type { EventRecord, Ticket, Venue } from '../data/types';

export interface TicketRenderer {
  render(ticket: Ticket): string | Buffer;
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

// pdf-lite scrive solo latin1: niente simbolo dell'euro
export class PdfTicketRenderer implements TicketRenderer {
  constructor(
    private readonly event: EventRecord,
    private readonly venue: Venue,
  ) {}
  
  render(ticket: Ticket): Buffer {
    const place = ticket.row !== null ? `Fila ${ticket.row} Posto ${ticket.number}` : 'Posto unico';
    return new PdfLite()
    .text('TicketHub')
    .text(this.event.title)
    .text(`${this.venue.name}, ${this.venue.city}`)
    .text(this.event.date)
    .text(`Settore ${ticket.sector} - ${place}`)
    .text(`Intestato a ${ticket.holderName}`)
    .text(`EUR ${ticket.price.toFixed(2)}`)
    .text(`Codice: ${ticket.code}`)
    .toBuffer();
  }
}

// pass per il wallet del telefono, letto dall'app mobile
export class WalletTicketRenderer implements TicketRenderer {
  constructor(
    private readonly event: EventRecord,
    private readonly venue: Venue,
  ) {}
  
  render(ticket: Ticket): string {
    const place = ticket.row !== null ? `Fila ${ticket.row} Posto ${ticket.number}` : 'Posto unico';
    return JSON.stringify({
      eventTitle: this.event.title,
      venue: `${this.venue.name}, ${this.venue.city}`,
      date: this.event.date,
      seat: `${ticket.sector} ${place}`,
      holder: ticket.holderName,
      barcode: ticket.code,
    });
  }
}

// SMS per chi compra in cassa: al massimo 160 caratteri
export class QrTicketRenderer implements TicketRenderer {
  constructor(private readonly event: EventRecord) {}
  
  render(ticket: Ticket): string {
    return `TicketHub ${this.event.title.slice(0, 80)} ${this.event.date} ${ticket.code}`;
  }
}