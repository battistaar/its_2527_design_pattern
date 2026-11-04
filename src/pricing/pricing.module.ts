import { Module } from "@nestjs/common";
import { DynamicPricing, EarlyBirdPricing, FlatPricing, FreePricing, StandardPricing } from "./rules";
import { PricingRuleRegistry } from "./pricing-rules-registry";
import { TicketsRepository } from "../data/tickets.repository";
import { VenuesRepository } from "../data/venues.repository";
@Module({
    providers: [
        {
            provide: PricingRuleRegistry,
            useFactory: (tickets, venues) => {
                const registry = new PricingRuleRegistry();
                registry.registerRule('standard', new StandardPricing());
                registry.registerRule('flat', new FlatPricing());
                registry.registerRule('free', new FreePricing());
                registry.registerRule('early_bird', new EarlyBirdPricing(tickets));
                registry.registerRule('dynamic', new DynamicPricing(venues))
                return registry;
            },
            inject: [TicketsRepository, VenuesRepository]
        }
    ],
    exports: [PricingRuleRegistry]
})
export class PricingModule { };