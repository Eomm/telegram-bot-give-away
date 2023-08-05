/// <reference types="@platformatic/db" />
import { EntityHooks } from '@platformatic/sql-mapper'
import { EntityTypes, Event,User,UsersEvent } from './types'

declare module 'fastify' {
  interface FastifyInstance {
    getSchema<T extends 'Event' | 'User' | 'UsersEvent'>(schemaId: T): {
      '$id': string,
      title: string,
      description: string,
      type: string,
      properties: {
        [x in keyof EntityTypes[T]]: { type: string, nullable?: boolean }
      },
      required: string[]
    };
  }
}

declare module '@platformatic/sql-mapper' {
  interface Entities {
    event: Entity<Event>,
    user: Entity<User>,
    usersEvent: Entity<UsersEvent>,
  }
}

declare module '@platformatic/types' {
  interface PlatformaticApp {
    addEntityHooks(entityName: 'event', hooks: EntityHooks<Event>): any
    addEntityHooks(entityName: 'user', hooks: EntityHooks<User>): any
    addEntityHooks(entityName: 'usersEvent', hooks: EntityHooks<UsersEvent>): any
  }
}
