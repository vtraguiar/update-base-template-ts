import { BookDeleteEvent } from '../event/book.delete.event'
import { inject } from 'inversify'
import { Identifier } from '../../../di/identifiers'
import { IBookService } from '../../port/book.service.interface'
import { IIntegrationEventHandler } from './integration.event.handler.interface'
import { ValidationException } from '../../domain/exception/validation.exception'
import { Book } from '../../domain/model/book'
import { BookValidator } from '../../domain/validator/book.validator'
import { ILogger } from '../../../utils/custom.logger'

export class BookDeleteEventHandler implements IIntegrationEventHandler<BookDeleteEvent> {

    /**
     * Creates an instance of ActivityDeleteEventHandler.
     *
     * @param {IActivityService} activityService
     * @param _logger
     */
    constructor(
        @inject(Identifier.BOOK_SERVICE) readonly bookService: IBookService,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public handle(event: BookDeleteEvent): void {
        try {
            if (!event.activity) {
                throw new ValidationException('Event is not in the expected format!', JSON.stringify(event))
            }

            const book: Book = new Book().fromJSON(event.activity)
            BookValidator.validate(book)

            this._logger.info(`Prepare to delete activity from ${book.id}...`)
            Promise.allSettled([
                this.bookService.remove(book.id!)
            ]).then(results => {
                for (const result of results) {
                    if (result.status === 'rejected') {
                        this._logger.error(`Error removing activity resource. ${result.reason}`)
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
