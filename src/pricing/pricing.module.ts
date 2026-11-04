import { Module } from "@nestjs/common";
import { EarlyBirdPricing, FlatPricing, FreePricing, StandardPricing } from "./rules";
import { PricingRuleRegistry } from "./pricing-rules-registry";
import { TicketsRepository } from "../data/tickets.repository";
@Module({
    providers: [
        {
            provide: PricingRuleRegistry,
            useFactory: (tickets) => {
                const registry = new PricingRuleRegistry();
                registry.registerRule('standard', new StandardPricing());
                registry.registerRule('flat', new FlatPricing());
                registry.registerRule('free', new FreePricing());
                registry.registerRule('early_bird', new EarlyBirdPricing(tickets));
                return registry;
            },
            inject: [TicketsRepository]
        }
    ],
    exports: [PricingRuleRegistry]
})
export class PricingModule { };