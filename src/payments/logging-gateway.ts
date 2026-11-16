import { Payment, PaymentGateway } from "./payment-gateway";

export class LoggingGateway implements PaymentGateway {
    constructor(
        private readonly inner: PaymentGateway,
        private readonly log: (line: string) => void = console.log
    ) {}

    charge(amount: number, reference: string, card: string): Promise<Payment> {
        // esempio
        this.log('test');
        throw new Error("Method not implemented.");
    }
    refund(paymentId: string, amount: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

}