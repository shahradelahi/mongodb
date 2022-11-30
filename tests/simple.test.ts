import { afterAll, describe, expect, test } from "@jest/globals";
import TodoCollection from "./todo.collection";
import MongoDB from "../src/index";
import { db } from "./mongodb";

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
      const result = await TodoCollection.getCollection().insertOne({
         name: "Test",
         completed: false
      });
      expect(result.acknowledged).toBeTruthy();
   }, tenMin);

   test("Get document", async () => {
      const result = await TodoCollection.getCollection().findOne({
         name: "Test"
      });
      expect(result).toBeTruthy();
   }, tenMin);

});

describe("Utils", () => {

   test("Modify a document", async () => {
      const doc = await TodoCollection.getCollection().findOne({
         name: "Test"
      });
      expect(doc).toBeTruthy();
      const newDoc = MongoDB.utils.toObject(doc, {
         $unset: ["name"]
      });
      expect(newDoc).toBeTruthy();
      expect(newDoc.name).toBeUndefined();
   }, tenMin);

});

afterAll(async () => {
   await MongoDB.disconnect();
});
