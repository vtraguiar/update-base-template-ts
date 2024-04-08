import { Book } from 'application/domain/model/book'
import { EventType, IntegrationEvent } from './integration.event'

export class BookDeleteEvent extends IntegrationEvent<Book> {
    public static readonly ROUTING_KEY: string = 'Book'
    public static readonly NAME: string = 'BookDeleteEvent'

    constructor(public timestamp?: Date, public book?: Book) {
        super(BookDeleteEvent.NAME, EventType.BOOK, timestamp)
    }

    public toJSON(): any {
        if (!this.book) return {}
        return {
            ...super.toJSON(),
            ...{
                book: this.book.toJSON()
            }
        }
    }
}
