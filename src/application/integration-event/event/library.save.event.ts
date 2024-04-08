import { Library } from "application/domain/model/library"
import { EventType, IntegrationEvent } from "./integration.event"


export class LibrarySaveEvent extends IntegrationEvent<Library> {
    public static readonly ROUTING_KEY: string = 'library.save'
    public static readonly NAME: string = 'LibrarySaveEvent'

    constructor(public timestamp?: Date, public library?: Library) {
        super(LibrarySaveEvent.NAME, EventType.LIBRARY, timestamp)
    }

    public toJSON(): any {
        if(!this.library) return {}
        return {
            ...super.toJSON(),
            ...{
                library: this.library.toJSON()
            }
        }
    }
}