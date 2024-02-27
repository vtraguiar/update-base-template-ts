export class Reservation {
    private _book_Id?: string
    private _user_Id?: string
    private _reservation_Date?: Date
    private _loan_Id?: string

    constructor(
        id: string,
        created_at: string,
        updated_at: string,
        bookId: string,
        userId: string,
        reservationDate: Date
    ) {
        this._book_Id = bookId
        this._user_Id = userId
        this._reservation_Date = reservationDate
    }

    get bookId(): string | undefined {
        return this._book_Id
    }

    set bookId(value: string | undefined) {
        this._book_Id = value
    }

    get userId(): string | undefined {
        return this._user_Id
    }

    set userId(value: string | undefined) {
        this._user_Id = value
    }

    get reservationDate(): Date | undefined {
        return this._reservation_Date
    }

    set reservationDate(value: Date | undefined) {
        this._reservation_Date = value
    }

    get loanId(): string | undefined {
        return this._loan_Id
    }

    set loanId(value: string | undefined) {
        this._loan_Id = value
    }
}
