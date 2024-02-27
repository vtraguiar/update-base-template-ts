import { inject } from 'inversify'
import { Identifier } from '../../../di/identifiers'
import { IBookService } from '../../port/book.service.interface'
import { IIntegrationEventHandler } from './integration.event.handler.interface'
import { BookSaveEvent } from '../event/book.save.event'
import { Book } from '../../domain/model/book'
import { ValidationException } from '../../domain/exception/validation.exception'
import { BookValidator } from '../../domain/validator/book.validator'
import { ILogger } from '../../../utils/custom.logger'

export class BookSaveEventHandler implements IIntegrationEventHandler<BookSaveEvent> {

    /**
     * Creates an instance of ActivityRemoveEventHandler.
     *
     * @param {IActivityService} activityService
     * @param _logger
     */
    constructor(
        @inject(Identifier.BOOK_SERVICE) readonly bookService: IBookService,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger

    ) {
    }

    public handle(event: BookSaveEvent): void {
        try {
            if (!event.activity) {
                throw new ValidationException('Event is not in tehe expected format!', JSON.stringify(event))
            }

            const activity: Book = new Book().fromJSON(event.activity)
            BookValidator.validate(activity)

            this._logger.info(`Prepare to save activity from ${activity.id}...`)
            Promise.allSettled([
                this.bookService.add(activity)
            ]).then(results => {
                for (const result of results) {
                    if (result.status === 'rejected') {
                        this._logger.error(`Error saving patient resource. ${result.reason}`)
                    }
                }
                this._logger.info(`Action for event ${event.event_name} sucessfully performad!`)
            })
        } catch (err: any) {
            this._logger.error(`An error ocurred while attempting `
                .concat(`perform the operation with the ${event.event_name} name event. ${err.message}`)
                .concat(err.description ? ' ' + err.description : ''))
        }
    }
}
