import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createApp } from './helpers';

describe('Eventi', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('elenca solo gli eventi in vendita', async () => {
    const res = await request(app.getHttpServer()).get('/events').expect(200);
    expect(res.body.map((e: { id: string }) => e.id)).toEqual(['e-1', 'e-2', 'e-3', 'e-4']);
  });

  it('mostra il prezzo minimo con la commissione inclusa', async () => {
    const res = await request(app.getHttpServer()).get('/events').expect(200);
    expect(res.body[0]).toEqual({
      id: 'e-1',
      title: 'Nebbia Elettrica Tour',
      date: '2027-06-12T21:00:00+02:00',
      venue: 'Arena Nord',
      city: 'Verona',
      priceFrom: '35.75',
    });
    expect(res.body.map((e: { priceFrom: string }) => e.priceFrom)).toEqual(['35.75', '28.00', '0.00', '20.16']);
  });

  it('mostra il dettaglio di un evento con la disponibilità', async () => {
    const res = await request(app.getHttpServer()).get('/events/e-2').expect(200);
    expect(res.body.title).toBe('Lo Schiaccianoci');
    expect(res.body.venue).toEqual({ id: 'v-teatro', name: 'Teatro Comunale', city: 'Treviso' });
    expect(res.body.priceFrom).toBe('28.00');
    expect(res.body.availability).toEqual({ total: 400, free: 400 });
  });

  it('risponde 404 per un evento inesistente', () => {
    return request(app.getHttpServer()).get('/events/e-99').expect(404);
  });
});
