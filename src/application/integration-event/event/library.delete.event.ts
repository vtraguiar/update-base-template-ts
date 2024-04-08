import { Library } from 'application/domain/model/library';
import { EventType, IntegrationEvent } from './integration.event'

export class LibraryDeleteEvent extends IntegrationEvent<Library> {
    public static readonly ROUTING_KEY: string = 'Library'
    public static readonly NAME: string = 'LibraryDeleteEvent'
    
    constructor(public timestamp?: Date, public library?: Library) {
        super(LibraryDeleteEvent.NAME, EventType.LIBRARY, timestamp)
    }

    public toJSON(): any {
        if (!this.library) return {}
        return {
            ...super.toJSON(),
            ...{
                library: this.library.toJSON()
            }
        }
    }
}