import {
   BulkWriteOptions,
   Collection,
   CollectionOptions,
   Condition,
   Db,
   DeleteOptions,
   DeleteResult,
   Document,
   FindCursor as MongoCursor,
   FindOptions,
   InsertManyResult,
   InsertOneOptions,
   InsertOneResult,
   Join,
   MongoClientOptions,
   MongoError,
   NestedPaths,
   ObjectId,
   PropertyType,
   RootFilterOperators,
   UpdateFilter,
   UpdateResult as MongoUpdateResult
} from 'mongodb';

export type {
   Collection as MongoCollection,
   BulkWriteOptions,
   Collection,
   CollectionOptions,
   Db,
   DeleteOptions,
   DeleteResult,
   Document,
   FindOptions,
   InsertManyResult,
   InsertOneOptions,
   InsertOneResult,
   MongoError,
   ObjectId
} from "mongodb";

export interface MongoConfig {
   hostname: string
   schema?: string
   port?: string | number
   params?: Record<string, any> & EnchantedOptions
   username?: string
   password?: string
   database?: string
}

export interface EnchantedOptions extends Omit<MongoClientOptions, 'proxyPort'> {
   proxyPort?: number | string
}

export interface ObjectOptions {
   $unset?: string[],
   $set?: Record<string, any>,
   $rename?: Record<string, any>
}

export type UpdateQuery<TSchema extends Document = any> = UpdateFilter<TSchema> | Partial<TSchema>;

export type UpdateResult<TSchema extends Document = any> = TSchema | MongoUpdateResult;

export type LeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

export type Filter<TSchema> = Partial<TSchema> | ({
   [Property in Join<NestedPaths<WithId<TSchema>, []>, '.'>]?: Condition<PropertyType<WithId<TSchema>, Property>>;
} & RootFilterOperators<WithId<TSchema>>) | ({
   [Property in Join<NestedPaths<TSchema, []>, '.'>]?: Condition<PropertyType<TSchema, Property>>;
} & RootFilterOperators<TSchema>)

export type WithId<TSchema = {}> = TSchema & { _id: ObjectId }

export type OptionalId<TSchema = {}> = Omit<TSchema, '_id'> & { _id?: ObjectId | string }

export type FindCursor<TSchema extends Document = any> = MongoCursor<TSchema> | MongoCursor<WithId<TSchema>>
