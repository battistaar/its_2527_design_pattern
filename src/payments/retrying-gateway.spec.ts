import { PaymentGateway, PaymentTimeoutError, Payment } from "./payment-gateway";
import { RetryingGateway } from "./retrying-gateway";

// Gateway finto: le prime `timeouts` chiamate vanno in timeout, poi risponde.
class FlakyGateway implements PaymentGateway {
    calls = 0;
    constructor(
        private readonly timeouts: number,
        private readonly error?: Error
    ) {}
    
    async charge(): Promise<Payment> {
        this.fail();
        return { id: 'p-1', approved: true };
    }
    
    async refund(): Promise<void> {
        this.fail();
    }
    
    private fail(): void {
        this.calls++;
        if (this.calls <= this.timeouts) throw this.error ? this.error : new PaymentTimeoutError();
    }
}

describe('RetryingGateway', () => {
    it("ritenta l'addebito dopo due timeout e restituisce il pagamento", async () => {
        const inner = new FlakyGateway(2);
        const payment = await new RetryingGateway(inner).charge(10, 'r', 'c');
        console.log(payment);
        expect(payment).toEqual({ id: 'p-1', approved: true });
        expect(inner.calls).toBe(3);
    });
    
    it("ritenta il rimborso fino a 3 volte, come l'addebito", async () => {
        const inner = new FlakyGateway(2);
        await new RetryingGateway(inner).refund('p-1', 10);
        expect(inner.calls).toBe(3);
    });
    
    it('dopo 3 timeout rilancia il timeout', async () => {
        const inner = new FlakyGateway(3);
        await expect(new RetryingGateway(inner).refund('p-1', 10)).rejects.toBeInstanceOf(PaymentTimeoutError);
        expect(inner.calls).toBe(3);
    });
    
    it('non ritenta gli errori che non sono timeout', async () => {
        const inner = new FlakyGateway(1, new Error('carta bloccata'));
        await expect(new RetryingGateway(inner).charge(10, 'r', 'c')).rejects.toThrow('carta bloccata');
        expect(inner.calls).toBe(1);
    });
});