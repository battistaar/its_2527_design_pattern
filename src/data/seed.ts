import type { EventRecord, Seat, User, Venue } from './types';

function numberedSector(sector: string, rows: number, seatsPerRow: number): Seat[] {
  const seats: Seat[] = [];
  for (let row = 1; row <= rows; row++) {
    for (let n = 1; n <= seatsPerRow; n++) {
      seats.push({ id: `${sector}-${row}-${n}`, kind: 'numbered', sector, row, number: n });
    }
  }
  return seats;
}

export function seedVenues(): Venue[] {
  return [
    {
      id: 'v-arena',
      name: 'Arena Nord',
      city: 'Verona',
      seats: [
        { id: 'PIT', kind: 'standing', sector: 'PIT', capacity: 2000 },
        ...numberedSector('A', 10, 20),
        ...numberedSector('B', 10, 30),
      ],
    },
    {
      id: 'v-teatro',
      name: 'Teatro Comunale',
      city: 'Treviso',
      seats: [...numberedSector('PLATEA', 15, 20), ...numberedSector('GALLERIA', 5, 20)],
    },
    {
      id: 'v-club',
      name: 'Club Officina',
      city: 'Padova',
      seats: [{ id: 'PIT', kind: 'standing', sector: 'PIT', capacity: 400 }],
    },
  ];
}

export function seedEvents(): EventRecord[] {
  return [
    {
      id: 'e-1',
      title: 'Nebbia Elettrica Tour',
      venueId: 'v-arena',
      date: '2027-06-12T21:00:00+02:00',
      promoter: 'A',
      organizerId: 'u-org-1',
      status: 'on_sale',
      pricingType: 'early_bird',
      sectorPrices: { PIT: 49.9, A: 69.9, B: 39.9 },
      earlyBird: { tickets: 500, discount: 0.2 }
    },
    {
      id: 'e-2',
      title: 'Lo Schiaccianoci',
      venueId: 'v-teatro',
      date: '2027-12-20T20:30:00+01:00',
      promoter: 'B',
      organizerId: 'u-org-2',
      status: 'on_sale',
      pricingType: 'standard',
      sectorPrices: { PLATEA: 45, GALLERIA: 25 },
    },
    {
      id: 'e-3',
      title: 'Jam Session del Giovedì',
      venueId: 'v-club',
      date: '2027-03-04T22:00:00+01:00',
      promoter: 'A',
      organizerId: 'u-org-1',
      status: 'on_sale',
      pricingType: 'free',
      sectorPrices: {},
    },
    {
      id: 'e-4',
      title: 'Indie Night',
      venueId: 'v-club',
      date: '2027-03-18T22:00:00+01:00',
      promoter: 'A',
      organizerId: 'u-org-1',
      status: 'on_sale',
      pricingType: 'flat',
      sectorPrices: {},
      flatPrice: 18,
    },
    {
      id: 'e-5',
      title: 'Reunion dei Vecchi Amici',
      venueId: 'v-arena',
      date: '2027-09-01T21:00:00+02:00',
      promoter: 'B',
      organizerId: 'u-org-2',
      status: 'cancelled',
      pricingType: 'standard',
      sectorPrices: { PIT: 35, A: 55, B: 30 },
    },
    {
      id: 'e-6',
      title: 'Festival di Primavera',
      venueId: 'v-arena',
      date: '2027-04-25T16:00:00+02:00',
      promoter: 'A',
      organizerId: 'u-org-1',
      status: 'draft',
      pricingType: 'flat',
      sectorPrices: {},
      flatPrice: 30,
    },
  ];
}

export function seedUsers(): User[] {
  return [
    { id: 'u-org-1', name: 'Nordest Live', email: 'eventi@nordestlive.example', role: 'organizer' },
    { id: 'u-org-2', name: 'Teatro Aperto', email: 'biglietteria@teatroaperto.example', role: 'organizer' },
    { id: 'u-cust-1', name: 'Giulia Rossi', email: 'giulia.rossi@example.com', role: 'customer' },
    { id: 'u-box-1', name: 'Cassa Arena Nord', email: 'cassa@arenanord.example', role: 'box_office' },
  ];
}
