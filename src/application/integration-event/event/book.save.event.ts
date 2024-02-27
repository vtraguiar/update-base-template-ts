import { EventType, IntegrationEvent } from './integration.event'
import { Book } from '../../domain/model/book'

export class BookSaveEvent extends IntegrationEvent<Book> {
    public static readonly ROUTING_KEY: string = 'activitys.save'
    public static readonly NAME: string = 'ActivitysSaveEvent'

    constructor(public timestamp?: Date, public activity?: Book) {
        super(BookSaveEvent.NAME, EventType.ACTIVITY, timestamp)
    }

    public toJSON(): any {
        if (!this.activity) return {}
        return {
            ...super.toJSON(),
            ...{
                activity: this.activity.toJSON()
            }
        }
    }
}
