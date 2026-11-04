import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { MailerService } from '../src/notifications/mailer.service';
import { createApp, DECLINED_CARD, GOOD_CARD, SLOW_CARD } from './helpers';

// NB: l'inventario dei posti non si azzera tra un test e l'altro,
// quindi ogni test usa posti diversi.
describe('Ordini', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createApp();
  });

  afterEach(async () => {
    await app.close();
  });

  function buy(body: Record<string, unknown>) {
    return request(app.getHttpServer())
      .post('/orders')
      .send({ card: GOOD_CARD, holderName: 'Giulia Rossi', email: 'giulia@example.com', ...body });
  }

  it('vende un posto numerato e addebita prezzo più commissione', async () => {
    const res = await buy({ eventId: 'e-1', seats: [{ seatId: 'A-1-1' }] }).expect(201);
    expect(res.body.order.total).toBe(62.63);
    expect(res.body.order.status).toBe('paid');
    expect(res.body.order.alphaChargeId).toMatch(/^ch_\d{6}$/);
    expect(res.body.tickets).toHaveLength(1);
    expect(res.body.tickets[0].price).toBe(62.63);
    expect(res.body.tickets[0].code).toMatch(/^TH\|t-1\|\d{2}$/);
  });

  it('vende posti in piedi a quantità', async () => {
    const res = await buy({ eventId: 'e-1', seats: [{ seatId: 'PIT', quantity: 2 }] }).expect(201);
    expect(res.body.order.total).toBe(89.42);
    expect(res.body.tickets).toHaveLength(2);
    expect(res.body.tickets.map((t: { price: number }) => t.price)).toEqual([44.71, 44.71]);
  });

  it('non vende due volte lo stesso posto numerato', async () => {
    await buy({ eventId: 'e-1', seats: [{ seatId: 'A-2-1' }] }).expect(201);
    await buy({ eventId: 'e-1', seats: [{ seatId: 'A-2-1' }] }).expect(409);
  });

  it('risponde 402 se la carta viene rifiutata e lascia il posto libero', async () => {
    await buy({ eventId: 'e-1', seats: [{ seatId: 'A-3-1' }], card: DECLINED_CARD }).expect(402);
    await buy({ eventId: 'e-1', seats: [{ seatId: 'A-3-1' }] }).expect(201);
  });

  it('completa il pagamento anche se il primo tentativo va in timeout', async () => {
    const res = await buy({ eventId: 'e-1', seats: [{ seatId: 'A-4-1' }], card: SLOW_CARD }).expect(201);
    expect(res.body.order.status).toBe('paid');
  });

  it('non addebita nulla per un evento gratuito', async () => {
    const res = await buy({ eventId: 'e-3', seats: [{ seatId: 'PIT', quantity: 1 }] }).expect(201);
    expect(res.body.order.total).toBe(0);
    expect(res.body.order.alphaChargeId).toBeNull();
  });

  it('rifiuta un evento che non è in vendita', async () => {
    await buy({ eventId: 'e-5', seats: [{ seatId: 'A-1-1' }] }).expect(400);
  });

  it('manda la mail con i biglietti', async () => {
    await buy({ eventId: 'e-2', seats: [{ seatId: 'PLATEA-1-1' }] }).expect(201);
    const mailer = app.get(MailerService);
    expect(mailer.sent).toHaveLength(1);
    expect(mailer.sent[0].to).toBe('giulia@example.com');
    expect(mailer.sent[0].subject).toBe('I tuoi biglietti per Lo Schiaccianoci');
  });

  it('annulla un ordine, rimborsa e rimette in vendita il posto', async () => {
    const bought = await buy({ eventId: 'e-1', seats: [{ seatId: 'A-5-1' }] }).expect(201);
    const orderId = bought.body.order.id;
    const cancelled = await request(app.getHttpServer()).post(`/orders/${orderId}/cancel`).expect(201);
    expect(cancelled.body.order.status).toBe('refunded');
    const detail = await request(app.getHttpServer()).get(`/orders/${orderId}`).expect(200);
    expect(detail.body.tickets.map((t: { status: string }) => t.status)).toEqual(['void']);
    await buy({ eventId: 'e-1', seats: [{ seatId: 'A-5-1' }] }).expect(201);
  });
});
