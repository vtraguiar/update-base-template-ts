import  HttpStatus  from 'http-status-codes'
import { inject } from 'inversify'
import { controller, httpDelete, httpGet, httpPatch, httpPost, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { Query } from '../../infrastructure/repository/query/query'
import { Book } from '../../application/domain/model/book'
import { IBookService } from '../../application/port/book.service.interface'
// import { User } from '../../application/domain/model/user'
import { ILogger } from '../../utils/custom.logger'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { ApiException } from '../exception/api.exception'
import { IUserService } from '../../application/port/user.service.interface'
import { User } from '../../application/domain/model/user'
// import { BookReservationRepository } from 'infrastructure/repository/bookLoan.repository'

/**
 * Controller that implements Book feature operations.
 *
 * @remarks To define paths, we use library inversify-express-utils.
 * @see {@link https://github.com/inversify/inversify-express-utils} for further information.
 */
@controller('/users/:user_id/books')
export class BookController {
    public BookReservation: any

    /**
     * Creates an instance of Book controller.
     *
     * @param {IActivityService} _activityService
     * @param {IUserService} _userService
     * @param {ILogger} _logger
     */
    constructor(
        @inject(Identifier.BOOK_SERVICE) private readonly _bookService: IBookService,
        @inject(Identifier.USER_SERVICE) private readonly _userService: IUserService,
        // @inject(Identifier.BOOK_LOAN_SERVICE) private readonly _bookReservationRepository: BookReservationRepository,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    /**
     * Add new book.
     *
     * @param {Request} req
     * @param {Response} res
     */
    @httpPost('/')
    public async addBook(@request() req: Request, @response() res: Response) {
        try {
            const user = await this._userService.getById(req.params.user_id, new Query())
            const book: Book = new Book().fromJSON(req.body)
            book.user = user
            const result: Book | undefined = await this._bookService.add(book)
            return res.status(HttpStatus.CREATED).send(result)
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    /**
     * Get all books.
     * For the query strings, the query-strings-parser middleware was used.
     * @see {@link https://www.npmjs.com/package/query-strings-parser} for further information.
     *
     * @param {Request} req
     * @param {Response} res
     */
    @httpGet('/')
    public async getAllBooks(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result = await this._bookService.getAll(new Query().fromJSON(req.query))
            return res.status(HttpStatus.OK).send(result)
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    /**
     * Get book by id.
     * For the query strings, the query-strings-parser middleware was used.
     * @see {@link https://www.npmjs.com/package/query-strings-parser} for further information.
     *
     * @param {Request} req
     * @param {Response} res
     */
    @httpGet('/:book_id')
    public async getBookById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: Book | undefined = await this._bookService.getById(req.params.activity_id,
                new Query().fromJSON(req.query))
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageNotFoundBook())
            return res.status(HttpStatus.OK).send(result)
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    /**
     * Update activity by id.
     *
     * @param {Request} req
     * @param {Response} res
     */
    @httpPatch('/:book_id')
    public async updateBook(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const activity: Book = new Book().fromJSON(req.body)
            activity.id = req.params.activity_id
            const result = await this._bookService.update(activity)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageNotFoundBook())
            return res.status(HttpStatus.OK).send(result)
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    /**
     * Remove activity by id.
     *
     * @param {Request} req
     * @param {Response} res
     */
    @httpDelete('/:book_id')
    public async removeBook(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: boolean = await this._bookService.remove(req.params.activity_id)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageNotFoundBook())
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    /*@httpPost('/:book_id/borrow/:user_id')
    public async borrowBook(@request() req: Request, @response() res: Response): Promise<Response | undefined> {
        try {
            const book = await this._bookService.getById(req.params.book_id, new Query())
            const user = await this._userService.getById(req.params.user_id, new Query())

            if (!book || !user) {
                return res.status(404).json({ error: 'Livro ou usuário não encontrado' })
            }

            const reservation = await this._bookReservationRepository.reserveBook(book, user)

            if (reservation) {
                return res.status(200).json({ message: 'Livro emprestado com sucesso', reservation })
            } else {
                return res.status(500).json({ error: 'Falha ao pegar o livro emprestado' })
            }
        } catch (error) {
            console.error('Erro ao pegar o livro emprestado', error)
            return res.status(500).json({ error: 'Um erro ocorreu ao tentar pegar o livro emprestado' })
        }
    }*/

    @httpPost('/:book_id/borrow/:user_id')
    public async borrowBook(@request() req: Request, @response() res: Response): Promise<Response | undefined> {
        try {
            const { book_id, user_id } = req.params
            const book: Book | undefined = await this._bookService.getById(book_id, new Query())
            const user: User | undefined = await this._userService.getById(user_id, new Query())

            const reservation = await this._bookService.reserveBook(book, user)

            return res.status(HttpStatus.OK).send(reservation)

        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }


    private getMessageNotFoundBook(): object {
        return new ApiException(
            HttpStatus.NOT_FOUND,
             'Book not found!',
             'Book not found or already removed. A new operation for the same resource is not required!'
        ).toJSON()
    }
}
