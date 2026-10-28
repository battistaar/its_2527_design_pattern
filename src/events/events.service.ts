import { Injectable } from '@nestjs/common';
import { EventsRepository } from '../data/events.repository';
import type { EventRecord } from '../data/types';
import { VenuesRepository } from '../data/venues.repository';
import { OrderPricer } from '../pricing/order-pricer';
import { PricingRuleRegistry } from '../pricing/pricing-rules-registry';

@Injectable()
export class EventsService {
  constructor(
    private readonly events: EventsRepository,
    private readonly venues: VenuesRepository,
    private readonly ruleRegistry: PricingRuleRegistry
  ) {}

  listOnSale(): EventRecord[] {
    return this.events.findAll().filter((e) => e.status === 'on_sale');
  }

  // prezzo "a partire da" mostrato in vetrina, commissione inclusa
  priceFrom(event: EventRecord): string {
    const venue = this.venues.findById(event.venueId)!;
    const rule = this.ruleRegistry.forEvent(event);
    return new OrderPricer(rule).priceFrom(event, venue.seats);
  }
}
