import MongoCollection, { CollectionConfig } from "../src/collection";
import MongoDB, { InitMongo } from "../src/index";

InitMongo({
   hostname: process.env.MONGO_HOSTNAME || "localhost",
   port: process.env.MONGO_PORT || 27017,
   username: process.env.MONGO_USERNAME || "root",
   password: process.env.MONGO_PASSWORD || "password",
   params: {
      authMechanism: "DEFAULT"
   }
});

export const DATABASE = <const>{
   TEST: "test"
};

export const db = MongoDB.db(DATABASE.TEST);

export class TodoCollection extends MongoCollection {
   getConfig(): CollectionConfig {
      return {
         name: "todo",
         database: DATABASE.TEST
      };
   }

   static createOne({name, completed}: { name: string, completed: boolean }) {
      return this.getCollection().insertOne({name, completed});
   }
}
