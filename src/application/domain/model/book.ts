import { Entity } from './entity'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { User } from './user'
import { JsonUtils } from '../utils/json.utils'

/**
 * Implementation of activity entity
 *
 * @extends {Entity}
 * @implements {IJSONSerializable, IJSONDeserializable<Activity>}
 */
export class Book extends Entity implements IJSONSerializable, IJSONDeserializable<Book> {
    private _name_of_book?: string | undefined
    private _author?: string | undefined
    private _number_of_pages?: number | undefined
    private _year?: number | undefined
    private _edition?: number | undefined
    private _publishing_company?: string | undefined
    private _status?: boolean | undefined
    private _user!: User | undefined

    constructor(id?: string, created_at?: string, updated_at?: string) {
        super(id, created_at, updated_at)
    }

    get name_of_book(): string | undefined {
        return this._name_of_book
    }

    set name_of_book(value: string | undefined) {
        this._name_of_book = value
    }

    get author(): string | undefined {
        return this._author
    }

    set author(value: string | undefined) {
        this._author = value
    }

    get number_of_pages(): number | undefined {
        return this._number_of_pages
    }

    set number_of_pages(value: number | undefined) {
        this._number_of_pages = value
    }

    get year(): number | undefined {
        return this._year
    }

    set year(value: number | undefined) {
        this._year = value
    }

    get edition(): number | undefined {
        return this._edition
    }

    set edition(value: number | undefined) {
        this._edition = value
    }

    get publishing_company(): string | undefined {
        return this._publishing_company
    }

    set publishing_company(value: string | undefined) {
        this._publishing_company = value
    }

    get status(): boolean | undefined {
        return this._status
    }

    set status(value: boolean | undefined) {
        this._status = value
    }

    get user(): User | undefined {
        return this._user
    }

    set user(value: User | undefined) {
        this._user = value
    }

    public fromJSON(json: any): Book {
        if (!json) {
            return this
        }

        if (typeof json === 'string') {
            if (!JsonUtils.isJsonString(json)) {
                return this
            }
            json = JSON.parse(json)
        }

        if (json.id !== undefined) this.id = json.id
        if (json.created_at !== undefined) this.created_at = json.created_at
        if (json.updated_at !== undefined) this.updated_at = json.updated_at
        if (json.name_of_book !== undefined) this.name_of_book = json.name_of_book
        if (json.author !== undefined) this.author = json.author
        if (json.number_of_pages !== undefined) this.number_of_pages = json.number_of_pages
        if (json.year !== undefined) this.year = json.year
        if (json.publishing_company !== undefined) this.publishing_company = json.publishing_company
        if (json.user !== undefined) this.user = json.user

        return this
    }

    public toJSON(): any {
        return {
            id: super.id,
            created_at: super.created_at,
            updated_at: super.updated_at,
            name_of_book: this.name_of_book || undefined,
            author: this.author || undefined,
            number_of_pages: this.number_of_pages || undefined,
            year: this.year || undefined,
            publishing_company: this.publishing_company || undefined,
            user: this.user || undefined,
        }
    }
}
