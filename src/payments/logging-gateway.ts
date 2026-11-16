import type { Payment, PaymentGateway } from './payment-gateway';

// Decorator: avvolge un PaymentGateway qualunque e scrive nel log richiesta, esito e durata.
export class LoggingGateway implements PaymentGateway {
    constructor(
        private readonly inner: PaymentGateway,
        private readonly log: (line: string) => void = console.log,
    ) {}
    
    charge(amount: number, reference: string, card: string): Promise<Payment> {
        this.log(`[pagamenti] addebito ${amount} ${reference}`);
        return this.timed(
            'addebito',
            () => this.inner.charge(amount, reference, card),
            (p) => `${p.approved ? 'approvato' : 'rifiutato'} ${p.id}`,
        );
    }
    
    refund(paymentId: string, amount: number): Promise<void> {
        this.log(`[pagamenti] rimborso ${amount} ${paymentId}`);
        return this.timed('rimborso', () => this.inner.refund(paymentId, amount), () => 'ok');
    }
    
    private async timed<T>(operation: string, call: () => Promise<T>, outcome: (result: T) => string): Promise<T> {
        const start = Date.now();
        try {
            const result = await call();
            this.log(`[pagamenti] ${operation} ${outcome(result)} in ${Date.now() - start} ms`);
            return result;
        } catch (err) {
            const name = err instanceof Error ? err.name : 'errore';
            this.log(`[pagamenti] ${operation} errore ${name} in ${Date.now() - start} ms`);
            throw err;
        }
    }
}