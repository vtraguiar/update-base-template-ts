import HttpStatus from 'http-status-codes'
import { User } from 'application/domain/model/user'
import { IUserService } from 'application/port/user.service.interface'
import { Identifier } from 'di/identifiers'
import { inject } from 'inversify'
import { Request, Response} from 'express'
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils'
import { ApiExceptionManager } from 'ui/exception/api.exception.manager'
import { Query
 } from 'infrastructure/repository/query/query'

@controller('/users')
export class UserController {
    
    constructor(
        @inject(Identifier.USER_SERVICE) private readonly _userService: IUserService,
    ){
}

@httpPost('/')
    public async addUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const newUser: User = new User().fromJSON(req.body)
            const result: User | undefined = await this._userService.add(newUser)
            return res.status(HttpStatus.CREATED).send(this.toJSONView(result))
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpGet('/')
    public async getAllUsers(@request() req: Request, @response() res: Response) {
        try {
            const result: Array<User> = await this._userService.getAll(new Query().fromJSON(req.query))
            return res.status(HttpStatus.OK).send(result)
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }

    }
}