import { afterAll, describe, expect, test } from "@jest/globals";
import MongoDB from "../src/index";
import { db, TodoCollection } from "./mongodb";
import { faker } from "@faker-js/faker";

const tenMin = 1000 * 60 * 10;

describe("MongoDB", () => {

   test("should connect to MongoDB", async () => {
      expect(db).toBeTruthy();
   }, tenMin);

   test("Database exists", async () => {
      const collections = await db.listCollections().toArray();
      expect(collections.length).toBeGreaterThanOrEqual(0);
   }, tenMin);

});

describe("Collection", () => {

   test("Get collection instance", async () => {
      expect(TodoCollection.getCollection()).toBeTruthy();
   }, tenMin);

   test("Insert document", async () => {
      const result = await TodoCollection.createOne({
         name: faker.lorem.sentence(),
         completed: faker.datatype.boolean()
      });
      expect(result.acknowledged).toBeTruthy();
   }, tenMin);

   test("Get document", async () => {
      const result = await TodoCollection.getCollection().findOne({
         completed: false
      });
      expect(result).toBeTruthy();
   }, tenMin);

});

describe("Utils", () => {

   test("Modify a document", async () => {
      const doc = await TodoCollection.getCollection().findOne({
         completed: false
      });
      expect(doc).toBeTruthy();
      const newDoc = MongoDB.utils.toObject(doc, {
         $unset: ["name"]
      });
      expect(newDoc).toBeTruthy();
      expect(newDoc.name).toBeUndefined();
   }, tenMin);

   test("Make URL", async () => {

      const randomHostname = faker.internet.domainName();

      expect(MongoDB.utils.makeUrl({
         hostname: randomHostname,
         schema: "mongodb+srv",
         username: "root",
         password: "password"
      })).toBe(`mongodb+srv://root:password@${randomHostname}`);

      expect(MongoDB.utils.makeUrl({
         hostname: "localhost",
         port: 27017,
         username: "root",
         password: "password",
         params: {
            authMechanism: "DEFAULT",
         }
      })).toBe("mongodb://root:password@localhost:27017/?authMechanism=DEFAULT");

   }, tenMin);

});

afterAll(async () => {
   await MongoDB.disconnect();
   console.info("Disconnected from MongoDB");
});
