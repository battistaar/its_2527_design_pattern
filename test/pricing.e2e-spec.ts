import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createApp, GOOD_CARD } from './helpers';

const base = { card: GOOD_CARD, holderName: 'Ada', email: 'ada@example.com' };

describe('Prezzo early bird di e-1', () => {
  let app: INestApplication;
  const buy = (seats: { seatId: string; quantity?: number }[]) =>
    request(app.getHttpServer()).post('/orders').send({ ...base, eventId: 'e-1', seats });

  beforeAll(async () => {
    app = await createApp();
  });
  afterAll(() => app.close());

  it('un biglietto PIT early bird costa 44,71', async () => {
    const res = await buy([{ seatId: 'PIT' }]).expect(201);
    expect(res.body.order.total).toBe(44.71);
  });

  it('tre posti in settore A early bird costano 187,89', async () => {
    const res = await buy([{ seatId: 'A-9-1' }, { seatId: 'A-9-2' }, { seatId: 'A-9-3' }]).expect(201);
    expect(res.body.order.total).toBe(187.89);
  });

  it('in vetrina e-1 parte da 35,75 finché lo sconto è attivo', async () => {
    const res = await request(app.getHttpServer()).get('/events').expect(200);
    expect(res.body.find((e: { id: string }) => e.id === 'e-1').priceFrom).toBe('35.75');
  });

  it('un ordine annullato non restituisce il posto early bird', async () => {
    const bought = await buy([{ seatId: 'PIT', quantity: 10 }]).expect(201);
    await request(app.getHttpServer()).post(`/orders/${bought.body.order.id}/cancel`).expect(201);
    // venduti finora: 1 + 3 + 10 = 14, anche se 10 sono annullati
    const res = await buy([{ seatId: 'PIT', quantity: 484 }]).expect(201);
    expect(res.body.tickets).toHaveLength(484);
  });

  it("un ordine che scavalca la soglia paga a prezzo pieno solo i biglietti oltre il 500°", async () => {
    // venduti finora: 498
    const res = await buy([{ seatId: 'PIT', quantity: 4 }]).expect(201);
    expect(res.body.tickets.map((t: { price: number }) => t.price)).toEqual([44.71, 44.71, 55.89, 55.89]);
  });

  it('dopo il 500° biglietto un posto in settore A costa di nuovo 78,29', async () => {
    const res = await buy([{ seatId: 'A-9-4' }]).expect(201);
    expect(res.body.order.total).toBe(78.29);
  });

  it('finito lo sconto, in vetrina e-1 torna a 44,69', async () => {
    const res = await request(app.getHttpServer()).get('/events').expect(200);
    expect(res.body.find((e: { id: string }) => e.id === 'e-1').priceFrom).toBe('44.69');
  });
});