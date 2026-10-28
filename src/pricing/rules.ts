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