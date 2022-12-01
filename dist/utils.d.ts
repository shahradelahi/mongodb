export interface AuthParams {
    hostname: string;
    port: string | number;
    username: string;
    password: string;
    database?: string;
}
export interface ToObjectOptions {
    $unset?: string[];
    $set?: Record<string, any>;
    $rename?: Record<string, any>;
}
export declare function toObject(doc: any, exec?: ToObjectOptions): any;
export declare function makeUrl(params: AuthParams): string;
