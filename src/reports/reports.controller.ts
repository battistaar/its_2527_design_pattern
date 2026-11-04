import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { EventsRepository } from '../data/events.repository';
import { OrdersRepository } from '../data/orders.repository';
import { VenuesRepository } from '../data/venues.repository';
import { SeatInventory } from '../inventory/seat-inventory';

@Controller('events')
export class ReportsController {
  constructor(
    private readonly events: EventsRepository,
    private readonly venues: VenuesRepository,
    private readonly orders: OrdersRepository,
    private readonly inventory: SeatInventory
  ) {}

  @Get(':id/revenue')
  revenue(@Param('id') id: string) {
    const event = this.events.findById(id);
    if (!event) throw new NotFoundException('evento non trovato');
    const venue = this.venues.findById(event.venueId)!;
    const bySector: Record<string, number> = {};
    let tickets = 0;
    let total = 0;
    for (const o of this.orders.findByEvent(id)) {
      if (o.status !== 'paid') continue;
      for (const it of o.items) {
        const seat = venue.seats.find((s) => s.id === it.seatId)!;
        // NB: i posti in piedi si contano con la quantità, quelli numerati uno alla volta
        if (seat.kind === 'numbered') {
          tickets += 1;
        } else {
          tickets += it.quantity;
        }
        bySector[it.sector] = (bySector[it.sector] ?? 0) + it.lineTotal;
        total += it.lineTotal;
      }
    }
    for (const sector of Object.keys(bySector)) {
      bySector[sector] = Math.round(bySector[sector] * 100) / 100;
    }
    return {
      eventId: id,
      ticketsSold: tickets,
      soldFromInventory: this.inventory.soldCount(id),
      revenue: Math.round(total * 100) / 100,
      bySector,
    };
  }
}
