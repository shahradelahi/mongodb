import MongoDB, { InitMongo } from "../src/index";

InitMongo({
   hostname: "localhost",
   port: 27017,
   username: "root",
   password: "password"
});

export const DATABASE = {
   TEST: "test"
}

export const db = MongoDB.db(DATABASE.TEST);
