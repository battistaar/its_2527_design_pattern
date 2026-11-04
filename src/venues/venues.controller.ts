import { BadRequestException, Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { EventsRepository } from '../data/events.repository';
import { VenuesRepository } from '../data/venues.repository';
import { SeatInventory } from '../inventory/seat-inventory';

interface SectorMap {
  sector: string;
  kind: string;
  total: number;
  free: number;
  seats: { id: string; row: number; number: number; free: boolean }[];
}

@Controller('venues')
export class VenuesController {
  // cache per non ricalcolare la mappa a ogni richiesta
  private static cache = new Map<string, { at: number; data: unknown }>();

  constructor(
    private readonly venues: VenuesRepository,
    private readonly events: EventsRepository,
    private readonly inventory: SeatInventory
  ) {}

  @Get(':id/map')
  map(@Param('id') id: string, @Query('eventId') eventId: string) {
    const key = id + ':' + eventId;
    const cached = VenuesController.cache.get(key);
    if (cached && Date.now() - cached.at < 2000) {
      return cached.data;
    }
    const venue = this.venues.findById(id);
    if (!venue) throw new NotFoundException('locale non trovato');
    const event = this.events.findById(eventId);
    if (!event || event.venueId !== venue.id) {
      throw new BadRequestException('evento non valido per questo locale');
    }
    
    const sectors: Record<string, SectorMap> = {};
    for (const s of venue.seats) {
      if (!sectors[s.sector]) {
        sectors[s.sector] = { sector: s.sector, kind: s.kind, total: 0, free: 0, seats: [] };
      }
      const sec = sectors[s.sector];
      if (s.kind === 'numbered') {
        const isFree = !this.inventory.isSold(event.id, s.id);
        sec.total += 1;
        if (isFree) sec.free += 1;
        sec.seats.push({ id: s.id, row: s.row!, number: s.number!, free: isFree });
      } else if (s.kind === 'standing') {
        sec.total += s.capacity!;
        sec.free += s.capacity! - this.inventory.standingSold(event.id, s.id);
      }
    }
    const data = { venueId: venue.id, eventId: event.id, sectors: Object.values(sectors) };
    VenuesController.cache.set(key, { at: Date.now(), data });
    return data;
  }
}
