import { inject, injectable } from 'inversify'
import { IBackgroundTask } from '../../application/port/background.task.interface'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { BookDeleteEventHandler } from 'application/integration-event/handler/book.delete.event.handler'
import { DIContainer } from 'di/di'
import { ILogger } from 'utils/custom.logger'
import { BookDeleteEvent } from 'application/integration-event/event/book.delete.event'

@injectable()
export class SubscribeEventBusTask implements IBackgroundTask {
    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public run(): void {
        this.subscribeEvents()
    }

    public async stop(): Promise<void> {
        try {
            await this._eventBus.dispose()
        } catch (err: any) {
            return Promise.reject(new Error(`Error stopping SubscribeEventBusTask! ${err.message}`))
        }
    }

    /**
     *  Before performing the subscribe is trying to connect to the bus.
     *  If there is no connection, infinite attempts will be made until
     *  the connection is established successfully. Once you have the
     *  connection, events subscribe is performed.
     */
    private subscribeEvents(): void {
        this._eventBus
            .subscribe(new BookDeleteEvent(), new BookDeleteEventHandler(
                DIContainer.get(Identifier.BOOK_SERVICE),
                this._logger
            ),
                BookDeleteEvent.ROUTING_KEY
        )
        .then((result: boolean) => {
            if (result) this._logger.info('Subscribe in bookDeleteEvent successfull!')
        })
        .catch(err => {
            this._logger.error(`Error in Subscribe Book! ${err.message}`)
        })
    }
}
