import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EventsRepository } from '../data/events.repository';
import { TicketsRepository } from '../data/tickets.repository';
import type { Order, Ticket, Venue } from '../data/types';
import { VenuesRepository } from '../data/venues.repository';
import { round2 } from '../shared/money';
import { HtmlTicketRenderer, TextTicketRenderer } from './renderers';
import { TICKET_FORMATS, TicketFile, TicketFormat, type TicketFormats } from './ticket-formats';

export function checksum(id: string): string {
  let sum = 0;
  for (const ch of id) sum += ch.charCodeAt(0);
  return String(sum % 97).padStart(2, '0');
}



@Injectable()
export class TicketsService {
  constructor(
    private readonly tickets: TicketsRepository,
    private readonly events: EventsRepository,
    private readonly venues: VenuesRepository,
    @Inject(TICKET_FORMATS) private readonly formats: TicketFormats
  ) {}

  createForOrder(order: Order, venue: Venue): Ticket[] {
    const created: Ticket[] = [];
    for (const item of order.items) {
      const seat = venue.seats.find((s) => s.id === item.seatId)!;
      for (let i = 0; i < item.quantity; i++) {
        const id = this.tickets.nextId();
        const ticket: Ticket = {
          id,
          orderId: order.id,
          eventId: order.eventId,
          seatId: seat.id,
          sector: seat.sector,
          row: seat.kind === 'numbered' ? seat.row! : null,
          number: seat.kind === 'numbered' ? seat.number! : null,
          holderName: order.holderName,
          price: round2(item.unitPrice + item.fee),
          code: `TH|${id}|${checksum(id)}`,
          status: 'valid',
        };
        this.tickets.save(ticket);
        created.push(ticket);
      }
    }
    return created;
  }

  render(ticket: Ticket, format: string): string {
    return this.download(ticket, format).body.toString();
  }
  
  download(ticket: Ticket, format: string): TicketFile {
    const ticketFormat = this.formats[format];
    if (!ticketFormat) {
      throw new BadRequestException('formato non supportato');
    }
    const event = this.events.findById(ticket.eventId)!;
    const venue = this.venues.findById(event.venueId)!;
    return ticketFormat.produce(ticket, event, venue);
  }

  // vecchia versione con il QR, tenuta nel caso tornasse utile
  // renderQr(ticket: Ticket): string {
  //   return qr.encode(ticket.code, { size: 200 });
  // }
}
