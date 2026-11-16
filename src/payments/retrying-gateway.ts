import { Payment, PaymentGateway, PaymentTimeoutError } from "./payment-gateway";

const MAX_ATTEMPTS = 3;

export class RetryingGateway implements PaymentGateway {
    constructor(private readonly inner: PaymentGateway) {}

    async charge(amount: number, reference: string, card: string): Promise<Payment> {
        return this.retry(() => this.inner.charge(amount, reference, card));
    }

    async refund(paymentId: string, amount: number): Promise<void> {
        return this.retry(() => this.inner.refund(paymentId, amount));        
    }

    private async retry<T>(call: () => Promise<T>): Promise<T> {
        for (let attempt = 1; ; attempt++) {
            try {
                return await call();
            } catch (err) {
                if (!(err instanceof PaymentTimeoutError) || attempt === MAX_ATTEMPTS) {
                    throw err;
                }
            }
        }
    }

}
