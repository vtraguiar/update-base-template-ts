import { IService } from './service.interface'
import { Book } from '../domain/model/book'

/**
 * Book service interface.
 *
 * @extends {IService}
 */
export interface IBookService extends IService<Book> {
}
