import { EventRecord, PricingType, Seat } from "../data/types";

export interface PriceContext {
    event: EventRecord;
    seat: Seat;
    position: number;
}

export interface PricingRule {
    unitPrice(ctx: PriceContext): number;
}