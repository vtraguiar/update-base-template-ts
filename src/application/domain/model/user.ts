import { Entity } from './entity'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'

export class User extends Entity implements IJSONSerializable, IJSONDeserializable<User> {
    private _name?: string | undefined
    private _email?: string | undefined
    private _books_readed?: number | undefined
    private _books_borrowed: number = 0

    constructor(id?: string, created_at?: string, updated_at?: string) {
        super(id, created_at, updated_at)
    }

    get name(): string | undefined {
        return this._name
    }

    set name(value: string | undefined) {
        this._name = value
    }

    get email(): string | undefined {
        return this._email
    }

    set email(value: string | undefined) {
        this._email = value
    }

    get books_readed(): number | undefined {
        return this._books_readed
    }

    set books_readed(value: number | undefined) {
        this._books_readed = value
    }

    get books_borrowed(): number {
        return this._books_borrowed
    }

    public incrementBooksBorrowed() {
        this._books_borrowed++
    }

    public fromJSON(json: any): User {
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
        if (json.name !== undefined) this.name = json.name
        if (json.email !== undefined) this.email = json.email
        if (json.books_readed !== undefined) this.books_readed = json.books_readed

        return this
    }

    public toJSON(): any {
        return {
            id: super.id,
            created_at: super.created_at,
            updated_at: super.updated_at,
            name: this.name || undefined,
            email: this.email || undefined,
            books_readed: this.books_readed || undefined
        }
    }
}
