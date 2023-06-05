import {QueryResult} from "../../types/maria";
import {MARIA_POOL} from "./pool";

export function query<T>(sql: string, values?: any): Promise<QueryResult<T>> {
  return new Promise((resolve, reject) => {
    MARIA_POOL.query(sql, values ?? null, ((err, results, fields) => {
      if (err !== null) {
        reject(err)
      } else {
        resolve({ results: <T[]>results, fields })
      }
    }))
  })
}
