export type SeatKind = 'numbered' | 'standing';

export interface Seat {
  id: string;
  kind: SeatKind;
  sector: string;
  row?: number;
  number?: number;
  capacity?: number;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  seats: Seat[];
}

export type PricingType = 'standard' | 'flat' | 'free';

export type EventStatus = 'draft' | 'on_sale' | 'cancelled';

export interface EventRecord {
  id: string;
  title: string;
  venueId: string;
  date: string;
  promoter: string;
  organizerId: string;
  status: EventStatus;
  pricingType: PricingType;
  sectorPrices: Record<string, number>;
  flatPrice?: number;
  earlyBird?: {tickets: number, discount: number};
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'organizer' | 'customer' | 'box_office';
}

export interface OrderItem {
  seatId: string;
  sector: string;
  quantity: number;
  unitPrice: number;
  fee: number;
  lineTotal: number;
}

export type OrderStatus = 'paid' | 'refunded' | 'disputed';

export interface Order {
  id: string;
  eventId: string;
  userId: string;
  email: string;
  holderName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  alphaChargeId: string | null;
  createdAt: string;
}

export type TicketStatus = 'valid' | 'used' | 'void';

export interface Ticket {
  id: string;
  orderId: string;
  eventId: string;
  seatId: string;
  sector: string;
  row: number | null;
  number: number | null;
  holderName: string;
  price: number;
  code: string;
  status: TicketStatus;
}
