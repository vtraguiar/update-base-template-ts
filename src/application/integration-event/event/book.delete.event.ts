import { EventType, IntegrationEvent } from './integration.event'
import { Book } from '../../domain/model/book'

export class BookDeleteEvent extends IntegrationEvent<any> {
    public static readonly ROUTING_KEY: string = 'activitys.delete'
    public static readonly NAME: string = 'ActivitysDeleteEvent'

    constructor(public timestamp?: Date, public activity?: Book) {
        super(BookDeleteEvent.NAME, EventType.ACTIVITY, timestamp)
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
