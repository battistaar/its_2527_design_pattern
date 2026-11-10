import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createApp } from './helpers';

const base = { holderName: 'Ada', email: 'ada@example.com' };

describe('Pagamenti con BetaPayments', () => {
    let app: INestApplication;
    const buy = (seatId: string, card: string) =>
        request(app.getHttpServer())
    .post('/orders')
    .send({ ...base, eventId: 'e-2', seats: [{ seatId }], card });
    
    beforeEach(async () => {
        process.env.PAYMENT_PROVIDER = 'beta';
        app = await createApp();
    });
    afterEach(async () => {
        await app.close();
        delete process.env.PAYMENT_PROVIDER;
    });
    
    it('un ordine da 50,40 € con tok_ok è pagato con Beta', async () => {
        const res = await buy('PLATEA-2-1', 'tok_ok').expect(201);
        expect(res.body.order.total).toBe(50.4);
        expect(res.body.order.status).toBe('paid');
        expect(res.body.order.paymentId).toMatch(/^BP-/);
    });
    
    it('con tok_refuse risponde 402 e lascia il posto libero', async () => {
        await buy('PLATEA-2-2', 'tok_refuse').expect(402);
        await buy('PLATEA-2-2', 'tok_ok').expect(201);
    });
    
    it("l'annullamento rimborsa con Beta", async () => {
        const bought = await buy('PLATEA-2-3', 'tok_ok').expect(201);
        expect(bought.body.order.paymentId).toMatch(/^BP-/);
        const res = await request(app.getHttpServer()).post(`/orders/${bought.body.order.id}/cancel`).expect(201);
        expect(res.body.order.status).toBe('refunded');
    });
});