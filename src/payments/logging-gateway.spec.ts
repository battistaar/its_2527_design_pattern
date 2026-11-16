import { LoggingGateway } from "./logging-gateway";
import { PaymentGateway, Payment, PaymentTimeoutError } from "./payment-gateway";
import { RetryingGateway } from "./retrying-gateway";

// Gateway finto: la prima chiamata va in timeout se `slowFirst`, poi approva o rifiuta.
class FakeGateway implements PaymentGateway {
    private calls = 0;
    constructor(private readonly options: { approved?: boolean; slowFirst?: boolean } = {}) {}
    
    async charge(): Promise<Payment> {
        this.calls++;
        if (this.options.slowFirst && this.calls === 1) throw new PaymentTimeoutError();
        return { id: 'p-1', approved: this.options.approved ?? true };
    }
    
    async refund(): Promise<void> {}
}

describe('LoggingGateway', () => {
    let lines: string[];
    const log = (line: string) => lines.push(line);
    
    beforeEach(() => {
        lines = [];
    });
    
    it("scrive la richiesta e l'esito dell'addebito con la durata", async () => {
        await new LoggingGateway(new FakeGateway(), log).charge(62.63, 'TH-e-1-1', '4242');
        expect(lines[0]).toBe('[pagamenti] addebito 62.63 TH-e-1-1');
        expect(lines[1]).toMatch(/^\[pagamenti\] addebito approvato p-1 in \d+ ms$/);
    });
    
    it("scrive l'addebito rifiutato", async () => {
        await new LoggingGateway(new FakeGateway({ approved: false }), log).charge(10, 'r', 'c');
        expect(lines[1]).toMatch(/^\[pagamenti\] addebito rifiutato p-1 in \d+ ms$/);
    });
    
    it('scrive il rimborso', async () => {
        await new LoggingGateway(new FakeGateway(), log).refund('p-1', 62.63);
        expect(lines[0]).toBe('[pagamenti] rimborso 62.63 p-1');
        expect(lines[1]).toMatch(/^\[pagamenti\] rimborso ok in \d+ ms$/);
    });
    
    it("scrive l'errore e lo rilancia", async () => {
        const gateway = new LoggingGateway(new FakeGateway({ slowFirst: true }), log);
        await expect(gateway.charge(10, 'r', 'c')).rejects.toBeInstanceOf(PaymentTimeoutError);
        expect(lines[1]).toMatch(/^\[pagamenti\] addebito errore PaymentTimeoutError in \d+ ms$/);
    });
    
    it('dentro RetryingGateway scrive ogni tentativo', async () => {
        const gateway = new RetryingGateway(new LoggingGateway(new FakeGateway({ slowFirst: true }), log));
        await gateway.charge(10, 'r', 'c');
        expect(lines).toHaveLength(4);
        expect(lines[1]).toMatch(/errore PaymentTimeoutError/);
        expect(lines[3]).toMatch(/approvato p-1/);
    });
});