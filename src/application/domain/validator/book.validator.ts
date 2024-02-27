import { ValidationException } from '../exception/validation.exception'
import { Book } from '../model/book'

export class BookValidator {
    public static validate(book: Book): void | ValidationException {
        const fields: Array<string> = []

        // validate null
        if (!book.name_of_book) fields.push('Name of book')
        if (!book.author) fields.push('Author')
        if (!book.number_of_pages) fields.push('Number of pages')
        if (!book.year) fields.push('Year')

        if (fields.length > 0) {
            throw new ValidationException('Required fields were not provided...',
                'Activity validation failed: '.concat(fields.join(', ')).concat(' required!'))
        }
    }
}
