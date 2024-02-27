import Mongoose from 'mongoose'

interface IBookModel extends Mongoose.Document {
}

const schema: any = {
    name_of_book: String,
    author: String,
    number_of_pages: Number,
    year: Number,
    publishing_company: String,
    user: {
        type: Mongoose.Schema.Types.ObjectId, ref: 'users',
        required: 'User required!'
    }
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

export const ActivityRepoModel = Mongoose.model<IBookModel> (
    'books',
    new Mongoose.Schema(schema, options),
    'books'
)
