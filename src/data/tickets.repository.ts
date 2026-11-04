import { Injectable } from '@nestjs/common';
import type { Ticket } from './types';

@Injectable()
export class TicketsRepository {
  private readonly tickets = new Map<string, Ticket>();
  private seq = 0;

  nextId(): string {
    this.seq++;
    return `t-${this.seq}`;
  }

  save(ticket: Ticket): void {
    this.tickets.set(ticket.id, ticket);
  }

  findById(id: string): Ticket | undefined {
    return this.tickets.get(id);
  }

  findByOrder(orderId: string): Ticket[] {
    return [...this.tickets.values()].filter((t) => t.orderId === orderId);
  }

  countByEvent(eventId: string): number {
    return [...this.tickets.values()].filter((t) => t.eventId === eventId).length;
  }
}
