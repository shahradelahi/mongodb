import { MongoConfig, ObjectOptions } from "./types";
export declare function toObject(doc: any, exec?: ObjectOptions): any;
export declare function makeConnectionString(config: MongoConfig): string;
