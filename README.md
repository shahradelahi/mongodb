# MongoDB driver for Node.js

This project uses the official MongoDB driver for Node.js. It is a wrapper around the official driver that provides a more convenient API for use with TypeScript and JavaScript.

### Installation

```bash
npm install github:litehex/mongodb#dist
```

### Usage

#### Connecting to MongoDB

```typescript
import MongoDB, { InitMongo } from "@litehex/mongodb";

InitMongo({
   hostname: "localhost",
   port: 27017,
   username: "root",
   password: "password"
});

export const db = MongoDB.db("testing");
```

#### Creating a collection

```typescript
import { OptionalId, CollectionConfig } from "@litehex/mongodb";
import Collection from "@litehex/mongodb/collection";

export type User = OptionalId<{
   nickname: string;
   email: string;
}>

export class UsersCollection extends Collection<User> {
   getConfig(): CollectionConfig {
      return {
         name: "users",
         database: "testing"
      }
   }

   static doSomething() {
      console.log("Something");
   }
}
```

### License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
