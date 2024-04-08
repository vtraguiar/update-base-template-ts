import { Library } from 'application/domain/model/library'
import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { ILibraryRepository } from 'application/port/library.repository.interface'
import { LibraryEntity } from 'infrastructure/entity/library.entity'
import { LibraryEntityMapper } from 'infrastructure/entity/mapper/library.entity.mapper'
import { ILogger } from 'utils/custom.logger'
import { Identifier } from 'di/identifiers'
import { IQuery } from 'application/port/query.interface'
import { Query } from './query/query'


@injectable()
export class LibraryRepository extends BaseRepository<Library, LibraryEntity> implements ILibraryRepository {
    constructor(
        @inject(Identifier.LIBRARY_REPO_MODEL) readonly libraryModel: any,
        @inject(Identifier.LIBRARY_ENTITY_MAPPER) readonly libraryMapper: LibraryEntityMapper,
        @inject(Identifier.LOGGER) readonly logger: ILogger
    ){
        super(libraryModel, libraryMapper, logger)
    }

    public find(query: IQuery): Promise<Array<Library>> {
        const q: any = query.toJSON()
        return new Promise<Array<Library>>((resolve, reject) => {
            this.Model.find(q.filters)
                .select(q.fields)
                .populate('library')
                .sort(q.ordination)
                .skip(Number((q.pagination.limit * q.pagination.page) - q.pagination.limit))
                .limit(Number(q.pagination.limit))
                .exec()
                .then((result: Array<LibraryEntity>) => {
                    resolve(result.map(item => this.libraryMapper.transform(item)))
                })
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

    public findOne(query: IQuery): Promise<Library> {
        const q: any = query.toJSON()
        return new Promise<Library>((resolve, reject) => {
            this.Model.findOne(q.filters)
                .select(q.fields)
                .populate('library')
                .exec()
                .then((result: LibraryEntity) => {
                    if (!result) return resolve(new Library())
                    return resolve(this.libraryMapper.transform(result))
                })
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

    public update(item: Library): Promise<Library> {
        const library: LibraryEntity = this.libraryMapper.transform(item)
        return new Promise<Library>((resolve, reject) => {
            this.Model.findOneAndUpdate({_id: item.id}, library, {new: true})
                .exec()
                .then(result => {
                    if (!result) return resolve(new Library())
                    result.populate('library')
                    .execPopulate()
                    .then((res) => resolve(this.libraryMapper.transform(res)))
                })
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })  
    }

    public async checkExist(book: Library): Promise<boolean> {
        const query: Query = new Query()
        return new Promise<boolean>((resolve, reject) => {
            if (book.title && book.id) {
                query.filters = {title: book.title, id: book.id}
            }
            super.findOne(query)
                .then((result: Library | undefined) => {
                    if (result) return resolve(true)
                    return resolve(false)
                })
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

}
