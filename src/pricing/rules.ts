import { TicketsRepository } from "../data/tickets.repository";
import { round2 } from "../shared/money";
import { PriceContext, PricingRule } from "./pricing-rule";

export class StandardPricing implements PricingRule {
    unitPrice({ event, seat }: PriceContext): number {
        return event.sectorPrices[seat.sector];
    }
}

export class FlatPricing implements PricingRule {
    unitPrice({ event }: PriceContext): number {
        return event.flatPrice!;
    }
}

export class FreePricing implements PricingRule {
    unitPrice(): number {
        return 0;
    }
}

export class EarlyBirdPricing implements PricingRule {
    constructor(private readonly tickets: TicketsRepository) {}

    unitPrice({ event, seat, position }: PriceContext): number {
        const price = event.sectorPrices[seat.sector];
        
        const { tickets, discount } = event.earlyBird!;

        // controllo se il venduto è più di 500, applico prezzo intero o scontato
        const ticketNumber = this.tickets.countByEvent(event.id) + position;
        return ticketNumber <= tickets ? round2(price * (1 - discount)) : price;
    }
}