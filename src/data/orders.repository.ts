import { Injectable } from '@nestjs/common';
import type { Order } from './types';

@Injectable()
export class OrdersRepository {
  private readonly orders = new Map<string, Order>();
  private seq = 0;

  nextId(): string {
    this.seq++;
    return `o-${this.seq}`;
  }

  save(order: Order): void {
    this.orders.set(order.id, order);
  }

  findById(id: string): Order | undefined {
    return this.orders.get(id);
  }

  findByEvent(eventId: string): Order[] {
    return [...this.orders.values()].filter((o) => o.eventId === eventId);
  }

  findByPaymentId(chargeId: string): Order | undefined {
    return [...this.orders.values()].find((o) => o.paymentId === chargeId);
  }
}
