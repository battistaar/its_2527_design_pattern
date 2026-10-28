import { BadRequestException } from '@nestjs/common';
import { PricingRule } from './pricing-rule';
import { EventRecord, PricingType } from "../data/types";

export class PricingRuleRegistry {
    private readonly rules = new Map<PricingType, PricingRule>();

    registerRule(type: PricingType, rule: PricingRule): void {
        this.rules.set(type, rule);
    }

    forEvent(event: EventRecord): PricingRule {
        const rule = this.rules.get(event.pricingType);
        if (!rule) {
            throw new BadRequestException(`tipo di prezzo non gestito: ${event.pricingType}`);
        }
        return rule;
    }
}