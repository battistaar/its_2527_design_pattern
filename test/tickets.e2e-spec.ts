import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createApp, GOOD_CARD } from './helpers';

// Un solo acquisto per tutto il file: lo stesso posto non si può ricomprare.
describe('Biglietti', () => {
  let app: INestApplication;
  let ticketId: string;
  
  beforeAll(async () => {
    app = await createApp();
    const res = await request(app.getHttpServer())
    .post('/orders')
    .send({
      eventId: 'e-2',
      seats: [{ seatId: 'PLATEA-1-1' }],
      card: GOOD_CARD,
      holderName: 'Giulia Rossi',
      email: 'giulia@example.com',
    })
    .expect(201);
    ticketId = res.body.tickets[0].id;
  });
  
  afterAll(async () => {
    await app.close();
  });
  
  it('scarica il biglietto in HTML', async () => {
    const res = await request(app.getHttpServer()).get(`/tickets/${ticketId}/download?format=html`).expect(200);
    expect(res.headers['content-type']).toContain('text/html');
    expect(res.headers['content-disposition']).toBe(`attachment; filename="biglietto-${ticketId}.html"`);
    expect(res.text).toContain('<h1>Lo Schiaccianoci</h1>');
    expect(res.text).toContain('Fila 1 Posto 1');
  });
  
  it('scarica il biglietto per la stampante della cassa', async () => {
    const res = await request(app.getHttpServer()).get(`/tickets/${ticketId}/download?format=text`).expect(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.text.split('\n')).toEqual([
      'TICKETHUB',
      'LO SCHIACCIANOCI',
      'Teatro Comunale - Treviso',
      '2027-12-20T20:30:00+01:00',
      'SETTORE PLATEA FILA 1 POSTO 1',
      'INTESTATARIO: Giulia Rossi',
      'EUR 50.40',
      expect.stringMatching(/^TH\|t-1\|\d{2}$/),
    ]);
  });
  
  it('usa HTML se il formato non è indicato', async () => {
    const res = await request(app.getHttpServer()).get(`/tickets/${ticketId}/download`).expect(200);
    expect(res.headers['content-type']).toContain('text/html');
  });
  
  it('rifiuta un formato sconosciuto', () => {
    return request(app.getHttpServer()).get(`/tickets/${ticketId}/download?format=asd`).expect(400);
  });
  
  it('risponde 404 per un biglietto inesistente', () => {
    return request(app.getHttpServer()).get('/tickets/t-999/download').expect(404);
  });
  
  it('scarica il biglietto in PDF', async () => {
    const res = await request(app.getHttpServer())
    .get(`/tickets/${ticketId}/download?format=pdf`)
    .responseType('blob')
    .expect(200);
    expect(res.headers['content-type']).toBe('application/pdf');
    expect(res.headers['content-disposition']).toBe(`attachment; filename="biglietto-${ticketId}.pdf"`);
    const pdf = (res.body as Buffer).toString('latin1');
    expect(pdf.startsWith('%PDF-')).toBe(true);
    for (const text of ['Lo Schiaccianoci', 'Teatro Comunale, Treviso', 'Settore PLATEA - Fila 1 Posto 1', 'Intestato a Giulia Rossi', 'EUR 50.40']) {
      expect(pdf).toContain(`(${text})`);
    }
    expect(pdf).toMatch(/\(Codice: TH\|t-1\|\d{2}\)/);
  });
  
  // la richiesta di T3 rende valido il formato pdf: il test usa un formato che resta sconosciuto
  it('rifiuta un formato sconosciuto', () => {
    return request(app.getHttpServer()).get(`/tickets/${ticketId}/download?format=docx`).expect(400);
  });
  
  it('scarica il pass per il wallet del telefono', async () => {
    const res = await request(app.getHttpServer()).get(`/tickets/${ticketId}/download?format=wallet`).expect(200);
    expect(res.headers['content-type']).toContain('application/vnd.apple.pkpass+json');
    expect(res.headers['content-disposition']).toBe(`attachment; filename="biglietto-${ticketId}.pass.json"`);
    expect(JSON.parse(res.text)).toEqual({
      eventTitle: 'Lo Schiaccianoci',
      venue: 'Teatro Comunale, Treviso',
      date: '2027-12-20T20:30:00+01:00',
      seat: 'PLATEA Fila 1 Posto 1',
      holder: 'Giulia Rossi',
      barcode: expect.stringMatching(/^TH\|t-1\|\d{2}$/),
    });
  });
  
  it('scarica il QR per la cassa in al massimo 160 caratteri', async () => {
    const res = await request(app.getHttpServer()).get(`/tickets/${ticketId}/download?format=qr`).expect(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.text).toMatch(/TH\|t-1\|\d{2}/);
    expect(res.text).toContain('2027-12-20T20:30:00+01:00');
    expect(res.text.length).toBeLessThanOrEqual(160);
  });
});
