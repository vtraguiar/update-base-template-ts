export abstract class Identifier {
    public static readonly APP: any = Symbol.for('App')

    // Controllers
    public static readonly HOME_CONTROLLER: any = Symbol.for('HomeController')
    public static readonly USER_CONTROLLER: any = Symbol.for('UserController')
    public static readonly BOOK_CONTROLLER: any = Symbol.for('BookController')

    // Services
    public static readonly USER_SERVICE: any = Symbol.for('UserService')
    public static readonly BOOK_SERVICE: any = Symbol.for('BookService')

    // Repositories
    public static readonly INTEGRATION_EVENT_REPOSITORY: any = Symbol.for('IntegrationEventRepository')
    public static readonly USER_REPOSITORY: any = Symbol.for('UserRepository')
    public static readonly BOOK_REPOSITORY: any = Symbol.for('BookRepository')

    // Models
    public static readonly INTEGRATION_EVENT_REPO_MODEL: any = Symbol.for('IntegrationEventRepoModel')
    public static readonly USER_REPO_MODEL: any = Symbol.for('UserRepoModel')
    public static readonly BOOK_REPO_MODEL: any = Symbol.for('BookRepoModel')
    public static readonly USER_ENTITY: any = Symbol.for('UserEntity')
    public static readonly BOOK_ENTITY: any = Symbol.for('BookEntity')

    // Mappers
    public static readonly USER_ENTITY_MAPPER: any = Symbol.for('UserEntityMapper')
    public static readonly BOOK_ENTITY_MAPPER: any = Symbol.for('BookEntityMapper')

    // Background Services
    public static readonly MONGODB_CONNECTION_FACTORY: any = Symbol.for('ConnectionFactoryMongodb')
    public static readonly MONGODB_CONNECTION: any = Symbol.for('ConnectionMongodb')
    public static readonly BACKGROUND_SERVICE: any = Symbol.for('BackgroundService')
    public static readonly RABBITMQ_EVENT_BUS: any = Symbol.for('EventBusRabbitMQ')
    public static readonly RABBITMQ_CONNECTION_FACTORY: any = Symbol.for('RabbitMQConnectionFactory')
    public static readonly RABBITMQ_CONNECTION: any = Symbol.for('RabbitMQConnection')

    // Tasks
    public static readonly REGISTER_SETTINGS_TASK: any = Symbol.for('RegisterSettingsTask')

    // Log
    public static readonly LOGGER: any = Symbol.for('CustomLogger')
}
