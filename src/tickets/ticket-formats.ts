import { EventRecord, Ticket, Venue } from "../data/types";
import { HtmlTicketRenderer, PdfTicketRenderer, QrTicketRenderer, TextTicketRenderer, TicketRenderer, WalletTicketRenderer } from "./renderers";

export interface TicketFile {
    body: string | Buffer;
    contentType: string;
    filename: string;
}

export abstract class TicketFormat {
    abstract readonly contentType: string;
    abstract readonly extension: string;
    
    protected abstract createRenderer(event: EventRecord, venue: Venue): TicketRenderer;
    
    produce(ticket: Ticket, event: EventRecord, venue: Venue): TicketFile {
        const rendered = this.createRenderer(event, venue);
        return {
            body: rendered.render(ticket),
            contentType: this.contentType,
            filename: `biglietto-${ticket.id}.${this.extension}`
        };
    }
}

export class HtmlFormat extends TicketFormat {
    readonly contentType = 'text/html; charset=utf-8';
    readonly extension = 'html';
    
    protected createRenderer(event: EventRecord, venue: Venue): TicketRenderer {
        return new HtmlTicketRenderer(event, venue);
    }
}

export class TextFormat extends TicketFormat {
    readonly contentType = 'text/plain; charset=utf-8';
    readonly extension = 'txt';
    
    protected createRenderer(event: EventRecord, venue: Venue): TicketRenderer {
        return new TextTicketRenderer(event, venue);
    }
}

export class PdfFormat extends TicketFormat {
    readonly contentType = 'application/pdf';
    readonly extension = 'pdf';
    
    protected createRenderer(event: EventRecord, venue: Venue): TicketRenderer {
        return new PdfTicketRenderer(event, venue);
    }
}

export class WalletFormat extends TicketFormat {
    readonly contentType = 'application/vnd.apple.pkpass+json';
    readonly extension = 'pass.json';
    
    protected createRenderer(event: EventRecord, venue: Venue): TicketRenderer {
        return new WalletTicketRenderer(event, venue);
    }
}

export class QrFormat extends TicketFormat {
    readonly contentType = 'text/plain; charset=utf-8';
    readonly extension = 'txt';
    
    protected createRenderer(event: EventRecord): TicketRenderer {
        return new QrTicketRenderer(event);
    }
}

export const TICKET_FORMATS = 'TICKET_FORMATS';

export type TicketFormats = Record<string, TicketFormat>;

export function ticketFormats(): TicketFormats {
    return {
        html: new HtmlFormat(),
        text: new TextFormat(),
        pdf: new PdfFormat(),
        wallet: new WalletFormat(),
        qr: new QrFormat(),
    }
}


