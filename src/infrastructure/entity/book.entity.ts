import { User } from '../../application/domain/model/user'

export class BookEntity {
     public name_of_book?: string
     public author?: string
     public number_of_pages?: number
     public year?: number
     public edition?: number
     public publishing_company?: string
     public status?: boolean
     public user?: User
}
