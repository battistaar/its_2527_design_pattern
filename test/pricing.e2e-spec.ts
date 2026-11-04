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

describe('Prezzo dinamico di e-2', () => {
  let app: INestApplication;
  const buy = (eventId: string, seats: { seatId: string; quantity?: number }[]) =>
    request(app.getHttpServer()).post('/orders').send({ ...base, eventId, seats });
  
  beforeAll(async () => {
    app = await createApp();
  });
  afterAll(() => app.close());
  
  it('con la PLATEA vuota un posto costa 50,40', async () => {
    const res = await buy('e-2', [{ seatId: 'PLATEA-1-1' }]).expect(201);
    expect(res.body.order.total).toBe(50.4);
  });
  
  it('con meno di metà dei posti liberi la PLATEA costa il 15% in più', async () => {
    // venduti 1 + 150 = 151 su 300: liberi 149
    const seats = Array.from({ length: 150 }, (_, i) => ({ seatId: `PLATEA-${2 + Math.floor(i / 20)}-${1 + (i % 20)}` }));
    await buy('e-2', seats).expect(201);
    const res = await buy('e-2', [{ seatId: 'PLATEA-15-20' }]).expect(201);
    expect(res.body.order.total).toBe(57.96);
  });
  
  it('con meno di un quinto dei posti liberi la PLATEA costa il 30% in più', async () => {
    // venduti 152 + 89 = 241 su 300: liberi 59
    const seats = Array.from({ length: 89 }, (_, i) => ({
      seatId: `PLATEA-${2 + Math.floor((150 + i) / 20)}-${1 + ((150 + i) % 20)}`,
    }));
    await buy('e-2', seats).expect(201);
    const res = await buy('e-2', [{ seatId: 'PLATEA-15-19' }]).expect(201);
    expect(res.body.order.total).toBe(65.52);
  });
});