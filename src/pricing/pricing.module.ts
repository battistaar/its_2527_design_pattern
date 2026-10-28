import { Module } from "@nestjs/common";
import { FlatPricing, FreePricing, StandardPricing } from "./rules";
import { PricingRuleRegistry } from "./pricing-rules-registry";
@Module({
    providers: [
        {
            provide: PricingRuleRegistry,
            useFactory: () => {
                const registry = new PricingRuleRegistry();
                registry.registerRule('standard', new StandardPricing());
                registry.registerRule('flat', new FlatPricing());
                registry.registerRule('free', new FreePricing());
                return registry;
            }
        }
    ],
    exports: [PricingRuleRegistry]
})
export class PricingModule { };