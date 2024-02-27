import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IBookService } from '../port/book.service.interface'
import { IBookRepository } from '../port/book.repository.interface'
import { Book } from '../domain/model/book'
import { IQuery } from '../port/query.interface'
import { User } from '../domain/model/user'
import { Reservation } from '../domain/model/reservation'
import randomstring from 'randomstring'

/**
 * Implementing book Service.
 *
 * @implements {IBookService}
 */
@injectable()
export class BookService implements IBookService {

    constructor(@inject(Identifier.BOOK_REPOSITORY) private readonly _bookRepository: IBookRepository) {
    }

    /**
     * Adds a new book.
     * Before adding, it is checked whether the book already exists.
     *
     * @param {Book} book
     * @returns {(Promise<Activity>)}
     * @throws {ConflictException | RepositoryException} If a data conflict occurs, as an existing activity.
     */
    public async add(book: Book): Promise<Book | undefined> {
        try {
            const result: Book | undefined = await this._bookRepository.create(book)
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    /**
     * Get the data of all books in the infrastructure.
     *
     * @param query Defines object to be used for queries.
     * @return {Promise<Array<Book>>}
     * @throws {RepositoryException}
     */
    public async getAll(query: IQuery): Promise<Array<Book>> {
        return this._bookRepository.find(query)
    }

    /**
     * Get in infrastructure the books data.
     *
     * @param id Unique identifier.
     * @param query Defines object to be used for queries.
     * @return {Promise<Activity>}
     * @throws {RepositoryException}
     */
    public async getById(id: string | number, query: IQuery): Promise<Book | undefined> {
        query.filters = { _id: id }
        return this._bookRepository.findOne(query)
    }

    /**
     * Updates book data.
     *
     * @param book - Book containing the data to be updated
     * @return {Promise<Book>}
     * @throws {ConflictException | RepositoryException}
     */
    public async update(book: Book): Promise<Book | undefined> {
        return this._bookRepository.update(book)
    }

    /**
     * Removes the books according to their unique identifier.
     *
     * @param id - Unique identifier.
     * @return {Promise<boolean>}
     * @throws {ValidationException | RepositoryException}
     */
    public async remove(id: string): Promise<boolean> {
        return this._bookRepository.delete(id)
    }

    public count(query: IQuery): Promise<number> {
        return Promise.resolve(0)
    }

    public reserveBook(book: Book, user: User): Promise<Reservation | undefined> {
        try {
            if (book.status !== true) {
                throw new Error('O livro não está disponível para reserva!')
            }

            const reservation: Reservation = {
                bookId: book.id,
                userId: user.id,
                reservationDate: new Date(),
                loanId: randomstring.generate({ length: 10 })
            }

            user.incrementBooksBorrowed()
            console.log(user.books_borrowed)
            book.status = false
            return Promise.resolve(reservation)
        } catch (error: any) {
            console.error('Erro ao reservar o livro:', error.message)
            return Promise.reject(error.message)
        }
    }
}
