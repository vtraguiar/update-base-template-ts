import { inject, injectable } from 'inversify'
import { ILogger } from '../../utils/custom.logger'
import { Book } from '../../application/domain/model/book'
import { BookEntity } from '../entity/book.entity'
import { BaseRepository } from './base/base.repository'
import { Identifier } from '../../di/identifiers'
import randomstring from 'randomstring'
import { Reservation } from 'application/domain/model/reservation'
import { User } from 'application/domain/model/user'

@injectable()
export class BookReservationRepository extends BaseRepository<Book, BookEntity> {
    constructor(
        @inject(Identifier.BOOK_REPO_MODEL) readonly bookModel: any,
        @inject(Identifier.BOOK_ENTITY_MAPPER) readonly bookMapper: any,
        @inject(Identifier.LOGGER) readonly logger: ILogger
    ) {
        super(bookModel, bookMapper, logger)
    }

    public async reserveBook(book: Book, user: User): Promise<Reservation | null> {
        try {
            const reservation: Reservation = {
                bookId: book.id,
                userId: user.id,
                reservationDate: new Date(),
                loanId: randomstring.generate({ length: 10 })
            }

            await this.Model.create(reservation)

            book.status = false

            return reservation
        } catch (error: any) {
            console.error('Erro ao reservar o livro:', error.message)
            return null
        }
    }
}
