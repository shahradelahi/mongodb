import Collection, { CollectionConfig } from "../src/collection";
import MongoDB, { InitMongo } from "../src/index";

InitMongo({
   hostname: process.env.MONGO_HOSTNAME || "localhost",
   port: process.env.MONGO_PORT || 27017,
   schema: process.env.MONGO_SCHEMA || "mongodb",
   username: process.env.MONGO_USERNAME || "root",
   password: process.env.MONGO_PASSWORD || "password"
});

export const DATABASE = <const>{
   TEST: "test"
};

export const db = MongoDB.db(DATABASE.TEST);

export class TodoCollection extends Collection {
   getConfig(): CollectionConfig {
      return {
         name: "todo",
         memory: false,
         database: "test"
      };
   }

   static createOne({name, completed}: { name: string, completed: boolean }) {
      return this.getCollection().insertOne({name, completed});
   }
}
