import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { EventsRepository } from '../data/events.repository';
import { VenuesRepository } from '../data/venues.repository';
import { SeatInventory } from '../inventory/seat-inventory';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  // cache per non ricalcolare la disponibilità a ogni richiesta
  private static cache = new Map<string, { at: number; data: unknown }>();

  constructor(
    private readonly eventsService: EventsService,
    private readonly events: EventsRepository,
    private readonly venues: VenuesRepository,
    private readonly inventory: SeatInventory
  ) {}

  @Get()
  list() {
    return this.eventsService.listOnSale().map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      venue: this.venues.findById(e.venueId)!.name,
      city: this.venues.findById(e.venueId)!.city,
      priceFrom: this.eventsService.priceFrom(e),
    }));
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    const cached = EventsController.cache.get(id);
    if (cached && Date.now() - cached.at < 2000) {
      return cached.data;
    }
    const event = this.events.findById(id);
    if (!event) throw new NotFoundException('evento non trovato');
    const venue = this.venues.findById(event.venueId)!;

    let total = 0;
    let free = 0;
    for (const s of venue.seats) {
      if (s.kind === 'numbered') {
        total += 1;
        if (!this.inventory.isSold(event.id, s.id)) free += 1;
      } else if (s.kind === 'standing') {
        total += s.capacity!;
        free += s.capacity! - this.inventory.standingSold(event.id, s.id);
      }
    }
    const data = {
      ...event,
      venue: { id: venue.id, name: venue.name, city: venue.city },
      priceFrom: this.eventsService.priceFrom(event),
      availability: { total, free },
    };
    EventsController.cache.set(id, { at: Date.now(), data });
    return data;
  }
}
