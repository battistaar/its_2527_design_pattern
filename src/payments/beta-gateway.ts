import type { BetaPayments } from '../../vendor/beta-pay';
import type { Payment, PaymentGateway } from './payment-gateway';

// Adapter: traduce PaymentGateway nelle chiamate dell'SDK BetaPayments (importi come stringhe "12.50").
export class BetaGateway implements PaymentGateway {
    constructor(private readonly client: BetaPayments) {}
    
    async charge(amount: number, reference: string, card: string): Promise<Payment> {
        const payment = await this.client.createPayment({
            amount: amount.toFixed(2),
            currencyCode: 'EUR',
            orderRef: reference,
            cardToken: card,
        });
        return { id: payment.id, approved: payment.outcome === 'APPROVED' };
    }
    
    async refund(paymentId: string, amount: number): Promise<void> {
        await this.client.reverse(paymentId, { amount: amount.toFixed(2) });
    }
}