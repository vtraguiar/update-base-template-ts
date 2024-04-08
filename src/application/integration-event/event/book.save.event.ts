import { Book } from 'application/domain/model/book'
import { EventType, IntegrationEvent } from './integration.event'


export class BookSaveEvent extends IntegrationEvent<Book> {
    public static readonly ROUTING_KEY: string = 'book.save'
    public static readonly NAME: string = 'BookSaveEvent'

    constructor(public timestamp?: Date, public book?: Book) {
        super(BookSaveEvent.NAME, EventType.BOOK, timestamp)
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
