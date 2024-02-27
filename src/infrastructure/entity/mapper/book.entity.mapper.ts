import { injectable } from 'inversify'
import { BookEntity } from '../book.entity'
import { Book } from '../../../application/domain/model/book'
import { UserEntityMapper } from './user.entity.mapper'
import { IBookMapper } from './entity.mapper.interface'

@injectable()
export class BookEntityMapper implements IBookMapper<Book, BookEntity> {

    public transform(item: any): any {
        if (item instanceof Book) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }

    /**
     * Convert {Activity} for {ActivityEntity}.
     *
     * @see Before setting the value, it is important to verify that the type is valid.
     * Therefore, you do not run the risk that in an UPDATE / PATCH action type,
     * attributes that should not be updated are saved with null values.
     * @see Creation Date should not be mapped to the type the repository understands.
     * Because this attribute is created automatically by the database.
     * Therefore, if a null value is passed at update time, an exception is thrown.
     * @param item
     */
    public modelToModelEntity(item: Book): BookEntity {
        const result: BookEntity = new BookEntity()

        if (item.name_of_book !== undefined) result.name_of_book = item.name_of_book
        if (item.author !== undefined) result.author = item.author
        if (item.number_of_pages !== undefined) result.number_of_pages = item.number_of_pages
        if (item.year !== undefined) result.year = item.year
        if (item.edition !== undefined) result.edition = item.edition
        if (item.publishing_company !== undefined) result.publishing_company = item.publishing_company
        if (item.user !== undefined) result.user = item.user

        return result
    }

    /**
     * Convert {ActivityEntity} for {Activity}.
     *
     * @see Each attribute must be mapped only if it contains an assigned value,
     * because at some point the attribute accessed may not exist.
     * @param item
     */
    public modelEntityToModel(item: BookEntity): Book {
        const result: Book = new Book()

        result.name_of_book = item.name_of_book
        result.author = item.author
        result.number_of_pages = item.number_of_pages
        result.year = item.year
        result.edition = item.edition
        result.publishing_company = item.publishing_company
        result.user = new UserEntityMapper().transform(item.user)

        return result
    }

    /**
     * Convert JSON for Activity.
     *
     * @see Each attribute must be mapped only if it contains an assigned value,
     * because at some point the attribute accessed may not exist.
     * @param json
     */
    public jsonToModel(json: any): Book {
        const result: Book = new Book()

        if (!json) return result
        if (json.id !== undefined) result.id = json.id
        if (json.name_of_book !== undefined) result.name_of_book = json.name_of_book
        if (json.author !== undefined) result.author = json.start_time
        if (json.number_of_pages !== undefined) result.number_of_pages = json.number_of_pages
        if (json.year !== undefined) result.year = json.year
        if (json.edition !== undefined) result.edition = json.edition
        if (json.publishing_company !== undefined) result.publishing_company = json.publishing_company
        if (json.user !== undefined) result.user = new UserEntityMapper().transform(json.user)

        return result
    }
}
