export interface Payment {
    id: string;
    approved: boolean;
}

export interface PaymentGateway {
    charge(amount: number, reference: string, card: string): Promise<Payment>;
    refund(paymentId: string, amount: number): Promise<void>;
}

export class PaymentTimeoutError extends Error {
    constructor() {
        super('timeout payment service');
        this.name = 'PaymentTimeoutError';
    }
}

export const PAYMENT_GATEWAY = 'PAYMENT_GATEWAY';