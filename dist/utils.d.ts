export interface AuthParams {
    hostname: string;
    schema?: string;
    port?: string | number;
    params?: Record<string, any>;
    username?: string;
    password?: string;
    database?: string;
}
export interface ToObjectOptions {
    $unset?: string[];
    $set?: Record<string, any>;
    $rename?: Record<string, any>;
}
export declare function toObject(doc: any, exec?: ToObjectOptions): any;
export declare function makeUrl(params: AuthParams): string;
