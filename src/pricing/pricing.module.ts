import { Module } from "@nestjs/common";
import { DynamicPricing, EarlyBirdPricing, FlatPricing, FreePricing, StandardPricing } from "./rules";
import { PricingRuleRegistry } from "./pricing-rules-registry";
import { TicketsRepository } from "../data/tickets.repository";
import { VenuesRepository } from "../data/venues.repository";
import { InventoryModule } from "../inventory/inventory.module";
import { SeatInventory } from "../inventory/seat-inventory";
@Module({
    imports: [InventoryModule],
    providers: [
        {
            provide: PricingRuleRegistry,
            useFactory: (tickets, venues, inventory) => {
                const registry = new PricingRuleRegistry();
                registry.registerRule('standard', new StandardPricing());
                registry.registerRule('flat', new FlatPricing());
                registry.registerRule('free', new FreePricing());
                registry.registerRule('early_bird', new EarlyBirdPricing(tickets));
                registry.registerRule('dynamic', new DynamicPricing(venues, inventory))
                return registry;
            },
            inject: [TicketsRepository, VenuesRepository, SeatInventory]
        }
    ],
    exports: [PricingRuleRegistry]
})
export class PricingModule { };