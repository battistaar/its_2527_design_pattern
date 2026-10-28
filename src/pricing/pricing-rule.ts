import { EventRecord, PricingType, Seat } from "../data/types";

export interface PriceContext {
    event: EventRecord;
    seat: Seat;
}

export interface PricingRule {
    unitPrice(ctx: PriceContext): number;
}

export const PRICING_RULES = 'PRICING_RULES';

export type PricingRuleMap = Record<PricingType, PricingRule>;