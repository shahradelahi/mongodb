import { MongoConfig, ObjectOptions } from "./types";

export function toObject(doc: any, exec: ObjectOptions = {}) {

   if (!doc) {
      return doc;
   }

   const { $unset, $set, $rename } = exec;

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

export function makeConnectionString(config: MongoConfig): string {

   const { username, password, hostname, port, database } = config;

   const portStr = config.schema === 'mongodb+srv' ? '' : `:${port?.toString() || '27017'}`;

   const schema = config.schema || 'mongodb';
   let paramsString = ''

   if (config.params) {
      paramsString += '/?';
      Object.keys(config.params).forEach(key => {
         paramsString += `${key}=${config.params ? config.params[key] : ''}&`;
      });
      paramsString = paramsString.slice(0, -1);
   }

   let base = `${schema}://${hostname}${portStr}${paramsString}`;
   if (username && password) {
      base = `${schema}://${username}:${password}@${hostname}${portStr}${paramsString}`;
   }

   return database ? `${base}/${database}` : base;
}
