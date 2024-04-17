import { Container } from 'inversify'
import { Identifier } from './identifiers'
import { App } from '../app'
import { CustomLogger, ILogger } from '../utils/custom.logger'
import { BackgroundService } from '../background/background.service'
import { IConnectionDB } from '../infrastructure/port/connection.db.interface'
import { IConnectionFactory } from '../infrastructure/port/connection.factory.interface'
import { ConnectionFactoryMongodb } from '../infrastructure/database/connection.factory.mongodb'
import { ConnectionMongodb } from '../infrastructure/database/connection.mongodb'
import { IBackgroundTask } from '../application/port/background.task.interface'
import { RegisterTask } from '../background/task/register.task'
import { HomeController } from '../ui/controllers/home.controller'
import { EventBusRabbitMQ } from '../infrastructure/eventbus/rabbitmq/eventbus.rabbitmq'
import { IEventBus } from '../infrastructure/port/event.bus.interface'
import { ConnectionFactoryRabbitMQ } from '../infrastructure/eventbus/rabbitmq/connection.factory.rabbitmq'
import { ConnectionRabbitMQ } from '../infrastructure/eventbus/rabbitmq/connection.rabbitmq'
import { IConnectionEventBus } from '../infrastructure/port/connection.event.bus.interface'
import { IIntegrationEventRepository } from '../application/port/integration.event.repository.interface'
import { IntegrationEventRepository } from '../infrastructure/repository/integration.event.repository'
import { IntegrationEventRepoModel } from '../infrastructure/database/schema/integration.event.schema'
import { RpcServerEventBusTask } from '../background/task/rpc.server.event.bus.task'
import { PublishEventBusTask } from '../background/task/publish.event.bus.task'
import { SubscribeEventBusTask } from '../background/task/subscribe.event.bus.task'
import { UserController } from 'ui/controllers/user.controller'
import { IUserService } from 'application/port/user.service.interface'
import { UserService } from 'application/service/user.service'
import { UserEntity } from 'infrastructure/entity/user.entity'
import { BookController } from 'ui/controllers/book.controller'
import { UserRepoModel } from 'infrastructure/database/schema/utils/user.schema'
import { IBookService } from 'application/port/book.service.interface'
import { BookRepoModel } from 'infrastructure/database/schema/book.schema'
import { BookEntity } from 'infrastructure/entity/book.entity'
import { BookService } from 'application/service/book.service'
import { IBookRepository } from 'application/port/book.repository.interface'
import { BookRepository } from 'infrastructure/repository/book.repository'
import { UserRepository } from 'infrastructure/repository/user.repository'
import { IUserRepository } from 'application/port/user.repository.interface'

class IoC {
    private readonly _container: Container

    /**
     * Creates an instance of Di.
     *
     * @private
     */
    constructor() {
        this._container = new Container()
        this.initDependencies()
    }

    /**
     * Get Container inversify.
     *
     * @returns {Container}
     */
    get container(): Container {
        return this._container
    }

    private initDependencies(): void {
        this._container.bind(Identifier.APP).to(App).inSingletonScope()

        // Controllers
        this._container.bind<HomeController>(Identifier.HOME_CONTROLLER).to(HomeController).inSingletonScope()
        this.container.bind<UserController>(Identifier.USER_CONTROLLER).to(UserController).inSingletonScope()
        this.container.bind<BookController>(Identifier.BOOK_CONTROLLER).to(BookController).inSingletonScope()


        // services
        this.container.bind<IUserService>(Identifier.USER_SERVICE).to(UserService).inSingletonScope()
        this.container.bind<IBookService>(Identifier.BOOK_SERVICE).to(BookService).inSingletonScope()

        // Models
        this._container.bind(Identifier.INTEGRATION_EVENT_REPO_MODEL).toConstantValue(IntegrationEventRepoModel)
        this.container.bind(Identifier.USER_ENTITY).toConstantValue(UserEntity)
        this.container.bind(Identifier.BOOK_ENTITY).toConstantValue(BookEntity)
        this.container.bind(Identifier.USER_REPO_MODEL).toConstantValue(UserRepoModel)
        this.container.bind(Identifier.BOOK_REPO_MODEL).toConstantValue(BookRepoModel)


        // Repositors
        this._container
            .bind<IIntegrationEventRepository>(Identifier.INTEGRATION_EVENT_REPOSITORY)
            .to(IntegrationEventRepository).inSingletonScope()
        this.container
            .bind<IUserRepository>(Identifier.USER_REPOSITORY)
            .to(UserRepository).inSingletonScope()
        this.container
            .bind<IBookRepository>(Identifier.BOOK_REPOSITORY)
            .to(BookRepository).inSingletonScope()

        // Background Services
        this._container
            .bind<IConnectionFactory>(Identifier.RABBITMQ_CONNECTION_FACTORY)
            .to(ConnectionFactoryRabbitMQ).inSingletonScope()
        this._container
            .bind<IConnectionEventBus>(Identifier.RABBITMQ_CONNECTION)
            .to(ConnectionRabbitMQ)
        this._container
            .bind<IEventBus>(Identifier.RABBITMQ_EVENT_BUS)
            .to(EventBusRabbitMQ).inSingletonScope()
        this._container
            .bind<IConnectionFactory>(Identifier.MONGODB_CONNECTION_FACTORY)
            .to(ConnectionFactoryMongodb).inSingletonScope()
        this._container
            .bind<IConnectionDB>(Identifier.MONGODB_CONNECTION)
            .to(ConnectionMongodb).inSingletonScope()
        this._container
            .bind(Identifier.BACKGROUND_SERVICE)
            .to(BackgroundService).inSingletonScope()

        // Tasks
        this._container
            .bind<IBackgroundTask>(Identifier.REGISTER_SETTINGS_TASK)
            .to(RegisterTask).inRequestScope()
        this._container
            .bind<IBackgroundTask>(Identifier.PUBLISH_EVENT_BUS_TASK)
            .to(PublishEventBusTask).inRequestScope()
        this._container
            .bind<IBackgroundTask>(Identifier.SUBSCRIBE_EVENT_BUS_TASK)
            .to(SubscribeEventBusTask).inRequestScope()
        this._container
            .bind<IBackgroundTask>(Identifier.RPC_SERVER_EVENT_BUS_TASK)
            .to(RpcServerEventBusTask).inRequestScope()

        // Log
        this._container.bind<ILogger>(Identifier.LOGGER).to(CustomLogger).inSingletonScope()

    }
}

export const DIContainer = new IoC().container
