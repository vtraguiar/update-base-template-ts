import { Library } from 'application/domain/model/library'
import { IEntityMapper } from './entity.mapper.interface'
import { LibraryEntity } from '../library.entity'
import { injectable } from 'inversify'


@injectable()
export class LibraryEntityMapper implements IEntityMapper<Library, LibraryEntity> {
    public transform(item: any): any {
        if (item instanceof Library) return this.modelToModelEntity(item)
        return this.jsonToModel(item)
    }

    public modelToModelEntity(item: Library): LibraryEntity {
        const result: LibraryEntity = new LibraryEntity()

        if (item.title !== undefined) result.title = item.title
        if (item.author !== undefined) result.author = item.author
        if (item.number_of_pages !== undefined) result.number_of_pages = item.number_of_pages
        if (item.year !== undefined) result.year = item.year
        if (item.isbc !== undefined) result.isbc = item.isbc
        if (item.publisher !== undefined) result.publisher = item.publisher

        return result
    }

    public modelEntityToModel(item: LibraryEntity): Library {
        const result: Library = new Library()

        if (item.title !== undefined) result.title = item.title
        if (item.author !== undefined) result.author = item.author
        if (item.number_of_pages !== undefined) result.number_of_pages = item.number_of_pages
        if (item.year !== undefined) result.year = item.year
        if (item.isbc !== undefined) result.isbc = item.isbc
        if (item.publisher !== undefined) result.publisher = item.publisher

        return result
    }

    public jsonToModel(json: any): Library {
        const result: Library = new Library()
        if (!json) return result
        if (json.id !== undefined) result.id = json.identifiers
        if (json.title !== undefined) result.title = json.title
        if (json.author !== undefined) result.author = json.author
        if (json.number_of_pages !== undefined) result.number_of_pages = json.number_of_pages
        if (json.year !== undefined) result.year = json.year
        if (json.isbc !== undefined) result.isbc = json.isbc
        if (json.publisher !== undefined) result.publisher = json.publisher
        return result

    }

}
