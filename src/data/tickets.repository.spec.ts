import { TicketsRepository } from './tickets.repository';
import type { Ticket, TicketStatus } from './types';

function ticket(id: string, eventId: string, status: TicketStatus): Ticket {
  return {
    id,
    orderId: 'o-1',
    eventId,
    seatId: 'PIT',
    sector: 'PIT',
    row: null,
    number: null,
    holderName: 'Ada',
    price: 55.89,
    code: `TH|${id}|00`,
    status,
  };
}

describe('TicketsRepository.countByEvent', () => {
  it('conta anche i biglietti annullati', () => {
    const repo = new TicketsRepository();
    repo.save(ticket('t-1', 'e-1', 'valid'));
    repo.save(ticket('t-2', 'e-1', 'used'));
    repo.save(ticket('t-3', 'e-1', 'void'));

    expect(repo.countByEvent('e-1')).toBe(3);
  });

  it('non conta i biglietti di altri eventi', () => {
    const repo = new TicketsRepository();
    repo.save(ticket('t-1', 'e-1', 'valid'));
    repo.save(ticket('t-2', 'e-2', 'valid'));

    expect(repo.countByEvent('e-1')).toBe(1);
  });

  it('torna 0 per un evento senza biglietti', () => {
    expect(new TicketsRepository().countByEvent('e-1')).toBe(0);
  });
});
