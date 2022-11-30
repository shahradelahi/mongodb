import Collection, { CollectionConfig } from "../src/collection";

export default class TodoCollection extends Collection {
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
