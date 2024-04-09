import { ValidationException } from '../exception/validation.exception'
import { User } from '../model/user'
import { EmailValidator } from './email.validator'

export class UserValidator {
    public static validate(user: User): void | ValidationException {
        const fields: Array<string> = []


        if (!user.username) fields.push('Name')
        if (!user.password) fields.push('Password')
        if (!user.email) fields.push('Email')


        if (fields.length > 0) {
            throw new ValidationException('Required fields were not provided...',
                'User validation failed: '.concat(fields.join(', ')).concat(' required!'))
        }

        // validate email
        EmailValidator.validate(user.email)
    }
}
