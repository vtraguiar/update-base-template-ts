import Mongoose from 'mongoose'

interface IBookModel extends Mongoose.Document{
}

const schema: any = {
    title: String,
    author: String,
    number_of_pages: String,
    year: String,
    isbc: String,
    publisher: String
}

const options: any = {
    timestamp: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJson: {

        transform: (doc, ret) => {
            ret._id = ret.id
            delete ret.id
            return ret
        }
    }
}

export const BookRepoModel = Mongoose.model<IBookModel> (
    'books',
    new Mongoose.Schema(schema, options),
    'books'
)
