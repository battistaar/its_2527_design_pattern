import { EventRecord, OrderItem, Seat } from "../data/types";
import { round2 } from "../shared/money";
import { PricingRule } from "./pricing-rule";

export interface SeatRequest {
  seat: Seat;
  quantity: number;
}

export interface Order {
  items: OrderItem[];
  total: number;
}

export class OrderPricer {

  constructor(private readonly rule: PricingRule) {}

  quote(event: EventRecord, requests: SeatRequest[]): Order {
    const items: OrderItem[] = [];

    for (const { seat, quantity } of requests) {
      // per ogni posto richiesto, se supero la soglia devo creare due oggetti in items

      const prices: { unitPrice: number, quantity: number }[] = [];

      for (let i = 0; i < quantity; i++) {
        const unitPrice = this.unitPrice(event, seat);
        const last = prices[prices.length -1];

        // se diverso da quello precedente, creo nuova riga
        if (last && last.unitPrice === unitPrice) {
          last.quantity++;
        } else {
          prices.push({ unitPrice, quantity: 1 });
        }
      }

      for (const price of prices) {
        items.push(this.line(seat, price.unitPrice, price.quantity));
      }
    }

    let total = items.reduce((tot, curr) => tot + curr.lineTotal, 0);
    total = round2(total);
    return {
      items,
      total
    }
  }

  private line(seat: Seat, unitPrice: number, quantity: number): OrderItem {
    const fee = round2(unitPrice * 0.12);
    let lineTotal: number;
    if (seat.kind === 'standing') {
      // per i posti in piedi la commissione si calcola direttamente sul totale, il risultato è lo stesso
      lineTotal = round2(unitPrice * quantity * 1.12);
    } else {
      lineTotal = round2(unitPrice + fee);
    }
    return {
      seatId: seat.id,
      sector: seat.sector,
      quantity: quantity,
      unitPrice,
      fee,
      lineTotal
    };
  }
  
  priceFrom(event: EventRecord, seats: Seat[]): string {
    const min = Math.min(...seats.map(seat => this.unitPrice(event, seat)));
    return (min * 1.12).toFixed(2);
  }
  
  private unitPrice(event: EventRecord, seat: Seat): number {
    return this.rule.unitPrice({ event, seat });
  }
}