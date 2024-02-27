import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { Book } from '../../application/domain/model/book'
import { BaseRepository } from './base/base.repository'
import { Query } from './query/query'
import { ILogger } from '../../utils/custom.logger'
import { IBookRepository } from '../../application/port/book.repository.interface'
import { BookEntity } from '../entity/book.entity'
import { IQuery } from '../../application/port/query.interface'

/**
 * Implementation of the book repository.
 *
 * @implements {IBookRepository}
 */

@injectable()
export class BookRepository extends BaseRepository<Book, BookEntity> implements IBookRepository {
    constructor(
        @inject(Identifier.BOOK_REPO_MODEL) readonly bookModel: any,
        @inject(Identifier.BOOK_ENTITY_MAPPER) readonly bookMapper: any,
        @inject(Identifier.LOGGER) readonly logger: ILogger
    ) {
        super(bookModel, bookMapper, logger)
    }

    /**
     * @override
     */
    public find(query: IQuery): Promise<Array<Book>> {
        const q: any = query.toJSON()
        return new Promise<Array<Book>>((resolve, reject) => {
            this.Model.find(q.filters)
                .select(q.fields)
                .populate('user')
                .sort(q.ordination)
                .skip(Number((q.pagination.limit * q.pagination.page) - q.pagination.limit))
                .limit(Number(q.pagination.limit))
                .exec() // execute query
                .then((result: Array<BookEntity>) => {
                    resolve(result.map(item => this.bookMapper.transform(item)))
                })
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

    /**
     * @override
     */
    public findOne(query: IQuery): Promise<Book> {
        const q: any = query.toJSON()
        return new Promise<Book>((resolve, reject) => {
            this.Model.findOne(q.filters)
                .select(q.fields)
                .populate('user')
                .exec()
                .then((result: BookEntity) => {
                    if (!result) return resolve(new Book())
                    return resolve(this.bookMapper.transform(result))
                })
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

    /**
     * @override
     */
    public update(item: Book): Promise<Book> {
        const activity: BookEntity = this.bookMapper.transform(item)
        return new Promise<Book>((resolve, reject) => {
            this.Model.findOneAndUpdate({ _id: item.id }, activity, { new: true })
                .exec()
                .then(result => {
                    if (!result) return resolve(new Book())
                    result.populate('id')
                        .execPopulate()
                        .then((res) => resolve(this.bookMapper.transform(res)))
                })
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

    /**
     * Checks if an book already has a registration.
     * What differs from one activity to another is the start date and associated user.
     *
     * @param book
     * @return {Promise<boolean>} True if it exists or False, otherwise
     * @throws {ValidationException | RepositoryException}
     */
    public async checkExist(book: Book): Promise<boolean> {
        const query: Query = new Query()
        return new Promise<boolean>((resolve, reject) => {
            if (book.name_of_book && book.id) {
                query.filters = { name_of_book: book.name_of_book, code: book.id }
            }
            super.findOne(query)
                .then((result: Book | undefined) => {
                    if (result) return resolve(true)
                    return resolve(false)
                })
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }
}
