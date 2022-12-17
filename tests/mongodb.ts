import MongoCollection, { CollectionConfig, OptionalId } from "../src/collection";
import MongoDB, { InitMongo } from "../src/index";

export { MongoDB } from "../src/index";


InitMongo({
   hostname: process.env.MONGO_HOSTNAME || "localhost",
   port: process.env.MONGO_PORT || 27017,
   username: process.env.MONGO_USERNAME || "root",
   password: process.env.MONGO_PASSWORD || "password",
   params: {
      authMechanism: "DEFAULT",
      proxyHost: process.env.MONGO_PROXY_HOST || "127.0.0.1",
      proxyPort: process.env.MONGO_PROXY_PORT || 1080
   }
});

export const DATABASE = <const>{
   TEST: "test"
};

export const db = MongoDB.db(DATABASE.TEST);

export type Todo = OptionalId<{
   title: string;
   completed: boolean;
   createdAt: Date;
}>

export class TodoCollection extends MongoCollection<Todo> {
   getConfig(): CollectionConfig {
      return {
         name: "todo",
         database: DATABASE.TEST,
         timestamps: true,
         timestampsFields: {
            createdAt: "createdAt"
         }
      };
   }

   static createOne({name, completed}: { name: string, completed: boolean }) {
      return this.insertOne({name, completed});
   }
}

export type User = OptionalId<{
   nickname: string;
   email: string;
   gems: number;
}>

export class UsersCollection extends MongoCollection<User> {
   getConfig(): CollectionConfig {
      return {
         name: "users",
         database: DATABASE.TEST,
         timestamps: true
      }
   }
}
