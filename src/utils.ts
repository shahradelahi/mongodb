export interface AuthParams {
   hostname: string
   schema?: string
   port: string | number
   params?: Record<string, string>
   username?: string
   password?: string
   database?: string
}

export interface ToObjectOptions {
   $unset?: string[],
   $set?: Record<string, any>,
   $rename?: Record<string, any>
}

export function toObject(doc: any, exec: ToObjectOptions = {}) {
   if (!doc) {
      return doc;
   }
   const {$unset, $set, $rename} = exec;
   $unset && $unset.forEach(key => {
      if (Object.keys(doc).includes(key)) {
         delete doc[key];
      } else {
         if (key.includes('.')) {
            const keys = key.split('.');
            keys.reduce((acc, cur, index) => {
               if (index === keys.length - 1) {
                  if (acc && Object.keys(acc).includes(cur)) {
                     delete acc[cur];
                  } else {
                     return acc;
                  }
               }
               return acc[cur];
            }, doc);
         }
      }
   });
   $set && Object.assign(doc, $set);
   $rename && Object.keys($rename).forEach(key => {
      if (Object.keys(doc).includes(key)) {
         doc[$rename[key]] = doc[key];
         delete doc[key];
      } else {
         if (key.includes('.')) {
            const keys = key.split('.');
            keys.reduce((acc, cur, index) => {
               if (index === keys.length - 1) {
                  doc[$rename[key]] = acc[cur];
                  delete acc[cur];
               }
               return acc[cur];
            }, doc);
         }
      }
   });
   return JSON.parse(JSON.stringify(doc));
}

export function makeUrl(params: AuthParams): string {
   const {username, password, hostname, port, database} = params;
   const portStr = params.schema === 'mongodb+srv' ? '' : `:${port}`;
   const schema = params.schema || 'mongodb';
   let paramsString = ''
   if (params.params) {
      paramsString += '?';
      Object.keys(params.params).forEach(key => {
         paramsString += `${key}=${params.params ? params.params : [key]}&`;
      });
      paramsString = paramsString.slice(0, -1);
   }
   let base = `${schema}://${hostname}${portStr}${paramsString}`;
   if (username && password) {
      base = `${schema}://${username}:${password}@${hostname}${portStr}${paramsString}`;
   }
   return database ? `${base}/${database}` : base;
}
