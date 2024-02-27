import { Reservation } from '../domain/model/reservation'

export interface IReservationRepository {
    createReservation(reservation: Reservation): Promise<void>
    getReservationById(id: string): Promise<Reservation | undefined>
}
