# MongoDB driver for Node.js

This project uses the official MongoDB driver for Node.js. It is a wrapper around the official driver that provides a more convenient API for use with TypeScript and JavaScript.


### Installation

```bash
npm install github:litehex/mongodb
```

### Usage

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

### License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
