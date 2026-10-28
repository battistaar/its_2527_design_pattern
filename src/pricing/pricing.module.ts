import { Module } from "@nestjs/common";
import { FlatPricing, FreePricing, StandardPricing } from "./rules";
import { PRICING_RULES, PricingRuleMap } from "./pricing-rule";

const rules: PricingRuleMap = {
    standard: new StandardPricing(),
    flat: new FlatPricing(),
    free: new FreePricing()
}

@Module({
    providers: [
        {
            provide: PRICING_RULES,
            useValue: rules
        }
    ],
    exports: [PRICING_RULES]
})
export class PricingModule { };