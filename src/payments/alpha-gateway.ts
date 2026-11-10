import { AlphaPayClient, AlphaTimeoutError } from "../../vendor/alpha-pay";
import { Payment, PaymentGateway, PaymentTimeoutError } from "./payment-gateway";

export class AlphaGateway implements PaymentGateway {
    constructor(private readonly client: AlphaPayClient) {}

    async charge(amount: number, reference: string, card: string): Promise<Payment> {
        try {
            const charge = await this.client.charge({
                amountCents: Math.round(amount * 100),
                currency: 'EUR',
                reference,
                card: card,
            });

            return { id: charge.chargeId, approved: charge.status === 'succeeded' };
        } catch (err) {
            if (err instanceof AlphaTimeoutError) {
                throw new PaymentTimeoutError();
            }
            throw err;
        }
    }


    async refund(paymentId: string, amount: number): Promise<void> {
        try {
            await this.client.refund(paymentId, Math.round(amount * 100));
        } catch (err) {
            if (err instanceof AlphaTimeoutError) {
                throw new PaymentTimeoutError();
            }
            throw err;
        }
    }
    
}