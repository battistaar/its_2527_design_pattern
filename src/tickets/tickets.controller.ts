import { BadRequestException, Controller, Get, NotFoundException, Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { EventsRepository } from '../data/events.repository';
import { TicketsRepository } from '../data/tickets.repository';
import { VenuesRepository } from '../data/venues.repository';
import { HtmlTicketRenderer, TextTicketRenderer } from './renderers';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly tickets: TicketsRepository,
    private readonly events: EventsRepository,
    private readonly venues: VenuesRepository,
  ) {}

  @Get(':id/download')
  download(@Param('id') id: string, @Query('format') format: string = 'html', @Res() res: Response) {
    const ticket = this.tickets.findById(id);
    if (!ticket) throw new NotFoundException('biglietto non trovato');
    const event = this.events.findById(ticket.eventId)!;
    const venue = this.venues.findById(this.events.findById(ticket.eventId)!.venueId)!;
    let body: string;
    let contentType: string;
    let extension: string;
    switch (format) {
      case 'html':
        body = new HtmlTicketRenderer(event, venue).render(ticket);
        contentType = 'text/html; charset=utf-8';
        extension = 'html';
        break;
      case 'text':
        body = new TextTicketRenderer(event, venue).render(ticket);
        contentType = 'text/plain; charset=utf-8';
        extension = 'txt';
        break;
      default:
        throw new BadRequestException('formato non supportato: ' + format);
    }
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="biglietto-${ticket.id}.${extension}"`);
    res.send(body);
  }
}
