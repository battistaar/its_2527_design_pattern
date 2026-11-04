// Tiene traccia dei posti venduti per ogni evento.
// C'è una sola istanza per tutta l'applicazione, così ordini, mappa e report

import { Injectable } from "@nestjs/common";

// vedono sempre gli stessi dati.
@Injectable()
export class SeatInventory {

  private readonly soldSeats = new Map<string, Set<string>>();
  private readonly standing = new Map<string, Map<string, number>>();

  isSold(eventId: string, seatId: string): boolean {
    return this.soldSeats.get(eventId)?.has(seatId) ?? false;
  }

  markSold(eventId: string, seatId: string): void {
    if (!this.soldSeats.has(eventId)) {
      this.soldSeats.set(eventId, new Set());
    }
    this.soldSeats.get(eventId)!.add(seatId);
  }

  release(eventId: string, seatId: string): void {
    this.soldSeats.get(eventId)?.delete(seatId);
  }

  standingSold(eventId: string, seatId: string): number {
    return this.standing.get(eventId)?.get(seatId) ?? 0;
  }

  addStanding(eventId: string, seatId: string, qty: number): void {
    if (!this.standing.has(eventId)) {
      this.standing.set(eventId, new Map());
    }
    const sectors = this.standing.get(eventId)!;
    sectors.set(seatId, (sectors.get(seatId) ?? 0) + qty);
  }

  removeStanding(eventId: string, seatId: string, qty: number): void {
    const sectors = this.standing.get(eventId);
    if (!sectors) return;
    sectors.set(seatId, Math.max(0, (sectors.get(seatId) ?? 0) - qty));
  }

  soldCount(eventId: string): number {
    let count = this.soldSeats.get(eventId)?.size ?? 0;
    for (const qty of this.standing.get(eventId)?.values() ?? []) {
      count += qty;
    }
    return count;
  }
}