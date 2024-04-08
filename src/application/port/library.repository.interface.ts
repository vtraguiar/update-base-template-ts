import { Library } from 'application/domain/model/library'
import { IRepository } from './repository.interface'

export interface ILibraryRepository extends IRepository<Library> {
    checkExist(library: Library): Promise<boolean>
}