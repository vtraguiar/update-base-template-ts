import { Book } from 'application/domain/model/book'
import { Reservation } from 'application/domain/model/reservation'
import { User } from 'application/domain/model/user'
import { injectable } from 'inversify'
import randomstring from 'randomstring'

@injectable()
export class BookReservation {
    public reserveBook(book: Book, user: User) {
        try {
            if (book.status !== true) {
                throw new Error('O livro não está disponível para reserva!')
            }

            const reservation: Reservation = {
                bookId: book.id,
                userId: user.id,
                reservationDate: new Date(),
                loanId: randomstring.generate({ length: 10 })
            }

            user.incrementBooksBorrowed()
            console.log(user.books_borrowed)
            book.status = false
            return reservation
        } catch (error: any) {
            console.error('Erro ao reservar o livro:', error.message)
            return null
        }
    }
}

