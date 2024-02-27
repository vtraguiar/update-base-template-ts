import { IService } from './service.interface'
import { Book } from '../domain/model/book'
import { User } from '../domain/model/user'
import { Reservation } from '../domain/model/reservation'

/**
 * Book service interface.
 *
 * @extends {IService}
 */
export interface IBookService extends IService<Book> {

    reserveBook(book: Book | undefined, user: User | undefined): Promise<Reservation | undefined>
}
